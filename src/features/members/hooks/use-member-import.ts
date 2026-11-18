import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getMemberImport } from '../api/get-member-import';
import { IMPORT_POLL_INTERVAL_MS, isImportRunning } from '../imports';
import { memberImportKeys, memberKeys } from '../keys';

// Suit un import : interrogé toutes les 2 s tant qu'il attend ou tourne, puis
// plus du tout. À la fin, la liste des membres et l'historique sont
// invalidés : ils se rechargent à leur prochain affichage.
export function useMemberImport(id: number) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: memberImportKeys.detail(id),
    queryFn: () => getMemberImport(id),
    refetchInterval: (current) =>
      current.state.data && isImportRunning(current.state.data.status)
        ? IMPORT_POLL_INTERVAL_MS
        : false,
  });
  const finished =
    query.data !== undefined && !isImportRunning(query.data.status);

  useEffect(() => {
    if (finished) {
      void queryClient.invalidateQueries({ queryKey: memberKeys.all });
      void queryClient.invalidateQueries({
        queryKey: memberImportKeys.lists(),
      });
    }
  }, [finished, queryClient]);

  return query;
}
