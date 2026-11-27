import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getSongs } from '../api/get-songs';
import { songKeys } from '../keys';
import type { SongsQuery } from '../types';

export function useSongs(params: SongsQuery = {}) {
  return useQuery({
    queryKey: songKeys.list(params),
    queryFn: () => getSongs(params),
    // Évite le clignotement de la liste lors d'une recherche ou d'un
    // changement de page.
    placeholderData: keepPreviousData,
  });
}
