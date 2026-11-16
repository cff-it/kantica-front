import axios, { isAxiosError } from 'axios';

import { clearAuthToken, getAuthToken } from './auth-token';

type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;

// Le client ne connaît ni le routeur ni le cache : l'application enregistre
// ici ce qu'il faut faire en cas de 401 (voir app/providers.tsx).
export function setUnauthorizedHandler(
  handler: UnauthorizedHandler | null,
): void {
  unauthorizedHandler = handler;
}

// Instance Axios unique. Sanctum en mode jeton : le jeton Bearer reçu à la
// connexion ou à l'inscription part dans l'en-tête `Authorization` (voir
// lib/auth-token.ts). Ni cookies ni CSRF, pour que l'API serve aussi l'app
// mobile. `/api` reste servi par le même hôte que le front (proxy Vite en dev,
// nginx en production), ce qui évite CORS.
export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      // Jeton expiré ou révoqué : on l'oublie. Seulement s'il s'agit bien du
      // jeton envoyé par cette requête, pour qu'une réponse tardive ne
      // supprime pas un jeton obtenu entre-temps.
      const sentToken = error.config?.headers.get('Authorization');

      if (sentToken && sentToken === `Bearer ${getAuthToken()}`) {
        clearAuthToken();
      }

      unauthorizedHandler?.();
    }

    return Promise.reject(error);
  },
);
