import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router';

import { paths } from '@/lib/paths';

import { UsersResults } from '../components/users-results';
import { UsersSearchField } from '../components/users-search-field';
import { useUsers } from '../hooks/use-users';
import { useUsersFilters } from '../hooks/use-users-filters';
import { getRoleCountsLabel } from '../utils';

// « Gestion des rôles » (admin), maquettes 06-Administration-et-navigation/
// 01-Gestion-roles, ouverte depuis la liste des membres (bouton réservé à
// l'admin). Retour vers la liste : flèche seule sous `lg`, « Membres » dès
// `lg`.
export function RolesPage() {
  const filters = useUsersFilters();
  const users = useUsers(filters.query);
  const counts = users.data?.meta.role_counts;

  return (
    <>
      <header className="space-y-2 pb-6">
        <Link
          to={paths.members}
          aria-label="Retour à la liste des membres"
          className="-ml-2 inline-flex h-11 items-center gap-1 rounded-lg px-2 text-base font-semibold text-link outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ChevronLeft
            aria-hidden
            className="size-6 text-foreground lg:size-5 lg:text-link"
          />
          <span className="hidden lg:inline">Membres</span>
        </Link>
        <h1 className="text-4xl lg:text-5xl">Gestion des rôles</h1>
        {counts ? (
          <p className="text-lg text-muted-foreground">
            {getRoleCountsLabel(counts)}
          </p>
        ) : null}
      </header>
      <div className="mb-6">
        <UsersSearchField value={filters.search} onChange={filters.setSearch} />
      </div>
      <UsersResults
        query={users}
        filtered={filters.filtered}
        onPageChange={filters.setPage}
      />
    </>
  );
}
