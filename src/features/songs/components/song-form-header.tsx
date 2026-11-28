import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router';

import { ActionButton } from '@/components/common/action-button';

type SongFormHeaderProps = {
  // « Nouveau cantique » ou « Modifier le cantique ».
  title: string;
  // Fil d'Ariane web : où mène la flèche de retour et son libellé (le titre du
  // cantique à la modification, « Répertoire » à l'ajout).
  backTo: string;
  backLabel: string;
  pending: boolean;
  onCancel: () => void;
};

const FOCUS_RING =
  'outline-none focus-visible:ring-3 focus-visible:ring-ring/50';

// En-tête de « Nouveau cantique » et de « Modifier le cantique » (maquettes
// 03-Repertoire-et-voix, « Édition cantique »), à poser dans le `<form>`. Deux
// mises en page, une seule bascule (`lg`) :
// - mobile : barre « Annuler » et titre ; « Enregistrer le cantique » est dans
//   la barre fixe du bas (`SongSubmitBar`) ;
// - web : fil « ‹ Retour », puis barre titre, « Annuler » et « Enregistrer le
//   cantique » à droite.
// Les barres restent collées en haut de la fenêtre (`sticky`) : une barre
// `sticky` est bornée par son parent, elle doit donc être un enfant direct du
// `<form>`, d'où le fil web hors de la barre.
export function SongFormHeader({
  title,
  backTo,
  backLabel,
  pending,
  onCancel,
}: SongFormHeaderProps) {
  return (
    <>
      {/* `-mx-4 -mt-6` : la barre déborde du `px-4 py-6` de `AppLayout` et
          touche le haut et les bords de l'écran. */}
      <header className="sticky top-0 z-20 -mx-4 -mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-2 border-b bg-background px-4 py-2 lg:hidden">
        <button
          type="button"
          onClick={onCancel}
          className={`-ml-1 flex min-h-11 items-center justify-self-start rounded-lg px-1 text-base text-muted-foreground ${FOCUS_RING}`}
        >
          Annuler
        </button>
        <h1 className="font-sans text-base font-semibold">{title}</h1>
      </header>

      {/* `-mb-5` annule le `gap-5` du formulaire : le fil touche la barre. */}
      <Link
        to={backTo}
        className={`-ml-1 hidden min-h-11 max-w-full items-center gap-1 self-start rounded-lg pr-2 text-base font-semibold text-link lg:-mb-5 lg:inline-flex ${FOCUS_RING}`}
      >
        <ChevronLeft aria-hidden className="size-5 shrink-0" />
        <span className="truncate">{backLabel}</span>
      </Link>

      {/* `-mx-12` : la barre va d'un bord à l'autre du contenu (`px-12` de
          `AppLayout`) ; fond opaque pour que le formulaire passe dessous. */}
      <header className="sticky top-0 z-20 hidden items-center justify-between gap-4 border-b bg-background py-3 lg:-mx-12 lg:flex lg:px-12">
        <h1 className="text-3xl">{title}</h1>
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
            Enregistrer le cantique
          </ActionButton>
        </div>
      </header>
    </>
  );
}
