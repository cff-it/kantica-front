import { apiClient } from '@/lib/api-client';

import type { Song, SongInput } from '../types';

// Modifie un cantique et ses sections, en un seul appel (admin). Le corps est
// complet : la liste des sections remplace celle du cantique (une section
// absente est supprimée, une section sans `id` est créée).
export async function updateSong(id: number, input: SongInput): Promise<Song> {
  const { data } = await apiClient.put<{ data: Song }>(`/songs/${id}`, input);

  return data.data;
}
