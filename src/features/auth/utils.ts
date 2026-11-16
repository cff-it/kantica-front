import type { MemberProfile } from '@/types';

// `first_name` joint tous les prénoms (« Hanta Rasoa ») : le premier sert à
// s'adresser à la personne.
export function getGivenName(profile: MemberProfile): string {
  return profile.first_name?.trim().split(/\s+/)[0] ?? '';
}

export function getFullName(profile: MemberProfile): string {
  return [profile.first_name, profile.last_name].filter(Boolean).join(' ');
}

// Initiales d'avatar : première lettre du prénom puis du nom (« HR »).
export function getInitials(profile: MemberProfile): string {
  return [
    profile.first_name?.trim().charAt(0),
    profile.last_name?.trim().charAt(0),
  ]
    .filter(Boolean)
    .join('')
    .toUpperCase();
}
