import type { UseQueryResult } from '@tanstack/react-query';

import { ListPagination } from '@/components/common/list-pagination';
import { Button } from '@/components/ui/button';
import { isPageOutOfRange } from '@/hooks/use-page-in-range';
import { cn } from '@/lib/utils';

import type { MembersPage } from '../types';
import { MembersList } from './members-list';

type MembersResultsProps = {
  query: UseQueryResult<MembersPage>;
  // Une recherche ou un filtre de voix est actif : change le message d'une
  // liste vide.
  filtered: boolean;
  onPageChange: (page: number) => void;
};

// Résultat de la requête de la liste : chargement, erreur, liste vide, ou la
// liste avec sa pagination. Pendant un changement de filtre ou de page, la
// liste précédente reste affichée, estompée (`keepPreviousData`).
export function MembersResults({
  query,
  filtered,
  onPageChange,
}: MembersResultsProps) {
  if (query.isPending) {
    return (
      <p role="status" className="py-12 text-center text-muted-foreground">
        Chargement des membres…
      </p>
    );
  }

  if (query.isError) {
    return (
      <div
        role="alert"
        className="flex flex-col items-center gap-4 py-12 text-center"
      >
        <p className="text-destructive">
          Impossible de charger la liste des membres.
        </p>
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

  const { data: members, meta } = query.data;

  // Page devenue trop grande (des membres supprimés pendant qu'on était en
  // page 3) : la page revient à la dernière (`usePageInRange`), le temps que
  // cette page arrive. Toute autre liste vide tombe sur le message ci-dessous.
  if (members.length === 0 && isPageOutOfRange(meta)) {
    return (
      <p role="status" className="py-12 text-center text-muted-foreground">
        Chargement des membres…
      </p>
    );
  }

  if (members.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        {filtered
          ? 'Aucun membre ne correspond à votre recherche.'
          : 'Aucun membre recensé pour le moment.'}
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
      <MembersList members={members} />
      <ListPagination
        page={meta.current_page}
        lastPage={meta.last_page}
        onPageChange={onPageChange}
      />
    </div>
  );
}
