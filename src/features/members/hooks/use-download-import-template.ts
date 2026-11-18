import { useMutation } from '@tanstack/react-query';

import { downloadBlob } from '@/lib/download-file';

import { downloadImportTemplate } from '../api/download-import-template';

export function useDownloadImportTemplate() {
  return useMutation({
    mutationFn: downloadImportTemplate,
    // Hors ligne, TanStack Query met la mutation en pause par défaut : le
    // bouton tournerait sans fin, sans message. On tente la requête quand
    // même, pour que l'échec s'affiche tout de suite.
    networkMode: 'always',
    onSuccess: ({ blob, filename }) => downloadBlob(blob, filename),
  });
}
