import { useMutation } from '@tanstack/react-query';

import { previewMemberImport } from '../api/preview-member-import';

export function usePreviewMemberImport() {
  return useMutation({
    mutationFn: previewMemberImport,
    // Hors ligne, TanStack Query met la mutation en pause par défaut : le
    // bouton tournerait sans fin, sans message. On tente la requête quand
    // même, pour que l'échec s'affiche tout de suite.
    networkMode: 'always',
  });
}
