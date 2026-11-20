import { z } from 'zod';

import {
  EMERGENCY_PHONES_MAX_LENGTH,
  PROFILE_PHONES_MAX_LENGTH,
} from '@/lib/phone';
import { phonesSchema } from '@/lib/phone-schema';

import { IMPORT_FILE_MAX_BYTES } from './imports';

// Valeurs de l'enum VoicePart du back.
const voiceGroupSchema = z.enum(['S', 'A', 'T', 'B'], {
  error: 'Choisissez la voix',
});

// Texte obligatoire, nettoyé (`trim`) avant validation.
function requiredText(message: string, max: number) {
  return z.string().trim().min(1, message).max(max, 'Texte trop long');
}

// Texte facultatif : une saisie vide reste une chaîne vide dans le formulaire
// et part en `null` (voir `toUpdateMemberInput`).
function optionalText(max: number) {
  return z.string().trim().max(max, 'Texte trop long');
}

// Les dates restent du texte : le back lit jj/mm/aaaa, mm/aaaa, aaaa ou
// « Septembre 2019 », vérifie le format et refuse le futur. Ici, seule la
// présence est contrôlée ; l'erreur 422 s'affiche sous le champ.
const DATE_MAX_LENGTH = 30;

function sacramentSchema() {
  return z.object({
    date: requiredText('Date requise', DATE_MAX_LENGTH),
    place: requiredText('Lieu requis', 255),
  });
}

// UpdateMemberProfileRequest : fiche de recensement complète, telle que la
// maquette 11-Modification-fiche-membre la saisit. Les clés imbriquées
// (`baptism.date`...) suivent le corps du PUT, pour que les erreurs 422 du back
// tombent sur le bon champ. Le matricule est facultatif (« à laisser vide si
// vous résidez à l'étranger »), comme côté back.
export const memberRecordSchema = z.object({
  last_name: requiredText('Nom requis', 100),
  first_name: requiredText('Prénom requis', 100),
  birth_date: requiredText('Date de naissance requise', DATE_MAX_LENGTH),
  birth_place: requiredText('Lieu de naissance requis', 255),
  // Un ou plusieurs numéros E.164 joints par « / » (`PhoneListField`).
  phone: phonesSchema('Téléphone requis', PROFILE_PHONES_MAX_LENGTH),
  address: requiredText('Adresse requise', 2000),
  social_pseudo: optionalText(255),
  voice_group: voiceGroupSchema,
  adhesion_date: requiredText('Date d\'adhésion requise', DATE_MAX_LENGTH),
  engagement_date: optionalText(DATE_MAX_LENGTH),
  engagement_place: optionalText(255),
  region_registration_number: optionalText(255),
  baptism: sacramentSchema(),
  first_communion: sacramentSchema(),
  confirmation: sacramentSchema(),
  marriage: z.object({
    spouse: optionalText(255),
    date: optionalText(DATE_MAX_LENGTH),
    place: optionalText(255),
  }),
  emergency_contact: z.object({
    relationships: z.array(z.string()).min(1, 'Choisissez au moins un lien'),
    name: requiredText('Nom de la personne à contacter requis', 255),
    // Un ou plusieurs numéros E.164 joints par « / » (`PhoneListField`).
    phone: phonesSchema(
      'Numéro à contacter requis',
      EMERGENCY_PHONES_MAX_LENGTH,
    ),
  }),
});

export type MemberRecordInput = z.infer<typeof memberRecordSchema>;

// CreateMemberRequest : la fiche complète et l'email du compte. L'email est
// nettoyé avant validation (les claviers mobiles ajoutent souvent une espace
// finale) ; le back l'écrit en minuscules et refuse une adresse déjà utilisée
// (422 sur `mail`, affiché sous le champ).
export const createMemberSchema = memberRecordSchema.extend({
  mail: z
    .string()
    .trim()
    .min(1, 'Adresse email requise')
    .pipe(z.email('Adresse email invalide'))
    .pipe(z.string().max(255, 'Adresse email trop longue')),
});

export type CreateMemberFormInput = z.infer<typeof createMemberSchema>;

// Fichier d'import (ImportUsersRequest du back : .xlsx, 5 Mo). Ces deux règles
// sont contrôlées avant l'envoi, pour ne pas téléverser un fichier refusé
// d'avance ; les autres refus (illisible, colonnes manquantes, plus de 500
// lignes) viennent du back en 422, sur le champ `file`.
export const importFileSchema = z.object({
  file: z
    .instanceof(File, { error: 'Choisissez un fichier Excel.' })
    .refine((file) => /\.xlsx$/i.test(file.name), {
      error: 'Le fichier doit être au format Excel (.xlsx).',
    })
    .refine((file) => file.size <= IMPORT_FILE_MAX_BYTES, {
      error: 'Le fichier ne doit pas dépasser 5 Mo.',
    }),
});

export type ImportFileInput = z.infer<typeof importFileSchema>;
