import { apiClient } from '@/lib/api-client';

import type { LoginInput } from '../schemas';
import type { LoginResponse } from '../types';

export async function login(input: LoginInput): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', input);

  return data;
}
