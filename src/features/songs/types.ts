import type { Paginated } from '@/types';

// SongListItemResource : une ligne du répertoire (`GET /api/songs`), ce que la
// liste affiche. Le cantique complet (notes, sections, historique d'usage) est
// servi par SongResource, pour la fiche (KAN-25).
export type SongListItem = {
  id: number;
  title: string;
  author: string | null;
  reference: string | null;
};

// Clé ajoutée à `meta` par SongController::index : nombre de cantiques de tout
// le répertoire, hors recherche (« 13 cantiques »). `meta.total`, lui, suit la
// recherche.
export type SongsMeta = {
  songs_count: number;
};

export type SongsPage = Paginated<SongListItem, SongsMeta>;

// Paramètres acceptés par ListSongsRequest.
export type SongsQuery = {
  search?: string;
  page?: number;
};
