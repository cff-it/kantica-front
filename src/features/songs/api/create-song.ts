import { apiClient } from '@/lib/api-client';

import type { Song, SongInput } from '../types';

// Ajoute un cantique avec ses sections, en un seul appel (admin). Réponse 201,
// au format de `GET /songs/{id}`.
export async function createSong(input: SongInput): Promise<Song> {
  const { data } = await apiClient.post<{ data: Song }>('/songs', input);

  return data.data;
}
