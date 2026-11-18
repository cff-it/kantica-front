import { useMutation, useQueryClient } from '@tanstack/react-query';

import { validateMember } from '../api/validate-member';
import { memberKeys } from '../keys';

export function useValidateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: validateMember,
    // Hors ligne, TanStack Query met la mutation en pause par défaut : le
    // bouton tournerait sans fin, sans message. On tente la requête quand
    // même, pour que l'échec s'affiche tout de suite.
    networkMode: 'always',
    // La fiche et la liste (badge « En attente ») sont rechargées avant de
    // rendre la main : le bandeau disparaît en même temps que le bouton cesse
    // de tourner.
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: memberKeys.all }),
  });
}
