import { isAxiosError } from 'axios';

import { findVoice } from '@/lib/voices';
import type { User, Voice } from '@/types';

import type { MembersMeta } from './types';

// Sous-titre de la page : « 9 choristes recensés ».
export function getRegisteredLabel(count: number): string {
  const plural = count > 1 ? 's' : '';

  return `${count} choriste${plural} recensé${plural}`;
}

// Effectif de l'export : toute la liste, ou un seul groupe de voix. Ces
// totaux ne dépendent pas de la recherche (l'export non plus). `undefined`
// tant que la liste n'est pas chargée.
export function getExportCount(
  meta: MembersMeta | undefined,
  voice?: Voice,
): number | undefined {
  if (!meta) {
    return undefined;
  }

  if (!voice) {
    return meta.registered_count;
  }

  return meta.voice_counts.find((group) => group.voice_group === voice)
    ?.count;
}

// Rappel du périmètre de l'export : « 9 choristes · toutes les voix »
// (maquette 07-Export-PDF-CSV). Sans effectif connu : « Toutes les voix ».
export function getExportScopeLabel(
  count: number | undefined,
  voice?: Voice,
): string {
  const scope = voice
    ? `voix ${findVoice(voice)?.label ?? voice}`
    : 'toutes les voix';

  if (count === undefined) {
    return scope.charAt(0).toUpperCase() + scope.slice(1);
  }

  return `${count} ${count > 1 ? 'choristes' : 'choriste'} · ${scope}`;
}

// Identifiant de la route `/members/:id` : entier positif écrit en chiffres,
// sinon `undefined` (la page affiche « Membre introuvable » sans requête).
export function parseMemberId(value: string | undefined): number | undefined {
  return value && /^[1-9]\d*$/.test(value) ? Number(value) : undefined;
}

// Le back répond 404 pour un membre inconnu.
export function isNotFoundError(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 404;
}

type LaravelValidationError = {
  message?: string;
  errors?: Record<string, string[]>;
};

// Message d'une 422 de Laravel pour un champ (à défaut, le message général),
// `null` pour toute autre erreur. Sert aux actions sans formulaire RHF, où
// `applyServerErrors` n'a pas de champ où poser l'erreur : un nouvel essai
// échouerait de la même façon, il faut donc en donner la raison.
export function getValidationMessage(
  error: unknown,
  field: string,
): string | null {
  if (
    !isAxiosError<LaravelValidationError>(error) ||
    error.response?.status !== 422
  ) {
    return null;
  }

  const data = error.response.data;

  return data?.errors?.[field]?.[0] ?? data?.message ?? null;
}

// Le back répond 403 quand le rôle ne suffit pas, ou (rapport d'import) quand
// l'import a été lancé par quelqu'un d'autre qu'un admin.
export function isForbiddenError(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 403;
}

// Prénom et nom affichés : la fiche (prénoms joints) prime sur le compte.
export function getMemberName(member: User): {
  first_name: string | null;
  last_name: string;
} {
  return {
    first_name: member.profile?.first_name ?? null,
    last_name: member.profile?.last_name ?? member.last_name,
  };
}
