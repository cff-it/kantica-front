import { ActionButton } from '@/components/common/action-button';

import { useLogout } from '../hooks/use-logout';

// Bouton « Se déconnecter » de la maquette Profil. Une fois `me` à `null`, le
// guard `RequireAuth` renvoie l'utilisateur vers /login.
export function LogoutButton() {
  const logout = useLogout();

  return (
    <ActionButton
      type="button"
      variant="outline"
      loading={logout.isPending}
      onClick={() => logout.mutate()}
      className="md:w-auto"
    >
      Se déconnecter
    </ActionButton>
  );
}
