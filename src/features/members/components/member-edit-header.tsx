import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router';

import { ActionButton } from '@/components/common/action-button';
import { getMemberPath } from '@/lib/paths';

type MemberEditHeaderProps = {
  memberId: number;
  fullName: string;
  pending: boolean;
  onCancel: () => void;
};

const FOCUS_RING =
  'outline-none focus-visible:ring-3 focus-visible:ring-ring/50';

// En-tête de « Modifier la fiche », à poser dans le `<form>` : les boutons
// d'enregistrement sont de vrais boutons `submit` du formulaire. Deux mises en
// page, une seule bascule (`lg`) :
// - mobile : barre « Annuler », titre, « Enregistrer » ;
// - web : fil « ‹ Nom du membre », puis barre titre, « Annuler » et
//   « Enregistrer les modifications » à droite.
// Les barres restent collées en haut de la fenêtre (`sticky`, comme un en-tête
// figé de tableur) : les boutons sont atteignables sur toute la longueur du
// formulaire. Une barre `sticky` est bornée par son parent : elle doit donc être
// un enfant direct du `<form>`, d'où le fil web hors de la barre.
export function MemberEditHeader({
  memberId,
  fullName,
  pending,
  onCancel,
}: MemberEditHeaderProps) {
  return (
    <>
      {/* `-mx-4 -mt-6` : la barre déborde du `px-4 py-6` de `AppLayout` et
          touche le haut et les bords de l'écran. `pr-16` laisse la place au
          bouton de thème que `AppLayout` pose en haut à droite sous `lg`. */}
      <header className="sticky top-0 z-20 -mx-4 -mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-b bg-background py-2 pr-16 pl-4 lg:hidden">
        <button
          type="button"
          onClick={onCancel}
          className={`-ml-1 flex min-h-11 items-center justify-self-start rounded-lg px-1 text-base text-muted-foreground ${FOCUS_RING}`}
        >
          Annuler
        </button>
        <h1 className="font-sans text-base font-semibold">Modifier la fiche</h1>
        <button
          type="submit"
          disabled={pending}
          aria-busy={pending || undefined}
          className={`flex min-h-11 items-center justify-self-end rounded-lg px-1 text-base font-semibold text-link disabled:opacity-50 ${FOCUS_RING}`}
        >
          Enregistrer
        </button>
      </header>

      {/* `-mb-5` annule le `gap-5` du formulaire : le fil touche la barre. */}
      <Link
        to={getMemberPath(memberId)}
        className={`-ml-1 hidden min-h-11 items-center gap-1 self-start rounded-lg pr-2 text-base font-semibold text-link lg:-mb-5 lg:inline-flex ${FOCUS_RING}`}
      >
        <ChevronLeft aria-hidden className="size-5" />
        {fullName}
      </Link>

      {/* `-mx-12` : la barre va d'un bord à l'autre du contenu (`px-12` de
          `AppLayout`) ; fond opaque pour que le formulaire passe dessous. */}
      <header className="sticky top-0 z-20 hidden items-center justify-between gap-4 border-b bg-background py-3 lg:-mx-12 lg:flex lg:px-12">
        <h1 className="text-3xl">Modifier la fiche</h1>
        <div className="flex items-center gap-2">
          <ActionButton
            type="button"
            variant="ghost"
            className="w-auto text-muted-foreground"
            onClick={onCancel}
          >
            Annuler
          </ActionButton>
          <ActionButton type="submit" loading={pending} className="w-auto">
            Enregistrer les modifications
          </ActionButton>
        </div>
      </header>
    </>
  );
}
