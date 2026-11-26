import type { Paginated, Role, UserStatus, Voice } from '@/types';

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

// Corps de POST /members (CreateMemberRequest) : la même fiche complète que le
// PUT, plus l'email du compte. L'email est l'identifiant de connexion : il se
// saisit ici, une seule fois, et ne change plus ensuite. Le mot de passe, le
// statut et les rôles ne se choisissent pas : le back génère le mot de passe,
// crée le compte actif (rôle membre) et envoie l'invitation par mail.
export type CreateMemberInput = UpdateMemberInput & {
  mail: string;
};

// Formats proposés par l'écran d'export. Le back accepte aussi `xlsx`, absent
// des maquettes.
export type ExportFormat = 'pdf' | 'csv';

// Paramètres acceptés par ExportMembersRequest. Sans `voice`, toutes les voix.
export type ExportMembersQuery = {
  format: ExportFormat;
  voice?: Voice;
};

// Fichier renvoyé par `GET /members/export` ou par le téléchargement du modèle
// d'import (réponse binaire, pas de JSON).
export type ExportedFile = {
  blob: Blob;
  filename: string;
};

// ── Import Excel des membres (back : `/users/import`) ─────────────────────

// UserImportStatus : `pending` et `running` sont des imports en tâche de fond.
export type ImportStatus = 'pending' | 'running' | 'completed' | 'failed';

// UserImportIssueDTO : ligne du fichier qui ne sera pas (ou n'a pas été)
// importée. `line` est le numéro de ligne dans Excel (l'en-tête est la ligne 1),
// `name` le « NOM Prénom » lu sur la ligne.
export type ImportIssue = {
  line: number;
  name: string | null;
  message: string;
};

// UserImportRowDTO::toReviewArray : ligne valide, prête ou importée. `voice`
// est le groupe de voix (S, A, T ou B).
export type ImportRow = {
  line: number;
  last_name: string;
  first_name: string;
  voice: string;
  mail: string;
};

// Chiffres d'un import (UsersImportReportDTO) ; c'est aussi le `summary` de
// l'historique.
export type ImportSummary = {
  total: number;
  created: number;
  skipped_count: number;
  error_count: number;
  warning_count: number;
};

// UsersImportPreviewResource : aperçu avant import, rien n'est écrit.
export type ImportPreview = {
  total: number;
  ready_count: number;
  skipped_count: number;
  error_count: number;
  warning_count: number;
  ready: ImportRow[];
  skipped: ImportIssue[];
  errors: ImportIssue[];
  warnings: ImportIssue[];
  ignored_columns: string[];
};

// Rapport final (UsersImportReportDTO::toArray). `imported` manque aux
// rapports enregistrés avant son ajout au back : la liste est alors masquée.
export type ImportReport = ImportSummary & {
  skipped: ImportIssue[];
  errors: ImportIssue[];
  warnings: ImportIssue[];
  ignored_columns: string[];
  imported?: ImportRow[];
};

// `processed` et `total` comptent des étapes (un compte, une photo), pas des
// lignes du fichier.
export type ImportProgress = {
  processed: number;
  total: number;
  percent: number;
};

// Qui a lancé l'import.
export type ImportAuthor = {
  id: number;
  last_name: string;
  first_name: string | null;
};

// UserImportResource : détail d'un import. `file_name` est null pour les
// imports lancés avant son ajout au back ; `report` et `finished_at` restent
// null tant que l'import n'est pas terminé ; `error` n'est posé que si le
// statut est `failed`.
export type MemberImport = {
  id: number;
  status: ImportStatus;
  file_name: string | null;
  user: ImportAuthor;
  created_at: string;
  finished_at: string | null;
  progress: ImportProgress;
  report: ImportReport | null;
  error: string | null;
};

// UserImportListItemResource : une ligne de l'historique, sans le rapport
// complet. `summary` est null tant que l'import n'est pas terminé (ou s'il a
// échoué avant d'écrire son rapport).
export type MemberImportListItem = Omit<MemberImport, 'report'> & {
  summary: ImportSummary | null;
};

export type MemberImportsPage = Paginated<MemberImportListItem>;

// ── Gestion des rôles (KAN-63) ──────────────────────────────────────────

// UserRoleResource (kantica-back, KAN-35) : une ligne de « Gestion des rôles ».
// `role` est null pour un ancien compte sans rôle.
export type UserRoleItem = {
  id: number;
  mail: string;
  last_name: string;
  first_name: string | null;
  status: UserStatus;
  role: Role | null;
};

// Nombre de comptes par rôle, hors recherche (« 1 admin · 1 secrétaire · 5
// membres »).
export type RoleCounts = Record<Role, number>;

export type UsersQuery = {
  search?: string;
  page?: number;
};

export type UsersPage = Paginated<UserRoleItem, { role_counts: RoleCounts }>;

export type AssignUserRoleVariables = {
  id: number;
  role: Role;
};
