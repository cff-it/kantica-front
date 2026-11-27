import { isAxiosError } from 'axios';

import { getValidationMessage } from '@/lib/form-errors';
import { findVoice } from '@/lib/voices';
import type { User, Voice } from '@/types';

import type { MembersMeta, RoleCounts } from './types';

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

// Sous-titre de « Gestion des rôles » : « 1 admin · 1 secrétaire · 5 membres ».
export function getRoleCountsLabel(counts: RoleCounts): string {
  const plural = (count: number, word: string) =>
    `${count} ${word}${count > 1 ? 's' : ''}`;

  return [
    plural(counts.admin, 'admin'),
    plural(counts.secretaire, 'secrétaire'),
    plural(counts.membre, 'membre'),
  ].join(' · ');
}

// Prénom affiché dans « Rôle de {prénom} » : le premier prénom, sinon le nom.
export function getCallName(user: {
  first_name: string | null;
  last_name: string;
}): string {
  return user.first_name?.split(' ')[0] || user.last_name;
}

// Message d'un changement de rôle refusé : la raison d'une 422 (dernier admin,
// compte administrateur originel), car un nouvel essai échouerait pareil ; un
// message dédié pour un 403 ; sinon, inviter à réessayer.
export function getRoleErrorMessage(error: unknown): string {
  return (
    getValidationMessage(error, 'role') ??
    (isForbiddenError(error)
      ? 'Seul un admin peut changer les rôles.'
      : 'Impossible de changer le rôle. Réessayez.')
  );
}

// Le membre a une fiche de recensement enregistrée. `profile.completed` ne veut
// pas dire « fiche complète » mais « fiche enregistrée » (MemberProfileResource
// du back : `profile !== null`) : c'est la règle de `PUT /members/{id}/voice`,
// qui répond 422 sans fiche. `member.profile` lui-même est toujours présent dans
// la réponse de la fiche, il ne suffit donc pas.
export function hasMemberRecord(member: User): boolean {
  return member.profile?.completed === true;
}
