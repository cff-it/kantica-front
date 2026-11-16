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
  masses: '/masses',
  rankings: '/rankings',
  members: '/members',
  profile: '/profile',
  // Premier onglet de la navigation, page d'accueil après connexion.
  home: '/songs',
} as const;

// Destination d'un compte « en attente » : tant que sa fiche n'est pas
// enregistrée, l'étape 2 de l'inscription ; ensuite l'écran d'attente.
export function getPendingPath(user: User): string {
  return user.profile?.completed ? paths.pendingAccount : paths.registerProfile;
}
