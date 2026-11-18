import { useQuery } from '@tanstack/react-query';

import { getMember } from '../api/get-member';
import { memberKeys } from '../keys';

// Fiche d'un membre (écrans « Fiche membre » et « Modifier la fiche »).
export function useMember(id: number) {
  return useQuery({
    queryKey: memberKeys.detail(id),
    queryFn: () => getMember(id),
  });
}
