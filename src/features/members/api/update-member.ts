import { apiClient } from '@/lib/api-client';
import type { User } from '@/types';

import type { UpdateMemberInput } from '../types';

// Modifie la fiche d'un autre membre (secrétaire, admin). L'email et le statut
// du compte ne changent jamais ici.
export async function updateMember(
  id: number,
  input: UpdateMemberInput,
): Promise<User> {
  const { data } = await apiClient.put<{ data: User }>(
    `/members/${id}`,
    input,
  );

  return data.data;
}
