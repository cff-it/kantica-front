import { z } from 'zod';

import { SECTION_TYPES } from './sections';

// Une section du formulaire. `section_id` (identifiant enregistré, null pour
// une section nouvelle) et `number` (numéro saisi) ne s'affichent pas : ils
// accompagnent la section pour que le PUT la mette à jour sans rien effacer
// (voir `getSectionsDefaults`). `section_id` et non `id` : React Hook Form
// réserve `id` à la clé de ses listes (`useFieldArray`).
export const songSectionSchema = z.object({
  section_id: z.number().int().nullable(),
  type: z.enum(SECTION_TYPES),
  number: z.number().int().nullable(),
  // Même message que le back (`sections.*.text.required`).
  text: z.string().trim().min(1, 'Le texte de la section est obligatoire.'),
});

// Liste ordonnée des sections : le back accepte un cantique sans paroles
// (SongRequest : `sections` facultatif), aucune section n'est exigée.
export const songSectionsSchema = z.array(songSectionSchema);

export type SongSectionInput = z.infer<typeof songSectionSchema>;

// Partie du formulaire d'un cantique que lisent les sections ; le schéma du
// formulaire entier l'étend avec `sections: songSectionsSchema`.
export type SongSectionsInput = {
  sections: SongSectionInput[];
};
