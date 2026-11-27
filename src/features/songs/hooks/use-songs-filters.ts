import { useState } from 'react';

import { useDebounce } from '@/hooks/use-debounce';

import type { SongsQuery } from '../types';

// Recherche et page du répertoire, comme les listes des membres et des rôles :
// la recherche est retardée, et une nouvelle recherche ramène à la première
// page (sans effet ni requête en plus).
export function useSongsFilters() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search.trim());
  const [pageState, setPageState] = useState({ key: debouncedSearch, page: 1 });
  const page = pageState.key === debouncedSearch ? pageState.page : 1;

  const query: SongsQuery = { search: debouncedSearch || undefined, page };

  return {
    search,
    query,
    filtered: Boolean(query.search),
    setSearch,
    setPage: (value: number) =>
      setPageState({ key: debouncedSearch, page: value }),
  };
}
