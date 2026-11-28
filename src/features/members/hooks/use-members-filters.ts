import { useState } from 'react';

import { useDebounce } from '@/hooks/use-debounce';
import type { Voice } from '@/types';

import type { MembersQuery } from '../types';

// État des filtres de la liste (recherche, voix, page) et paramètres de la
// requête qui en découlent. La recherche est retardée pour ne pas lancer une
// requête à chaque frappe. Chaque changement de recherche ou de voix ramène à
// la première page, même quand il revient à des filtres déjà vus (« a » en
// page 3, effacée, puis « a » de nouveau ; voix S en page 2, puis A, puis S).
export function useMembersFilters() {
  const [search, setSearch] = useState('');
  const [voice, setVoice] = useState<Voice | undefined>(undefined);
  const debouncedSearch = useDebounce(search.trim());
  const [page, setPage] = useState(1);
  // Filtres pour lesquels `page` a été choisie (une voix ne contient jamais
  // « | », la clé est donc sans ambiguïté). Quand ils changent, la page revient
  // à 1 pendant le rendu (motif React « ajuster un état quand une valeur
  // change ») : ni effet, ni requête pour l'ancienne page.
  const filterKey = `${debouncedSearch}|${voice ?? ''}`;
  const [pageFilterKey, setPageFilterKey] = useState(filterKey);

  if (pageFilterKey !== filterKey) {
    setPageFilterKey(filterKey);
    setPage(1);
  }

  // Dans le rendu où les filtres viennent de changer, `page` vaut encore
  // l'ancienne page : React ne rejoue le composant qu'après la fin de ce rendu,
  // et `useMembers` est appelé entre-temps avec cette requête. Demander déjà la
  // page 1 évite d'y créer une entrée de cache pour l'ancienne page.
  const query: MembersQuery = {
    search: debouncedSearch || undefined,
    voice,
    page: pageFilterKey === filterKey ? page : 1,
  };

  return {
    search,
    voice,
    query,
    filtered: Boolean(query.search || voice),
    setSearch,
    setVoice,
    setPage,
  };
}
