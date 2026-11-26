import { apiClient } from '@/lib/api-client';
import type { User, Voice } from '@/types';

// Attribue la voix d'un membre (secrétaire, admin) : seul le groupe (S, A, T,
// B) est envoyé, le reste de la fiche ne change pas. La réponse a le format de
// `GET /members/{id}`. Le back répond 422 si le membre n'a pas encore de fiche.
export async function assignMemberVoice(id: number, voice: Voice): Promise<User> {
  const { data } = await apiClient.put<{ data: User }>(
    `/members/${id}/voice`,
    { voice },
  );

  return data.data;
}
