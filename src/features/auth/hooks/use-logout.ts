import { useMutation, useQueryClient } from '@tanstack/react-query';

import { clearAuthToken } from '@/lib/auth-token';

import { logout } from '../api/logout';
import { authKeys } from '../keys';

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    // Même si l'appel échoue (jeton déjà expiré, réseau), l'utilisateur doit
    // être déconnecté côté front : le jeton local est oublié dans tous les cas.
    onSettled: () => {
      clearAuthToken();
      // `me` passe à `null` : les guards, abonnés à cette requête, renvoient
      // vers /login. On ne la supprime pas (`queryClient.clear()`), sinon les
      // guards resteraient liés à l'ancienne requête et ne verraient rien.
      queryClient.setQueryData(authKeys.me(), null);
      // Aucune autre donnée de l'utilisateur précédent ne doit survivre.
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== authKeys.all[0],
      });
    },
  });
}
