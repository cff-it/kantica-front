import type { DefaultValues } from 'react-hook-form';

import { joinPhones, splitPhones } from '@/lib/phone';
import { toVoice } from '@/lib/voices';
import type { MemberSacrament, User } from '@/types';

import type { CreateMemberFormInput, MemberRecordInput } from './schemas';
import type {
  CreateMemberInput,
  UpdateMemberInput,
  UpdateMemberSacrament,
} from './types';

// Liens proposés pour le contact en cas d'urgence (maquette 11). Le back les
// stocke tels quels (texte, joints par une virgule) : ces libellés sont les
// valeurs envoyées.
export const EMERGENCY_RELATIONSHIPS = [
  'Parents',
  'Famille',
  'Tuteur/Tutrice',
  'Ami(e) proche',
];

// Choix du contact d'urgence : les liens de la maquette, puis ceux de la fiche
// qui n'en font pas partie (fiche importée, par exemple), pour qu'ils restent
// visibles et décochables.
export function getRelationshipOptions(stored: string[] = []): string[] {
  const extras = stored.filter(
    (relationship) => !EMERGENCY_RELATIONSHIPS.includes(relationship),
  );

  return [...EMERGENCY_RELATIONSHIPS, ...extras];
}

// Date de l'API (1998-03-12, 1998-05, 2008) vers la saisie de la maquette
// (12/03/1998, 05/1998, 2008).
export function toDisplayDate(value: string | null | undefined): string {
  return value ? value.split('-').reverse().join('/') : '';
}

function sacramentDefaults(sacrament: MemberSacrament | undefined) {
  return {
    date: toDisplayDate(sacrament?.date),
    place: sacrament?.place ?? '',
  };
}

// Valeurs de départ du formulaire « Modifier la fiche » : la fiche du membre,
// avec une chaîne vide pour tout champ non renseigné. Sans membre (ajout d'un
// membre), tous les champs sont vides et la voix reste à choisir.
export function getMemberRecordDefaults(
  member?: User,
): DefaultValues<MemberRecordInput> {
  const profile = member?.profile;
  const marriage = profile?.marriage;
  const contact = profile?.emergency_contact;

  return {
    last_name: profile?.last_name ?? member?.last_name ?? '',
    first_name: profile?.first_name ?? '',
    birth_date: toDisplayDate(profile?.birth_date),
    birth_place: profile?.birth_place ?? '',
    // Un ou plusieurs numéros, chacun relu en E.164 (« / » entre eux).
    phone: joinPhones(splitPhones(profile?.phone)),
    address: profile?.address ?? '',
    social_pseudo: profile?.social_pseudo ?? '',
    voice_group: toVoice(profile?.voice_group),
    adhesion_date: toDisplayDate(profile?.adhesion_date),
    engagement_date: toDisplayDate(profile?.engagement_date),
    engagement_place: profile?.engagement_place ?? '',
    region_registration_number: profile?.region_registration_number ?? '',
    baptism: sacramentDefaults(profile?.baptism),
    first_communion: sacramentDefaults(profile?.first_communion),
    confirmation: sacramentDefaults(profile?.confirmation),
    marriage: {
      spouse: marriage?.spouse ?? '',
      date: toDisplayDate(marriage?.date),
      place: marriage?.place ?? '',
    },
    emergency_contact: {
      relationships: contact?.relationships ?? [],
      name: contact?.name ?? '',
      // Un ou plusieurs numéros, chacun relu en E.164 (« / » entre eux).
      phone: joinPhones(splitPhones(contact?.phone)),
    },
  };
}

// Champ facultatif vide : `null`, que le PUT complet efface côté back.
function orNull(value: string): string | null {
  return value === '' ? null : value;
}

function toSacramentInput(
  sacrament: MemberRecordInput['baptism'],
): UpdateMemberSacrament {
  return { date: sacrament.date, place: sacrament.place };
}

// Corps du PUT d'après le formulaire. La voix précise (A2...) n'est pas
// envoyée : le back la garde tant que le groupe ne change pas.
export function toUpdateMemberInput(
  values: MemberRecordInput,
): UpdateMemberInput {
  return {
    last_name: values.last_name,
    first_name: values.first_name,
    voice_group: values.voice_group,
    phone: values.phone,
    birth_date: values.birth_date,
    birth_place: values.birth_place,
    address: values.address,
    social_pseudo: orNull(values.social_pseudo),
    region_registration_number: orNull(values.region_registration_number),
    adhesion_date: values.adhesion_date,
    engagement_date: orNull(values.engagement_date),
    engagement_place: orNull(values.engagement_place),
    baptism: toSacramentInput(values.baptism),
    first_communion: toSacramentInput(values.first_communion),
    confirmation: toSacramentInput(values.confirmation),
    marriage: {
      spouse: orNull(values.marriage.spouse),
      date: orNull(values.marriage.date),
      place: orNull(values.marriage.place),
    },
    emergency_contact: values.emergency_contact,
  };
}

// Valeurs de départ de « Ajouter un membre » : une fiche vide et l'email à
// saisir.
export function getNewMemberDefaults(): DefaultValues<CreateMemberFormInput> {
  return { ...getMemberRecordDefaults(), mail: '' };
}

// Corps du POST d'après le formulaire d'ajout : l'email du compte et la fiche,
// écrite comme celle du PUT (la voix précise n'est pas envoyée non plus : le
// back choisit la voix du groupe).
export function toCreateMemberInput(
  values: CreateMemberFormInput,
): CreateMemberInput {
  return { mail: values.mail, ...toUpdateMemberInput(values) };
}
