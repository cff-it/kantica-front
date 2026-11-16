import type { Role, User } from '@/types';

export function hasAnyRole(
  user: User | null | undefined,
  roles: readonly Role[],
): boolean {
  const userRoles = user?.roles ?? [];

  return roles.some((role) => userRoles.includes(role));
}
