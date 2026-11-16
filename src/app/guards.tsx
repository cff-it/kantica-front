import { Navigate, Outlet, useLocation, type Location } from 'react-router';

import { useCurrentUser } from '@/features/auth';
import { getPendingPath, paths } from '@/lib/paths';
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

// Réservé aux comptes actifs. Un compte « en attente » est renvoyé vers son
// parcours (étape 2 de l'inscription ou écran d'attente), un visiteur vers
// la page de connexion.
export function RequireAuth() {
  const { data: user, isPending } = useCurrentUser();
  const location = useLocation();

  if (isPending) {
    return <FullScreenLoader />;
  }

  if (!user) {
    return <Navigate to={paths.login} replace state={{ from: location }} />;
  }

  if (user.status === 'pending') {
    return <Navigate to={getPendingPath(user)} replace />;
  }

  return <Outlet />;
}

// Réservé aux comptes « en attente » : étape 2 de l'inscription et écran
// d'attente. Un compte actif retourne à l'accueil. Avec `requireProfile`, un
// compte dont la fiche n'est pas encore enregistrée est renvoyé à l'étape 2.
export function RequirePending({
  requireProfile = false,
}: {
  requireProfile?: boolean;
}) {
  const { data: user, isPending } = useCurrentUser();

  if (isPending) {
    return <FullScreenLoader />;
  }

  if (!user) {
    return <Navigate to={paths.login} replace />;
  }

  if (user.status !== 'pending') {
    return <Navigate to="/" replace />;
  }

  if (requireProfile && !user.profile?.completed) {
    return <Navigate to={paths.registerProfile} replace />;
  }

  return <Outlet />;
}

// Réservé aux visiteurs : un utilisateur connecté retourne là où il allait ;
// un compte « en attente » est toujours renvoyé vers son parcours, qu'il
// vienne de se connecter ou de créer son compte.
export function RequireGuest() {
  const { data: user, isPending } = useCurrentUser();
  const location = useLocation();

  if (isPending) {
    return <FullScreenLoader />;
  }

  if (user) {
    if (user.status === 'pending') {
      return <Navigate to={getPendingPath(user)} replace />;
    }

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
