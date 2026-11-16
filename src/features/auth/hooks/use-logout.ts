import { useMutation, useQueryClient } from '@tanstack/react-query';

import { logout } from '../api/logout';
import { authKeys } from '../keys';

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Aucune donnée de l'utilisateur précédent ne doit survivre.
      queryClient.clear();
      queryClient.setQueryData(authKeys.me(), null);
    },
  });
}
