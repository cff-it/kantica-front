import axios, { isAxiosError } from 'axios';

declare module 'axios' {
  interface AxiosRequestConfig {
    // Garde-fou : une requête n'est rejouée qu'une fois après un 419.
    _csrfRetried?: boolean;
  }
}

type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;

// Le client ne connaît ni le routeur ni le cache : l'application enregistre
// ici ce qu'il faut faire en cas de 401 (voir app/providers.tsx).
export function setUnauthorizedHandler(
  handler: UnauthorizedHandler | null,
): void {
  unauthorizedHandler = handler;
}

// Instance Axios unique. Sanctum en mode SPA : cookies de session + jeton XSRF.
// `/api` est servi par le même hôte que le front (proxy Vite en dev, nginx en
// production), ce qui évite CORS et les cookies tiers.
export const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  withXSRFToken: true,
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Le cookie CSRF est servi à la racine, hors du préfixe `/api`.
export async function getCsrfCookie(): Promise<void> {
  await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!isAxiosError(error) || !error.config) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    // 419 : jeton CSRF expiré. On le renouvelle puis on rejoue une seule fois.
    if (status === 419 && !error.config._csrfRetried) {
      error.config._csrfRetried = true;
      await getCsrfCookie();

      return apiClient.request(error.config);
    }

    // 401 : session expirée ou absente.
    if (status === 401) {
      unauthorizedHandler?.();
    }

    return Promise.reject(error);
  },
);
