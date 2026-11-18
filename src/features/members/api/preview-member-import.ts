import { apiClient } from '@/lib/api-client';

import type { ImportPreview } from '../types';

// Vérification du fichier (`POST /users/import/preview`) : le back lit le
// fichier et classe chaque ligne sans rien écrire en base. Corps `multipart`,
// champ `file` ; un fichier refusé répond 422 sur `file`.
export async function previewMemberImport(file: File): Promise<ImportPreview> {
  const body = new FormData();

  body.append('file', file);

  const { data } = await apiClient.post<{ data: ImportPreview }>(
    '/users/import/preview',
    body,
  );

  return data.data;
}
