import { useState } from 'react';

import { useDebounce } from '@/hooks/use-debounce';
import type { Voice } from '@/types';

import type { MembersQuery } from '../types';

// État des filtres de la liste (recherche, voix, page) et paramètres de la
// requête qui en découlent. La recherche est retardée pour ne pas lancer une
// requête à chaque frappe ; changer de recherche ou de voix ramène à la
// première page.
export function useMembersFilters() {
  const [search, setSearch] = useState('');
  const [voice, setVoice] = useState<Voice | undefined>(undefined);
  const debouncedSearch = useDebounce(search.trim());

  // La page est liée aux filtres qui l'ont produite : dès qu'ils changent,
  // elle redevient 1, sans effet ni requête en trop avec l'ancienne recherche.
  const filterKey = `${debouncedSearch}|${voice ?? ''}`;
  const [pageState, setPageState] = useState({ key: filterKey, page: 1 });
  const page = pageState.key === filterKey ? pageState.page : 1;

  const query: MembersQuery = {
    search: debouncedSearch || undefined,
    voice,
    page,
  };

  return {
    search,
    voice,
    query,
    filtered: Boolean(query.search || voice),
    setSearch,
    setVoice,
    setPage: (value: number) => setPageState({ key: filterKey, page: value }),
  };
}
