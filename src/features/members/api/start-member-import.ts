import { apiClient } from '@/lib/api-client';

import type { MemberImport } from '../types';

// Lance l'import (`POST /users/import`). Le back répond 202 : l'import se
// déroule en tâche de fond, la réponse porte l'identifiant à interroger pour
// suivre l'avancement (voir `getMemberImport`). Mêmes refus 422 que l'aperçu.
export async function startMemberImport(file: File): Promise<MemberImport> {
  const body = new FormData();

  body.append('file', file);

  const { data } = await apiClient.post<{ data: MemberImport }>(
    '/users/import',
    body,
  );

  return data.data;
}
