import { apiClient } from '@/lib/api-client';

import type { MembersPage, MembersQuery } from '../types';

export async function getMembers(
  params: MembersQuery = {},
): Promise<MembersPage> {
  const { data } = await apiClient.get<MembersPage>('/members', { params });

  return data;
}
