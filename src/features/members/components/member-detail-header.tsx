import { ArrowLeft, ChevronLeft, Pencil } from 'lucide-react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { getMemberEditPath, paths } from '@/lib/paths';

type MemberDetailHeaderProps = {
  memberId: number;
  fullName: string;
};

const FOCUS_RING =
  'outline-none focus-visible:ring-3 focus-visible:ring-ring/50';

// En-tête de la fiche. Deux mises en page, une seule bascule (`lg`) :
// - mobile : barre « Fiche membre » avec la flèche de retour et « Modifier » ;
// - web : fil « Membres », titre (le nom) et bouton « Modifier » à droite.
// Le nom est le titre de la page dans les deux cas (voir `MemberDetail`).
export function MemberDetailHeader({
  memberId,
  fullName,
}: MemberDetailHeaderProps) {
  const editPath = getMemberEditPath(memberId);

  return (
    <>
      {/* `pr-12` laisse la place au bouton de thème que `AppLayout` pose en
          haut à droite sous `lg`. */}
      <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 pr-12 lg:hidden">
        <Link
          to={paths.members}
          aria-label="Retour à la liste des membres"
          className={`-ml-3 flex size-11 items-center justify-center rounded-full ${FOCUS_RING}`}
        >
          <ArrowLeft aria-hidden className="size-6" />
        </Link>
        <p className="text-base font-semibold">Fiche membre</p>
        <Link
          to={editPath}
          className={`flex min-h-11 items-center justify-self-end rounded-lg px-1 text-base font-semibold text-link ${FOCUS_RING}`}
        >
          Modifier
        </Link>
      </header>

      <header className="hidden lg:block">
        <Link
          to={paths.members}
          className={`-ml-1 inline-flex min-h-11 items-center gap-1 rounded-lg pr-2 text-base font-semibold text-link ${FOCUS_RING}`}
        >
          <ChevronLeft aria-hidden className="size-5" />
          Membres
        </Link>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl">{fullName}</h1>
          <Button
            asChild
            variant="outline"
            className="h-12 gap-2 rounded-xl px-5 text-base font-semibold text-link"
          >
            <Link to={editPath}>
              <Pencil aria-hidden className="size-5" />
              Modifier
            </Link>
          </Button>
        </div>
      </header>
    </>
  );
}
