import { useMutation, useQueryClient } from '@tanstack/react-query';

import { setAuthToken } from '@/lib/auth-token';

import { login } from '../api/login';
import { authKeys } from '../keys';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: ({ token }) => {
      setAuthToken(token);

      return queryClient.invalidateQueries({ queryKey: authKeys.me() });
    },
  });
}
