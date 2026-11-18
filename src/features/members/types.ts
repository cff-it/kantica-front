import type { Paginated, UserStatus, Voice } from '@/types';

// MemberListItemResource : une ligne de la liste des membres. `phone` et
// `contact_mail` suivent le format de la fiche : `phone` vaut null sans fiche
// saisie, `contact_mail` est toujours l'email du compte.
export type MemberListItem = {
  id: number;
  last_name: string;
  first_name: string | null;
  voice_group: string | null;
  voice: string | null;
  phone: string | null;
  contact_mail: string;
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

// Sacrement du corps de PUT : date (jj/mm/aaaa, mm/aaaa ou aaaa) et lieu.
export type UpdateMemberSacrament = {
  date: string;
  place: string;
};

// Corps de PUT /members/{id} (UpdateMemberProfileRequest). Le PUT est complet :
// un champ facultatif envoyé à `null` est effacé. `voice` (voix précise : S1,
// A2...) n'est jamais envoyée : sans elle, le back la garde tant que le groupe
// de voix ne change pas.
export type UpdateMemberInput = {
  last_name: string;
  first_name: string;
  voice_group: Voice;
  voice?: string;
  phone: string;
  birth_date: string;
  birth_place: string;
  address: string;
  social_pseudo: string | null;
  region_registration_number: string | null;
  adhesion_date: string;
  engagement_date: string | null;
  engagement_place: string | null;
  baptism: UpdateMemberSacrament;
  first_communion: UpdateMemberSacrament;
  confirmation: UpdateMemberSacrament;
  marriage: {
    spouse: string | null;
    date: string | null;
    place: string | null;
  };
  emergency_contact: {
    relationships: string[];
    name: string;
    phone: string;
  };
};

// Variables de `useUpdateMember`.
export type UpdateMemberVariables = {
  id: number;
  input: UpdateMemberInput;
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
