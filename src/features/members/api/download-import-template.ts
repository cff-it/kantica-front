import { apiClient } from '@/lib/api-client';
import { getFilenameFromDisposition } from '@/lib/download-file';

import type { ExportedFile } from '../types';

// Modèle de fichier d'import (`GET /users/import/template`) : le back renvoie
// le .xlsx lui-même, lu en `Blob`. Le nom vient de `Content-Disposition`.
export async function downloadImportTemplate(): Promise<ExportedFile> {
  const response = await apiClient.get<Blob>('/users/import/template', {
    responseType: 'blob',
  });

  return {
    blob: response.data,
    filename:
      getFilenameFromDisposition(response.headers['content-disposition']) ??
      'modele-import-membres.xlsx',
  };
}
