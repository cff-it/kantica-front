import type { User } from '@/types';

// Chemins des écrans, partagés entre le routeur, les guards et les features.
// Les chemins sont en anglais, comme les noms de features.
export const paths = {
  login: '/login',
  forgotPassword: '/forgot-password',
  register: '/register',
  registerProfile: '/register/profile',
  pendingAccount: '/pending-account',
  songs: '/songs',
  // Ajout d'un cantique (KAN-13, admin) : le segment fixe `new` l'emporte sur
  // `:id` de `song`.
  songNew: '/songs/new',
  // Fiche d'un cantique (KAN-25), ouverte depuis une ligne du répertoire.
  song: '/songs/:id',
  masses: '/masses',
  rankings: '/rankings',
  members: '/members',
  // Import Excel : le segment fixe `import` l'emporte sur `:id` de `member`.
  membersImport: '/members/import',
  membersImportReview: '/members/import/review',
  membersImportReport: '/members/import/:id',
  // Ajout d'un membre : le segment fixe `new` l'emporte sur `:id` de `member`.
  memberNew: '/members/new',
  // « Gestion des rôles » (admin) : le segment fixe `roles` l'emporte sur `:id`.
  memberRoles: '/members/roles',
  member: '/members/:id',
  memberEdit: '/members/:id/edit',
  profile: '/profile',
  // « Modifier ma fiche » d'un compte actif (voir `RequireAuth` dans le routeur).
  profileEdit: '/profile/edit',
  // Premier onglet de la navigation, page d'accueil après connexion.
  home: '/songs',
} as const;

// Chemin de la fiche d'un cantique (`paths.song` est le motif de la route).
export function getSongPath(id: number): string {
  return `${paths.songs}/${id}`;
}

// Chemin de la fiche d'un membre (`paths.member` est le motif de la route).
export function getMemberPath(id: number): string {
  return `${paths.members}/${id}`;
}

// Chemin du rapport d'un import (`paths.membersImportReport` est le motif).
export function getMembersImportReportPath(id: number): string {
  return `${paths.membersImport}/${id}`;
}

// Chemin de « Modifier la fiche » d'un membre (`paths.memberEdit` est le motif).
export function getMemberEditPath(id: number): string {
  return `${getMemberPath(id)}/edit`;
}

// Destination d'un compte « en attente » : tant que sa fiche n'est pas
// enregistrée, l'étape 2 de l'inscription ; ensuite l'écran d'attente.
export function getPendingPath(user: User): string {
  return user.profile?.completed ? paths.pendingAccount : paths.registerProfile;
}
