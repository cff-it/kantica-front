import { useMutation } from '@tanstack/react-query';

import { downloadBlob } from '@/lib/download-file';

import { exportMembers } from '../api/export-members';

export function useExportMembers() {
  return useMutation({
    mutationFn: exportMembers,
    // Hors ligne, TanStack Query met la mutation en pause par défaut : le
    // bouton tournerait sans fin, sans message. On tente la requête quand
    // même, pour que l'échec s'affiche tout de suite.
    networkMode: 'always',
    // Ici et non dans le composant : si la feuille est fermée pendant la
    // génération, le fichier est quand même téléchargé.
    onSuccess: ({ blob, filename }) => downloadBlob(blob, filename),
  });
}
