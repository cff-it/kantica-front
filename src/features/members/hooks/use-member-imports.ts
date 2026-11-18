import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getMemberImports } from '../api/get-member-imports';
import { IMPORT_POLL_INTERVAL_MS, isImportRunning } from '../imports';
import { memberImportKeys } from '../keys';

export function useMemberImports(page: number) {
  return useQuery({
    queryKey: memberImportKeys.list(page),
    queryFn: () => getMemberImports(page),
    // Évite le clignotement de la liste lors d'un changement de page.
    placeholderData: keepPreviousData,
    // Un import en cours avance sans action de l'utilisateur : l'historique est
    // rechargé jusqu'à sa fin.
    refetchInterval: (query) =>
      query.state.data?.data.some((item) => isImportRunning(item.status))
        ? IMPORT_POLL_INTERVAL_MS
        : false,
  });
}
