import { apiClient } from '@/lib/api-client';
import type { MemberProfile } from '@/types';

import type { ProfileInput } from '../schemas';

// Crée la fiche de recensement de l'utilisateur courant, ou la met à jour.
export async function updateOwnProfile(
  input: ProfileInput,
): Promise<MemberProfile> {
  const { data } = await apiClient.put<{ data: MemberProfile }>(
    '/me/profile',
    input,
  );

  return data.data;
}
