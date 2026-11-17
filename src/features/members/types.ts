import type { Paginated, UserStatus, Voice } from '@/types';

// MemberListItemResource : une ligne de la liste des membres.
export type MemberListItem = {
  id: number;
  last_name: string;
  first_name: string | null;
  voice_group: string | null;
  voice: string | null;
  status: UserStatus;
};

// Effectif par groupe de voix (MemberListResultDTO::$voiceCounts).
export type VoiceCount = {
  voice_group: string;
  name: string;
  count: number;
};

// Clés ajoutées à `meta` par MemberController::index.
export type MembersMeta = {
  registered_count: number;
  voice_counts: VoiceCount[];
};

export type MembersPage = Paginated<MemberListItem, MembersMeta>;

// Paramètres acceptés par ListMembersRequest.
export type MembersQuery = {
  search?: string;
  voice?: Voice;
  page?: number;
};

// Formats proposés par l'écran d'export. Le back accepte aussi `xlsx`, absent
// des maquettes.
export type ExportFormat = 'pdf' | 'csv';

// Paramètres acceptés par ExportMembersRequest. Sans `voice`, toutes les voix.
export type ExportMembersQuery = {
  format: ExportFormat;
  voice?: Voice;
};

// Fichier renvoyé par `GET /members/export` (réponse binaire, pas de JSON).
export type ExportedFile = {
  blob: Blob;
  filename: string;
};
