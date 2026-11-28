import { apiClient } from '@/lib/api-client';

import type { SongsPage, SongsQuery } from '../types';

// Répertoire : 20 cantiques par page, triés par titre, recherche dans le titre
// et l'auteur (sans tenir compte de la casse ni des accents).
export async function getSongs(params: SongsQuery = {}): Promise<SongsPage> {
  const { data } = await apiClient.get<SongsPage>('/songs', { params });

  return data;
}
