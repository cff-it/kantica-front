import { z } from 'zod';

import { SECTION_TYPES } from './sections';

// Même règle que le back (`sections.*.number` : entier de 1 à 999, facultatif).
// Le champ vide donne `null` (voir `parseSectionNumber`), une saisie illisible
// reste du texte : le même message couvre tous les refus.
const SECTION_NUMBER_MESSAGE = 'Numéro de 1 à 999.';

const sectionNumberSchema = z
  .number({ error: SECTION_NUMBER_MESSAGE })
  .int(SECTION_NUMBER_MESSAGE)
  .min(1, SECTION_NUMBER_MESSAGE)
  .max(999, SECTION_NUMBER_MESSAGE)
  .nullable();

// Une section du formulaire. `section_id` (identifiant enregistré, null pour
// une section nouvelle) ne s'affiche pas : il accompagne la section pour que le
// PUT la mette à jour au lieu de la recréer (voir `getSectionsDefaults`).
// `section_id` et non `id` : React Hook Form réserve `id` à la clé de ses
// listes (`useFieldArray`). `number` est le numéro saisi (Couplet 1, 2, 3) : le
// back le garde tel quel, sans jamais le calculer ni le renuméroter, d'où un
// champ visible que l'admin corrige quand l'ordre ou le type change.
export const songSectionSchema = z.object({
  section_id: z.number().int().nullable(),
  type: z.enum(SECTION_TYPES),
  number: sectionNumberSchema,
  // Même message que le back (`sections.*.text.required`).
  text: z.string().trim().min(1, 'Le texte de la section est obligatoire.'),
});

// Liste ordonnée des sections : le back accepte un cantique sans paroles
// (SongRequest : `sections` facultatif), aucune section n'est exigée.
export const songSectionsSchema = z.array(songSectionSchema);

export type SongSectionInput = z.infer<typeof songSectionSchema>;

// SongRequest : titre obligatoire (255 caractères au plus), auteur (255) et
// référence (50) facultatifs, puis les sections. Un champ facultatif vide reste
// une chaîne vide dans le formulaire et part en `null` (voir `toSongInput`).
// Maquette 03-Repertoire-et-voix, « Édition cantique » : le thème liturgique
// n'est pas saisi (hors `SongRequest`, il arrive avec KAN-23).
export const songFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Le titre est obligatoire.')
    .max(255, 'Titre trop long (255 caractères au plus).'),
  author: z.string().trim().max(255, 'Texte trop long (255 caractères au plus).'),
  reference: z
    .string()
    .trim()
    .max(50, 'Référence trop longue (50 caractères au plus).'),
  sections: songSectionsSchema,
});

export type SongFormInput = z.infer<typeof songFormSchema>;
