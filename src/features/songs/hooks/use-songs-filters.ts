import { useState } from 'react';

import { useDebounce } from '@/hooks/use-debounce';

import type { SongsQuery } from '../types';

// Recherche et page du répertoire : la recherche est retardée, et chaque
// nouvelle recherche ramène à la première page, même quand elle revient à une
// valeur déjà vue (« a » en page 3, effacée, puis « a » de nouveau).
export function useSongsFilters() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search.trim());
  const [page, setPage] = useState(1);
  // Recherche pour laquelle `page` a été choisie. Quand la recherche retardée
  // change, la page revient à 1 pendant le rendu (motif React « ajuster un
  // état quand une valeur change ») : ni effet, ni requête pour l'ancienne
  // page.
  const [pageSearch, setPageSearch] = useState(debouncedSearch);

  if (pageSearch !== debouncedSearch) {
    setPageSearch(debouncedSearch);
    setPage(1);
  }

  // Dans le rendu où la recherche vient de changer, `page` vaut encore
  // l'ancienne page : React ne rejoue le composant qu'après la fin de ce rendu,
  // et `useSongs` est appelé entre-temps avec cette requête. Demander déjà la
  // page 1 évite d'y créer une entrée de cache pour l'ancienne page.
  const query: SongsQuery = {
    search: debouncedSearch || undefined,
    page: pageSearch === debouncedSearch ? page : 1,
  };

  return {
    search,
    query,
    filtered: Boolean(query.search),
    setSearch,
    setPage,
  };
}
