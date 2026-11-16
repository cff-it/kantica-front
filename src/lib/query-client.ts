import { QueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

// Erreurs attendues (auth, droits, ressource absente, validation) : les
// rejouer ne changerait rien.
const NO_RETRY_STATUSES = [401, 403, 404, 419, 422];

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        const status = isAxiosError(error) ? error.response?.status : undefined;

        if (status !== undefined && NO_RETRY_STATUSES.includes(status)) {
          return false;
        }

        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});
