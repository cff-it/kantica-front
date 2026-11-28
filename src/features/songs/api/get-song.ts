import { apiClient } from '@/lib/api-client';

import type { Song } from '../types';

// Un cantique avec ses sections triées par position (SongResource), pour le
// formulaire de modification.
export async function getSong(id: number): Promise<Song> {
  const { data } = await apiClient.get<{ data: Song }>(`/songs/${id}`);

  return data.data;
}
