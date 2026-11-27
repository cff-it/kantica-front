import type { UseQueryResult } from '@tanstack/react-query';

import { ListPagination } from '@/components/common/list-pagination';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useRoleChange } from '../hooks/use-role-change';
import type { UsersPage } from '../types';
import { UsersRolesList } from './users-roles-list';

type UsersResultsProps = {
  query: UseQueryResult<UsersPage>;
  // Une recherche est active : change le message d'une liste vide.
  filtered: boolean;
  onPageChange: (page: number) => void;
};

// Résultat de la liste des comptes : chargement, erreur, liste vide, ou la
// liste avec sa pagination (comme `MembersResults`).
export function UsersResults({
  query,
  filtered,
  onPageChange,
}: UsersResultsProps) {
  const roleChange = useRoleChange();

  if (query.isPending) {
    return (
      <p role="status" className="py-12 text-center text-muted-foreground">
        Chargement des comptes…
      </p>
    );
  }

  if (query.isError) {
    return (
      <div
        role="alert"
        className="flex flex-col items-center gap-4 py-12 text-center"
      >
        <p className="text-destructive">Impossible de charger les comptes.</p>
        <Button
          variant="outline"
          className="h-12 rounded-xl px-5 text-base font-semibold"
          onClick={() => void query.refetch()}
        >
          Réessayer
        </Button>
      </div>
    );
  }

  const { data: users, meta } = query.data;

  if (users.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        {filtered
          ? 'Aucun compte ne correspond à votre recherche.'
          : 'Aucun compte pour le moment.'}
      </p>
    );
  }

  return (
    <div
      aria-busy={query.isPlaceholderData || undefined}
      className={cn(
        'transition-opacity',
        query.isPlaceholderData && 'opacity-60',
      )}
    >
      <UsersRolesList
        users={users}
        onChange={roleChange.change}
        pending={roleChange.pending}
      />
      <ListPagination
        page={meta.current_page}
        lastPage={meta.last_page}
        onPageChange={onPageChange}
      />
    </div>
  );
}
