import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createSong } from '../api/create-song';
import { songKeys } from '../keys';

export function useCreateSong() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSong,
    // Hors ligne, une mutation est mise en pause par défaut : le bouton
    // tournerait sans fin. L'échec doit s'afficher tout de suite.
    networkMode: 'always',
    // Le répertoire et son compteur sont rechargés avant de rendre la main :
    // le nouveau cantique y figure au retour.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: songKeys.all }),
  });
}
