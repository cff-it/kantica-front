import { isAxiosError } from 'axios';

// Sous-titre du répertoire : « 13 cantiques ». Porte sur tout le répertoire,
// pas sur le résultat de la recherche.
export function getSongsCountLabel(count: number): string {
  return `${count} cantique${count > 1 ? 's' : ''}`;
}

// Identifiant d'un cantique lu dans l'adresse : entier positif, rien d'autre.
// `undefined` sinon : l'écran affiche « introuvable » sans appeler le back.
export function parseSongId(value: string | undefined): number | undefined {
  return value && /^[1-9]\d*$/.test(value) ? Number(value) : undefined;
}

// Champs où le formulaire affiche une erreur 422 : titre, auteur, référence,
// texte et numéro de chaque section.
const SHOWN_FIELD =
  /^(title|author|reference|sections\.\d+\.(text|number))$/;

// Premier message d'une 422 sur un champ que le formulaire n'affiche pas (par
// exemple `sections.2.id` : une section retirée par un autre admin entre-temps).
// Posée sur un champ sans écran, l'erreur resterait invisible et chaque nouvel
// essai échouerait pareil : l'appelant en fait une notification. `null` pour
// toute autre erreur.
export function getHiddenValidationMessage(error: unknown): string | null {
  if (!isAxiosError<{ errors?: Record<string, string[]> }>(error)) {
    return null;
  }

  if (error.response?.status !== 422) {
    return null;
  }

  const hidden = Object.entries(error.response.data?.errors ?? {}).find(
    ([field]) => !SHOWN_FIELD.test(field),
  );

  return hidden?.[1][0] ?? null;
}
