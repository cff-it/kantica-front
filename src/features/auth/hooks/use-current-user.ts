import { useQuery } from '@tanstack/react-query';

import { getCurrentUser } from '../api/get-current-user';
import { authKeys } from '../keys';

// `data` vaut `null` pour un visiteur non connecté, `undefined` pendant le
// chargement.
export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: getCurrentUser,
    staleTime: 5 * 60_000,
  });
}
