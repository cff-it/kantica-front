import type { SongsQuery } from './types';

export const songKeys = {
  all: ['songs'] as const,
  list: (params: SongsQuery) => [...songKeys.all, 'list', params] as const,
};
