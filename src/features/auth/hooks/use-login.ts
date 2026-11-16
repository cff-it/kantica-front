import { useMutation, useQueryClient } from '@tanstack/react-query';

import { setAuthToken } from '@/lib/auth-token';

import { login } from '../api/login';
import { authKeys } from '../keys';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    // Hors ligne, TanStack Query met la mutation en pause par défaut : le
    // bouton tournerait sans fin, puis la connexion partirait seule au retour
    // du réseau. On tente la requête quand même, pour que l'échec (réseau
    // coupé) s'affiche tout de suite.
    networkMode: 'always',
    onSuccess: ({ token }) => {
      setAuthToken(token);

      return queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
}
