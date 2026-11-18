import { apiClient } from '@/lib/api-client';

import type { RegisterInput } from '../schemas';
import type { RegisterResponse } from '../types';

export async function register(
  input: RegisterInput,
): Promise<RegisterResponse> {
  const { data } = await apiClient.post<RegisterResponse>('/register', input);

  return data;
}
