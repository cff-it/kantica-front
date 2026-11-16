import type { MembersQuery } from './types';

export const memberKeys = {
  all: ['members'] as const,
  list: (params: MembersQuery) => [...memberKeys.all, 'list', params] as const,
  detail: (id: number) => [...memberKeys.all, 'detail', id] as const,
};
