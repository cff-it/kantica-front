import type { SongFormInput } from './schemas';
import { getSectionsDefaults, toSectionsPayload } from './sections';
import type { Song, SongInput } from './types';

// Valeurs de départ du formulaire : champs vides pour un nouveau cantique, ceux
// du cantique enregistré pour une modification. Les champs facultatifs absents
// (`null`) deviennent des chaînes vides, que React Hook Form attend.
export function getSongDefaults(song?: Song): SongFormInput {
  return {
    title: song?.title ?? '',
    author: song?.author ?? '',
    reference: song?.reference ?? '',
    sections: getSectionsDefaults(song?.sections),
  };
}

// Corps du POST et du PUT. Un champ facultatif vide part en `null`. Les notes
// ne sont pas saisies (absentes de la maquette) mais le PUT est complet : sans
// elles, le back les effacerait. Elles repartent donc telles qu'enregistrées.
export function toSongInput(
  values: SongFormInput,
  notes: string | null = null,
): SongInput {
  return {
    title: values.title,
    author: values.author === '' ? null : values.author,
    reference: values.reference === '' ? null : values.reference,
    notes,
    sections: toSectionsPayload(values.sections),
  };
}
