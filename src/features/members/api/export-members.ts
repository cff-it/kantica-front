import { apiClient } from '@/lib/api-client';
import { getFilenameFromDisposition } from '@/lib/download-file';

import type { ExportedFile, ExportMembersQuery } from '../types';

// Le back renvoie le fichier lui-même (PDF ou CSV), pas du JSON : la réponse
// est lue en `Blob`. Le nom vient de `Content-Disposition`.
export async function exportMembers(
  params: ExportMembersQuery,
): Promise<ExportedFile> {
  const response = await apiClient.get<Blob>('/members/export', {
    params,
    responseType: 'blob',
  });

  return {
    blob: response.data,
    filename:
      getFilenameFromDisposition(response.headers['content-disposition']) ??
      `membres-cff.${params.format}`,
  };
}
