import {
  getCountries,
  getCountryCallingCode,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
  type CountryCode,
} from 'libphonenumber-js/min';

// Numéros de téléphone de la fiche. Le front les saisit avec un pays et un
// numéro national, et les envoient au back en E.164 (+261341234567). Le back
// garde ces textes tels quels (`phone` à 30 caractères, contact d'urgence à
// 50), avec ou sans règle E.164 selon sa version : le front envoie toujours de
// l'E.164. Les anciens numéros (« 034 12 345 67 ») sont relus ici, et réécrits
// en E.164 au prochain enregistrement.

export type PhoneCountryCode = CountryCode;

// Madagascar : pays des numéros enregistrés ou saisis sans indicatif.
export const DEFAULT_PHONE_COUNTRY: PhoneCountryCode = 'MG';

// Pays proposés en tête du sélecteur : Madagascar, puis ceux de la diaspora.
const PRIORITY_COUNTRIES: PhoneCountryCode[] = ['MG', 'FR', 'RE', 'MU', 'KM'];

// Drapeau d'un pays en emoji : les deux lettres du code ISO deviennent deux
// « indicateurs régionaux » Unicode (MG donne 🇲🇬). Un système sans police de
// drapeaux (Windows) affiche les deux lettres à la place.
export function getFlag(country: PhoneCountryCode): string {
  return String.fromCodePoint(
    ...[...country].map((letter) => 0x1f1e6 + letter.charCodeAt(0) - 65),
  );
}

export type PhoneCountry = {
  code: PhoneCountryCode;
  // « 🇲🇬 Madagascar (+261) »
  label: string;
  callingCode: string;
};

let phoneCountries: PhoneCountry[] | null = null;

// Tous les pays, noms en français, ceux de `PRIORITY_COUNTRIES` d'abord puis
// l'ordre alphabétique. Calculé une fois.
export function getPhoneCountries(): PhoneCountry[] {
  if (phoneCountries) {
    return phoneCountries;
  }

  const names = new Intl.DisplayNames(['fr'], { type: 'region' });
  const rank = (code: PhoneCountryCode) => {
    const index = PRIORITY_COUNTRIES.indexOf(code);

    return index === -1 ? PRIORITY_COUNTRIES.length : index;
  };

  phoneCountries = getCountries()
    .map((code) => ({
      code,
      name: names.of(code) ?? code,
      callingCode: getCountryCallingCode(code),
    }))
    .sort(
      (a, b) =>
        rank(a.code) - rank(b.code) || a.name.localeCompare(b.name, 'fr'),
    )
    .map(({ code, name, callingCode }) => ({
      code,
      label: `${getFlag(code)} ${name} (+${callingCode})`,
      callingCode,
    }));

  return phoneCountries;
}

export function getCallingCode(country: PhoneCountryCode): string {
  return getCountryCallingCode(country);
}

// Texte saisi (national ou international) vers E.164 : « 034 12 345 67 » en
// Madagascar donne +261341234567. Un texte trop court ou mal formé donne
// quand même un numéro (incomplet) : `isValidPhone` le refuse, et la saisie en
// cours reste lisible par le formulaire. Vide donne vide.
export function toE164(text: string, country: PhoneCountryCode): string {
  const value = text.trim();

  if (value === '') {
    return '';
  }

  const parsed = parsePhoneNumberFromString(value, country);

  if (parsed) {
    return parsed.number;
  }

  const digits = value.replace(/\D/g, '');

  if (digits === '') {
    return value;
  }

  return value.startsWith('+')
    ? `+${digits}`
    : `+${getCountryCallingCode(country)}${digits.replace(/^0+/, '')}`;
}

// Numéro complet et valide pour son pays, au format E.164.
export function isValidPhone(value: string): boolean {
  return isValidPhoneNumber(value);
}

// Numéro enregistré vers E.164 quand il se lit (« 034 12 345 67 »,
// « +261 34 00 000 00 »), sinon tel quel : le formulaire demande de le corriger.
export function normalizePhone(value: string | null | undefined): string {
  const text = value?.trim() ?? '';

  if (text === '') {
    return '';
  }

  const parsed = parsePhoneNumberFromString(text, DEFAULT_PHONE_COUNTRY);

  return parsed?.isValid() ? parsed.number : text;
}

// Affichage d'un numéro enregistré : +261 34 12 345 67. Un numéro qui ne se
// lit pas est affiché tel quel.
export function formatPhone(value: string): string {
  const parsed = parsePhoneNumberFromString(value, DEFAULT_PHONE_COUNTRY);

  return parsed?.isValid() ? parsed.formatInternational() : value;
}

export type PhoneInput = {
  country: PhoneCountryCode;
  // Numéro national tel qu'affiché : « 034 12 345 67 ».
  text: string;
};

// Valeur du formulaire vers pays et numéro national du champ. Un numéro qui
// ne se lit pas reste affiché tel quel, sur le pays par défaut.
export function toPhoneInput(value: string): PhoneInput {
  const parsed = value
    ? parsePhoneNumberFromString(value, DEFAULT_PHONE_COUNTRY)
    : undefined;

  if (parsed?.country) {
    return { country: parsed.country, text: parsed.formatNational() };
  }

  return { country: DEFAULT_PHONE_COUNTRY, text: value };
}

// Numéro international saisi ou collé (« +33 6 12 34 56 78 ») : son pays
// remplace celui du sélecteur. Null tant que le texte n'est pas un numéro
// international valide.
export function parseInternationalPhone(text: string): PhoneInput | null {
  const value = text.trim();

  if (!value.startsWith('+')) {
    return null;
  }

  const parsed = parsePhoneNumberFromString(value);

  return parsed?.country && parsed.isValid()
    ? { country: parsed.country, text: parsed.formatNational() }
    : null;
}

// Numéro national mis en forme à la sortie du champ : « 34 12 345 67 » donne
// « 034 12 345 67 ». Inchangé tant que le numéro n'est pas valide.
export function formatNationalPhone(
  text: string,
  country: PhoneCountryCode,
): string {
  const parsed = parsePhoneNumberFromString(text.trim(), country);

  return parsed?.isValid() ? parsed.formatNational() : text;
}

// Plusieurs numéros dans un champ (numéro du membre, contact d'urgence) :
// chacun en E.164, joints par « / ». C'est le format de la maquette
// « Numéro(s) de téléphone à contacter » et celui que le back lit quand il
// valide l'E.164 (`E164Phones`) ; sinon il garde la chaîne telle quelle. À la
// lecture, « / », « ; » et la virgule séparent aussi les numéros.
export const PHONES_SEPARATOR = ' / ';

// Longueurs des colonnes côté back, séparateurs compris. Le numéro du membre
// (`user_profiles.phone`, `varchar(30)`) accepte deux numéros malgaches (13
// caractères chacun), pas trois. Celui du contact d'urgence
// (`user_emergency_contacts.contact_phone`) en accepte trois (50).
export const PROFILE_PHONES_MAX_LENGTH = 30;
export const EMERGENCY_PHONES_MAX_LENGTH = 50;

function splitPhoneText(value: string | null | undefined): string[] {
  return (value ?? '')
    .split(/[/;,]/)
    .map((part) => part.trim())
    .filter((part) => part !== '');
}

// Numéros enregistrés vers une liste de numéros, chacun relu en E.164 quand il
// se lit (`normalizePhone`).
export function splitPhones(value: string | null | undefined): string[] {
  return splitPhoneText(value).map(normalizePhone);
}

// Liste de numéros vers la valeur du formulaire : les numéros vides sont
// ignorés, les autres sont joints comme le back les enregistre.
export function joinPhones(phones: string[]): string {
  return phones
    .map((phone) => phone.trim())
    .filter((phone) => phone !== '')
    .join(PHONES_SEPARATOR);
}

// Au moins un numéro, et chacun est complet et valide pour son pays.
export function arePhonesValid(value: string): boolean {
  const phones = splitPhoneText(value);

  return phones.length > 0 && phones.every(isValidPhone);
}

// Affichage des numéros enregistrés au format international, un par ligne par
// défaut (`separator` : « / » pour une ligne de texte).
export function formatPhones(
  value: string | null | undefined,
  separator = '\n',
): string {
  return splitPhones(value).map(formatPhone).join(separator);
}
