import { apiClient } from '@/lib/api-client';
import type { User } from '@/types';

// Valide le compte d'un membre en attente. Le back est idempotent : un compte
// déjà actif reste inchangé. La réponse (UserResource) ne charge que les rôles,
// sans `profile` ni prénoms : elle ne remplace donc pas la fiche en cache (voir
// `useValidateMember`, qui la recharge).
export async function validateMember(id: number): Promise<User> {
  const { data } = await apiClient.post<{ data: User }>(
    `/members/${id}/validate`,
  );

  return data.data;
}
