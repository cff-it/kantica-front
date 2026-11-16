import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router/dom';

import { Toaster } from '@/components/common/toaster';
import { authKeys } from '@/features/auth';
import { setUnauthorizedHandler } from '@/lib/api-client';
import { paths } from '@/lib/paths';
import { queryClient } from '@/lib/query-client';

import { router } from './router';

export function Providers() {
  useEffect(() => {
    // 401 en cours de session : on vide l'utilisateur courant et on renvoie
    // vers /login. Sans utilisateur en cache (visiteur, GET /me renvoie 401),
    // rien à faire : les guards du routeur s'en chargent.
    setUnauthorizedHandler(() => {
      if (!queryClient.getQueryData(authKeys.me())) {
        return;
      }

      queryClient.setQueryData(authKeys.me(), null);
      void router.navigate(paths.login, { replace: true });
    });

    return () => setUnauthorizedHandler(null);
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="kantica-theme"
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
