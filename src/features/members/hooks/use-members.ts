import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getMembers } from '../api/get-members';
import { memberKeys } from '../keys';
import type { MembersQuery } from '../types';

export function useMembers(params: MembersQuery = {}) {
  return useQuery({
    queryKey: memberKeys.list(params),
    queryFn: () => getMembers(params),
    // Évite le clignotement de la liste lors d'un changement de page.
    placeholderData: keepPreviousData,
  });
}
