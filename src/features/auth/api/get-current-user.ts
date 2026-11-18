import { isAxiosError } from 'axios';

import { apiClient } from '@/lib/api-client';
import { getAuthToken } from '@/lib/auth-token';
import type { User } from '@/types';

// Sans jeton, ou avec un jeton refusé (401) : visiteur non connecté. Ce n'est
// pas une erreur, on renvoie `null`.
export async function getCurrentUser(): Promise<User | null> {
  if (!getAuthToken()) {
    return null;
  }

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
