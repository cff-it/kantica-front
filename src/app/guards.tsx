import { Navigate, Outlet, useLocation, type Location } from 'react-router';

import { useCurrentUser } from '@/features/auth';
import { hasAnyRole } from '@/lib/roles';
import type { Role } from '@/types';

function FullScreenLoader() {
  return (
    <div
      role="status"
      className="flex min-h-dvh items-center justify-center text-muted-foreground"
    >
      Chargement…
    </div>
  );
}

// Réservé aux utilisateurs connectés. Le cas du compte « en attente »
// (status `pending`) est traité à l'étape 2 du lot 1.
export function RequireAuth() {
  const { data: user, isPending } = useCurrentUser();
  const location = useLocation();

  if (isPending) {
    return <FullScreenLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

// Réservé aux visiteurs : un utilisateur connecté retourne là où il allait.
export function RequireGuest() {
  const { data: user, isPending } = useCurrentUser();
  const location = useLocation();

  if (isPending) {
    return <FullScreenLoader />;
  }

  if (user) {
    const from = (location.state as { from?: Location } | null)?.from;

    return <Navigate to={from ?? '/'} replace />;
  }

  return <Outlet />;
}

// Guard par rôle. Pure ergonomie : la vraie barrière reste les Policies
// Laravel côté back. Un rôle insuffisant renvoie à l'accueil (`/`).
export function RequireRole({ roles }: { roles: Role[] }) {
  const { data: user } = useCurrentUser();

  if (!hasAnyRole(user, roles)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
