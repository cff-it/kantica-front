import { useMutation, useQueryClient } from '@tanstack/react-query';

import { login } from '../api/login';
import { authKeys } from '../keys';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.me() }),
  });
}
