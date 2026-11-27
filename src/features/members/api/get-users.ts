import { apiClient } from '@/lib/api-client';

import type { UsersPage, UsersQuery } from '../types';

// Comptes et rôle de chacun (admin seulement), 20 par page, recherche par nom,
// prénom ou email.
export async function getUsers(params: UsersQuery = {}): Promise<UsersPage> {
  const { data } = await apiClient.get<UsersPage>('/users', { params });

  return data;
}
