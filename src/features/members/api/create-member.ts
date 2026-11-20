import { apiClient } from '@/lib/api-client';
import type { User } from '@/types';

import type { CreateMemberInput } from '../types';

// Ajoute un membre avec sa fiche complète (secrétaire, admin). Le compte est
// créé actif et le membre reçoit son mot de passe par mail. Réponse 201, au
// format de `GET /members/{id}`.
export async function createMember(input: CreateMemberInput): Promise<User> {
  const { data } = await apiClient.post<{ data: User }>('/members', input);

  return data.data;
}
