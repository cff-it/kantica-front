import { isAxiosError } from 'axios';

import { hasAnyRole } from '@/lib/roles';
import type { MemberProfile, User, Voice } from '@/types';

// POST /auth/login répond 401 (AuthenticationException) aussi bien pour un
// email inconnu que pour un mauvais mot de passe : le front n'a pas à les
// distinguer, et ne doit pas le faire (on ne révèle pas quels comptes existent).
export function isInvalidCredentialsError(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 401;
}

// Reprend `UserPolicy::updateOwnVoice` (kantica-back) : la voix de sa propre
// fiche est libre tant que le compte est en attente (ou sans fiche), puis
// réservée aux admins ; la secrétaire passe par la fiche du membre. Pure
// ergonomie : le back refuse (422) tout changement non autorisé.
export function canUpdateOwnVoice(user: User): boolean {
  return (
    user.status !== 'active' ||
    !user.profile?.completed ||
    hasAnyRole(user, ['admin'])
  );
}

// Le formulaire ne saisit que le groupe de voix. La voix précise de la fiche
// (« A2 ») est renvoyée tant que le groupe ne change pas : sans elle, le back
// l'efface à l'enregistrement. Si le groupe change, l'ancienne voix n'est plus
// dans le bon groupe (422) : on ne l'envoie pas.
export function getVoiceToKeep(
  profile: MemberProfile | undefined,
  voiceGroup: Voice | undefined,
): string | undefined {
  if (!profile?.voice || profile.voice_group !== voiceGroup) {
    return undefined;
  }

  return profile.voice;
}

// `first_name` joint tous les prénoms (« Hanta Rasoa ») : le premier sert à
// s'adresser à la personne.
export function getGivenName(profile: MemberProfile): string {
  return profile.first_name?.trim().split(/\s+/)[0] ?? '';
}
