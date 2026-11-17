import { apiClient } from '@/lib/api-client';
import type { User } from '@/types';

// Fiche d'un membre (UserResource, relations chargées : profil, prénoms).
export async function getMember(id: number): Promise<User> {
  const { data } = await apiClient.get<{ data: User }>(`/members/${id}`);

  return data.data;
}
