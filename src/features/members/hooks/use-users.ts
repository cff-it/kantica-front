import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getUsers } from '../api/get-users';
import { userRoleKeys } from '../keys';
import type { UsersQuery } from '../types';

export function useUsers(params: UsersQuery = {}) {
  return useQuery({
    queryKey: userRoleKeys.list(params),
    queryFn: () => getUsers(params),
    // Évite le clignotement de la liste lors d'un changement de page.
    placeholderData: keepPreviousData,
  });
}
