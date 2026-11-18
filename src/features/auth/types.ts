import type { User } from '@/types';

import type { ProfileInput } from './schemas';

// Réponse de POST /auth/login (AuthController::login).
export type LoginResponse = {
  token: string;
};

// Réponse de POST /register (AuthController::register) : le compte est créé en
// attente de validation et connecté d'office grâce au jeton.
export type RegisterResponse = {
  token: string;
  user: User;
};

// Corps de PUT /me/profile (UpdateOwnProfileRequest). `voice` est la voix
// précise (S1, A2...) : le formulaire ne la saisit pas, il renvoie celle de la
// fiche pour ne pas l'effacer (voir `getVoiceToKeep`).
export type UpdateOwnProfileInput = ProfileInput & {
  voice?: string;
};
