import type { UseQueryResult } from '@tanstack/react-query';

import { ListPagination } from '@/components/common/list-pagination';
import { Button } from '@/components/ui/button';
import { isPageOutOfRange } from '@/hooks/use-page-in-range';
import { isForbiddenError } from '@/lib/api-errors';
import { cn } from '@/lib/utils';

import type { SongsPage } from '../types';
import { SongsList } from './songs-list';

type SongsResultsProps = {
  query: UseQueryResult<SongsPage>;
  // Une recherche est active : change le message d'une liste vide.
  filtered: boolean;
  onPageChange: (page: number) => void;
};

// Résultat du répertoire : chargement, erreur, liste vide, ou la liste avec sa
// pagination (comme la liste des membres). Pendant une recherche ou un
// changement de page, la liste précédente reste affichée, estompée
// (`keepPreviousData`).
export function SongsResults({
  query,
  filtered,
  onPageChange,
}: SongsResultsProps) {
  if (query.isPending) {
    return (
      <p role="status" className="py-12 text-center text-muted-foreground">
        Chargement du répertoire…
      </p>
    );
  }

  // Un refus (403 : compte sans rôle) ne se règle pas en réessayant : pas de
  // bouton « Réessayer » dans ce cas.
  if (query.isError) {
    const forbidden = isForbiddenError(query.error);

    return (
      <div
        role="alert"
        className="flex flex-col items-center gap-4 py-12 text-center"
      >
        <p className="text-destructive">
          {forbidden
            ? "Votre compte n'a pas accès au répertoire."
            : 'Impossible de charger le répertoire.'}
        </p>
        {forbidden ? null : (
          <Button
            variant="outline"
            className="h-12 rounded-xl px-5 text-base font-semibold"
            onClick={() => void query.refetch()}
          >
            Réessayer
          </Button>
        )}
      </div>
    );
  }

  const { data: songs, meta } = query.data;

  // Page devenue trop grande (des cantiques supprimés pendant qu'on était en
  // page 3) : la page revient à la dernière (`usePageInRange`), le temps que
  // cette page arrive. Sans ce cas, « Aucun cantique » s'afficherait à tort.
  // Toute autre liste vide, même incohérente, tombe sur le message ci-dessous :
  // jamais de chargement sans fin.
  if (songs.length === 0 && isPageOutOfRange(meta)) {
    return (
      <p role="status" className="py-12 text-center text-muted-foreground">
        Chargement du répertoire…
      </p>
    );
  }

  if (songs.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        {filtered
          ? 'Aucun cantique ne correspond à votre recherche.'
          : 'Aucun cantique au répertoire pour le moment.'}
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
      <SongsList songs={songs} />
      <ListPagination
        page={meta.current_page}
        lastPage={meta.last_page}
        onPageChange={onPageChange}
      />
    </div>
  );
}
