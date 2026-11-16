import { isAxiosError } from 'axios';

import { apiClient } from '@/lib/api-client';
import type { User } from '@/types';

// 401 = visiteur non connecté : ce n'est pas une erreur, on renvoie `null`.
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data } = await apiClient.get<{ data: User }>('/me');

    return data.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      return null;
    }

    throw error;
  }
}
