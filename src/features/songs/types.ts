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

// Valeurs de l'enum SectionType du back. L'interface ne propose que couplet et
// refrain (maquette 04-Edition-cantique-admin) ; `pont` existe côté back et
// reste lisible et conservé s'il est déjà enregistré.
export type SectionType = 'couplet' | 'refrain' | 'pont';

// Calqué sur les sections de `SongResource` (champs en snake_case, comme
// renvoyés par l'API). `number` est le numéro saisi (Couplet 1, 2, 3), null
// s'il n'y en a pas ; `position` est le rang dans le cantique.
export type SongSection = {
  id: number;
  uuid: string;
  type: SectionType;
  number: number | null;
  text: string;
  position: number;
};

// Calqué sur `SongResource` (`GET /api/songs/{id}`, réponse du POST et du PUT).
// `sections` est chargé par ces trois routes. L'historique d'usage (`usage`)
// n'est pas typé : seule la fiche du cantique le lira (KAN-25).
export type Song = {
  id: number;
  uuid: string;
  title: string;
  author: string | null;
  reference: string | null;
  notes: string | null;
  sections?: SongSection[];
  created_at: string;
  updated_at: string;
};

// Corps du POST et du PUT d'un cantique (`SongRequest`). Le PUT est complet :
// un champ absent est effacé, `notes` comprises (voir `toSongInput`).
export type SongInput = {
  title: string;
  author: string | null;
  reference: string | null;
  notes: string | null;
  sections: SongSectionPayload[];
};

// Variables de la mutation de modification : l'identifiant va dans l'adresse.
export type UpdateSongVariables = {
  id: number;
  input: SongInput;
};

// Une section dans le corps du POST et du PUT d'un cantique (`SongRequest`) :
// `id` est absent pour une section nouvelle. La liste est complète et
// ordonnée : son ordre est la position des sections, et une section absente de
// la liste est supprimée.
export type SongSectionPayload = {
  id?: number;
  type: SectionType;
  number: number | null;
  text: string;
};
