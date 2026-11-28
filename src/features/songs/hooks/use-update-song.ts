import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateSong } from '../api/update-song';
import { songKeys } from '../keys';
import type { UpdateSongVariables } from '../types';

export function useUpdateSong() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: UpdateSongVariables) => updateSong(id, input),
    // Même raison que `useCreateSong`.
    networkMode: 'always',
    // Le cantique et le répertoire (titre, auteur) sont rechargés avant de
    // rendre la main : un formulaire rouvert repart des sections enregistrées.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: songKeys.all }),
  });
}
