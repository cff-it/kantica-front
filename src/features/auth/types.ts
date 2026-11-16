import type { User } from '@/types';

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
