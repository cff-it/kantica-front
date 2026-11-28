import { useQuery } from '@tanstack/react-query';

import { getSong } from '../api/get-song';
import { songKeys } from '../keys';

// Un cantique et ses sections (formulaire « Modifier le cantique »).
export function useSong(id: number) {
  return useQuery({
    queryKey: songKeys.detail(id),
    queryFn: () => getSong(id),
  });
}
