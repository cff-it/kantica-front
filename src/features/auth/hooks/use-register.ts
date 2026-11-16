import { useMutation, useQueryClient } from '@tanstack/react-query';

import { setAuthToken } from '@/lib/auth-token';

import { register } from '../api/register';
import { authKeys } from '../keys';

// Crée le compte (en attente de validation) et le connecte avec le jeton reçu.
// Le rechargement de l'utilisateur courant est attendu : les guards envoient
// ensuite le nouveau compte vers l'étape 2.
export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: register,
    onSuccess: ({ token }) => {
      setAuthToken(token);

      return queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
}
