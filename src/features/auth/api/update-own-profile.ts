import { apiClient } from '@/lib/api-client';
import type { MemberProfile } from '@/types';

import type { UpdateOwnProfileInput } from '../types';

// Crée la fiche de recensement de l'utilisateur courant, ou la met à jour.
export async function updateOwnProfile(
  input: UpdateOwnProfileInput,
): Promise<MemberProfile> {
  const { data } = await apiClient.put<{ data: MemberProfile }>(
    '/me/profile',
    input,
  );

  return data.data;
}
