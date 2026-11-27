import { useState } from 'react';

import { useDebounce } from '@/hooks/use-debounce';

import type { UsersQuery } from '../types';

// Recherche et page de « Gestion des rôles », comme la liste des membres
// (`useMembersFilters`) : la recherche est retardée, et une nouvelle
// recherche ramène à la première page.
export function useUsersFilters() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search.trim());
  const [pageState, setPageState] = useState({ key: debouncedSearch, page: 1 });
  const page = pageState.key === debouncedSearch ? pageState.page : 1;

  const query: UsersQuery = { search: debouncedSearch || undefined, page };

  return {
    search,
    query,
    filtered: Boolean(query.search),
    setSearch,
    setPage: (value: number) =>
      setPageState({ key: debouncedSearch, page: value }),
  };
}
