import { apiClient, getCsrfCookie } from '@/lib/api-client';

import type { LoginInput } from '../schemas';

export async function login(input: LoginInput): Promise<void> {
  await getCsrfCookie();
  await apiClient.post('/auth/login', input);
}
