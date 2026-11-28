import type { SongSectionInput } from './schemas';
import type { SectionType, SongSection, SongSectionPayload } from './types';

// Tous les types connus du back, `pont` compris.
export const SECTION_TYPES = ['couplet', 'refrain', 'pont'] as const;

// Types que le sélecteur propose (maquette 04-Edition-cantique-admin).
export const SECTION_TYPE_OPTIONS = [
  { value: 'couplet', label: 'Couplet' },
  { value: 'refrain', label: 'Refrain' },
] as const;

export const SECTION_TYPE_LABELS: Record<SectionType, string> = {
  couplet: 'Couplet',
  refrain: 'Refrain',
  pont: 'Pont',
};

// Valeurs de départ du formulaire : les sections du cantique, dans l'ordre de
// leur position. L'identifiant (`section_id`) n'est pas affiché mais voyage
// avec la section : le PUT remplace la liste, et une section renvoyée sans
// `id` serait recréée au lieu d'être mise à jour. Le numéro (`number`) est
// affiché dans le champ « Numéro » : un numéro omis serait effacé.
export function getSectionsDefaults(
  sections: SongSection[] = [],
): SongSectionInput[] {
  return [...sections]
    .sort((a, b) => a.position - b.position)
    .map((section) => ({
      section_id: section.id,
      type: section.type,
      number: section.number,
      text: section.text,
    }));
}

// Section ajoutée par « + Couplet » ou « + Refrain » : pas encore enregistrée
// (pas d'identifiant), sans numéro saisi, texte à écrire.
export function createEmptySection(
  type: 'couplet' | 'refrain',
): SongSectionInput {
  return { section_id: null, type, number: null, text: '' };
}

// Corps des sections du POST et du PUT : l'ordre de la liste est l'ordre
// affiché, le back en tire la position de chaque section.
export function toSectionsPayload(
  sections: SongSectionInput[],
): SongSectionPayload[] {
  return sections.map(({ section_id, type, number, text }) => ({
    ...(section_id === null ? {} : { id: section_id }),
    type,
    number,
    text,
  }));
}

// Valeur du champ « Numéro » : vide, pas de numéro (`null`) ; sinon le nombre
// lu. Seuls les chiffres sont convertis : `Number()` accepterait aussi `0x10`
// (16) ou `1e2` (100), et le numéro envoyé différerait de celui affiché. Toute
// autre saisie (« abc », « 1,5 », « -2 ») reste du texte : le schéma la refuse
// (« Numéro de 1 à 999. ») et le champ la garde telle quelle, au lieu de
// l'effacer ou d'afficher « NaN » quand la carte est déplacée.
export function parseSectionNumber(value: unknown): number | string | null {
  if (value === null || value === undefined) {
    return null;
  }

  const text = String(value).trim();

  if (text === '') {
    return null;
  }

  return /^\d+$/.test(text) ? Number(text) : text;
}

// « 0 section », « 1 section », « 3 sections » : le pluriel dès deux.
export function getSectionCountLabel(count: number): string {
  return `${count} section${count > 1 ? 's' : ''}`;
}
