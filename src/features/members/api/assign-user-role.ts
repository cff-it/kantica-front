import { apiClient } from '@/lib/api-client';
import type { Role } from '@/types';

import type { UserRoleItem } from '../types';

// Remplace le rôle d'un compte (un seul rôle par compte, admin seulement). Le
// back répond 422 pour le dernier admin et pour le compte administrateur
// originel.
export async function assignUserRole(
  id: number,
  role: Role,
): Promise<UserRoleItem> {
  const { data } = await apiClient.put<{ data: UserRoleItem }>(
    `/users/${id}/role`,
    { role },
  );

  return data.data;
}
