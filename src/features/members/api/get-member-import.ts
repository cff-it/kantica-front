import { apiClient } from '@/lib/api-client';

import type { MemberImport } from '../types';

// Détail d'un import (`GET /users/import/{id}`) : avancement pendant le
// traitement, puis rapport complet. Réservé à celui qui l'a lancé et à
// l'admin (403 sinon), 404 si inconnu.
export async function getMemberImport(id: number): Promise<MemberImport> {
  const { data } = await apiClient.get<{ data: MemberImport }>(
    `/users/import/${id}`,
  );

  return data.data;
}
