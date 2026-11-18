import { useMutation, useQueryClient } from '@tanstack/react-query';

import { startMemberImport } from '../api/start-member-import';
import { memberImportKeys } from '../keys';

export function useStartMemberImport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startMemberImport,
    // Hors ligne, TanStack Query met la mutation en pause par défaut : le
    // bouton tournerait sans fin, sans message. On tente la requête quand
    // même, pour que l'échec s'affiche tout de suite.
    networkMode: 'always',
    // Le nouvel import (« En cours ») doit figurer dans l'historique au retour
    // sur l'écran d'import. Les membres, eux, sont rechargés quand l'import
    // est terminé (voir `useMemberImport`).
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: memberImportKeys.lists() }),
  });
}
