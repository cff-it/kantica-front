import type { ReactNode } from 'react';

import { useCurrentUser } from '@/features/auth';
import { hasAnyRole } from '@/lib/roles';
import type { Role } from '@/types';

type RoleGuardProps = {
  roles: Role[];
  children: ReactNode;
  fallback?: ReactNode;
};

// Masque les actions non autorisées. Pure ergonomie : la vraie barrière reste
// les Policies Laravel côté back.
export function RoleGuard({
  roles,
  children,
  fallback = null,
}: RoleGuardProps) {
  const { data: user } = useCurrentUser();

  return hasAnyRole(user, roles) ? children : fallback;
}
