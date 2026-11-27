import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';

type ListPaginationProps = {
  page: number;
  lastPage: number;
  onPageChange: (page: number) => void;
};

const BUTTON = 'h-12 gap-1 rounded-xl px-4 text-base font-semibold';

// Pages précédente et suivante. Le back pagine par 20 (`PER_PAGE`, listes des membres et des rôles) ; les
// maquettes n'ont qu'une page, la pagination n'y figure donc pas. Masquée
// quand tout tient sur une page.
export function ListPagination({
  page,
  lastPage,
  onPageChange,
}: ListPaginationProps) {
  if (lastPage <= 1) {
    return null;
  }

  const goTo = (target: number) => {
    onPageChange(target);
    window.scrollTo({ top: 0 });
  };

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between gap-2 pt-6"
    >
      <Button
        variant="outline"
        className={BUTTON}
        disabled={page <= 1}
        onClick={() => goTo(page - 1)}
      >
        <ChevronLeft aria-hidden className="size-5" />
        Précédent
      </Button>
      <p aria-live="polite" className="text-center text-muted-foreground">
        {page} / {lastPage}
      </p>
      <Button
        variant="outline"
        className={BUTTON}
        disabled={page >= lastPage}
        onClick={() => goTo(page + 1)}
      >
        Suivant
        <ChevronRight aria-hidden className="size-5" />
      </Button>
    </nav>
  );
}
