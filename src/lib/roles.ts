import type { Role, User } from '@/types';

export function hasAnyRole(
  user: User | null | undefined,
  roles: readonly Role[],
): boolean {
  const userRoles = user?.roles ?? [];

  return roles.some((role) => userRoles.includes(role));
}

// Du rôle le plus élevé au plus bas, avec le libellé affiché.
const ROLE_LABELS: readonly { role: Role; label: string }[] = [
  { role: 'admin', label: 'Admin' },
  { role: 'secretaire', label: 'Secrétaire' },
  { role: 'membre', label: 'Membre' },
];

// Libellé du rôle le plus élevé de l'utilisateur (carte de la barre latérale).
export function getRoleLabel(
  user: User | null | undefined,
): string | undefined {
  return ROLE_LABELS.find(({ role }) => user?.roles?.includes(role))?.label;
}
