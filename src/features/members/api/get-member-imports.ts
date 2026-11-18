import { apiClient } from '@/lib/api-client';

import type { MemberImportsPage } from '../types';

// Historique des imports (`GET /users/import`), du plus récent au plus ancien,
// par 20. L'admin voit tous les imports, la secrétaire les siens.
export async function getMemberImports(
  page: number,
): Promise<MemberImportsPage> {
  const { data } = await apiClient.get<MemberImportsPage>('/users/import', {
    params: { page },
  });

  return data;
}
