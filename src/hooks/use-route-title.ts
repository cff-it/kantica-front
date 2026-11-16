import { useEffect } from 'react';
import { useMatches } from 'react-router';

import { formatPageTitle, type RouteHandle } from '@/lib/page-title';

// Titre de l'onglet : celui de la route active la plus profonde qui en déclare
// un (`handle.title`, dans app/router.tsx). À appeler dans les layouts, qui
// enveloppent toutes les pages.
export function useRouteTitle() {
  const matches = useMatches();
  const title = [...matches]
    .reverse()
    .map((match) => (match.handle as RouteHandle | undefined)?.title)
    .find((value) => value !== undefined);

  useEffect(() => {
    document.title = formatPageTitle(title);
  }, [title]);
}
