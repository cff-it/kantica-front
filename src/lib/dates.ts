// Dates de la fiche : lecture de la saisie (jj/mm/aaaa, mm/aaaa, aaaa) pour le
// sélecteur de date, et écriture de son choix. Le back accepte une date au
// jour, au mois ou à l'année seulement, sauf la naissance (jour complet).

export type DatePrecision = 'year' | 'month' | 'day';

export type DateParts = {
  precision: DatePrecision;
  year: number;
  // Null quand la précision est l'année.
  month: number | null;
  // Null quand la précision est l'année ou le mois.
  day: number | null;
};

// Le back refuse les dates avant 1900 et dans le futur (`PartialDateRule`).
export const DATE_MIN_YEAR = 1900;

export const MONTH_NAMES = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

// Minuscules et sans accents : « Août » et « aout » se lisent pareil.
function normalize(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

const MONTH_KEYS = MONTH_NAMES.map(normalize);

export function getToday(): { year: number; month: number; day: number } {
  const now = new Date();

  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

// Place du 1er du mois dans une semaine qui commence le lundi (0 à 6).
export function getFirstWeekdayOffset(year: number, month: number): number {
  return (new Date(year, month - 1, 1).getDay() + 6) % 7;
}

// Dernier mois choisissable d'une année : jamais dans le futur.
export function getLastMonth(year: number): number {
  const today = getToday();

  return year === today.year ? today.month : 12;
}

// Dernier jour choisissable d'un mois : jamais dans le futur.
export function getLastDay(year: number, month: number): number {
  const today = getToday();

  return year === today.year && month === today.month
    ? today.day
    : getDaysInMonth(year, month);
}

// Null pour une date impossible, avant 1900 ou dans le futur.
function build(
  precision: DatePrecision,
  year: number,
  month: number | null,
  day: number | null,
): DateParts | null {
  if (year < DATE_MIN_YEAR || year > getToday().year) {
    return null;
  }

  if (month !== null && (month < 1 || month > getLastMonth(year))) {
    return null;
  }

  if (day !== null) {
    if (month === null || day < 1 || day > getLastDay(year, month)) {
      return null;
    }
  }

  return { precision, year, month, day };
}

// Lit la saisie d'un champ de date : 12/03/1998, 1998-03-12, 05/1998, 1998-05,
// 2008, « Septembre 2019 » ou « 15 août 2012 ». Null quand elle ne se lit pas
// ou n'est pas une date valide : le sélecteur s'ouvre alors sur aujourd'hui.
export function parseDateInput(text: string): DateParts | null {
  const value = normalize(text);
  let match = value.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/);

  if (match) {
    return build('day', Number(match[3]), Number(match[2]), Number(match[1]));
  }

  match = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);

  if (match) {
    return build('day', Number(match[1]), Number(match[2]), Number(match[3]));
  }

  match = value.match(/^(\d{1,2})[/.-](\d{4})$/);

  if (match) {
    return build('month', Number(match[2]), Number(match[1]), null);
  }

  match = value.match(/^(\d{4})-(\d{1,2})$/);

  if (match) {
    return build('month', Number(match[1]), Number(match[2]), null);
  }

  match = value.match(/^(?:(\d{1,2})\s+)?([a-z]+)\s+(\d{4})$/);

  if (match) {
    const month = MONTH_KEYS.indexOf(match[2]) + 1;

    if (month === 0) {
      return null;
    }

    return match[1]
      ? build('day', Number(match[3]), month, Number(match[1]))
      : build('month', Number(match[3]), month, null);
  }

  match = value.match(/^\d{4}$/);

  return match ? build('year', Number(match[0]), null, null) : null;
}

// Écrit le choix du sélecteur comme le back le lit : 12/03/1998, 03/1998 ou
// 1998.
export function formatDateInput({
  precision,
  year,
  month,
  day,
}: DateParts): string {
  if (precision === 'year' || month === null) {
    return String(year);
  }

  if (precision === 'month' || day === null) {
    return `${pad(month)}/${year}`;
  }

  return `${pad(day)}/${pad(month)}/${year}`;
}

// Date en toutes lettres, pour confirmer le choix : « 12 mars 1998 »,
// « Mai 1998 » ou « 2008 ».
export function describeDate({ year, month, day }: DateParts): string {
  if (month === null) {
    return String(year);
  }

  const monthName = MONTH_NAMES[month - 1];

  if (day === null) {
    return `${monthName} ${year}`;
  }

  return `${day === 1 ? '1er' : day} ${monthName.toLowerCase()} ${year}`;
}
