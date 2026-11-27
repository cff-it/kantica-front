import type { Paginated } from '@/types';

// SongResource : un cantique du répertoire. La liste (`GET /api/songs`) ne
// renvoie ni les sections ni l'historique d'usage (fiche du cantique, KAN-25).
export type Song = {
  id: number;
  uuid: string;
  title: string;
  author: string | null;
  reference: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

// Clé ajoutée à `meta` par SongController::index : nombre de cantiques de tout
// le répertoire, hors recherche (« 13 cantiques »). `meta.total`, lui, suit la
// recherche.
export type SongsMeta = {
  songs_count: number;
};

export type SongsPage = Paginated<Song, SongsMeta>;

// Paramètres acceptés par ListSongsRequest.
export type SongsQuery = {
  search?: string;
  page?: number;
};
