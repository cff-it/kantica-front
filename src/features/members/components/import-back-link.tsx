import { ArrowLeft, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router';

type ImportBackLinkProps = {
  to: string;
  // Nom de l'écran de retour : « Membres », « Importer des membres ».
  label: string;
};

const FOCUS_RING =
  'outline-none focus-visible:ring-3 focus-visible:ring-ring/50';

// Retour des écrans d'import. Deux mises en page, une seule bascule (`lg`) :
// - mobile : flèche seule (maquettes mobile 08 et 09) ;
// - web : fil « < Membres » en bleu (maquettes web 08 et 09).
export function ImportBackLink({ to, label }: ImportBackLinkProps) {
  return (
    <>
      <Link
        to={to}
        aria-label={`Retour : ${label}`}
        className={`-ml-3 flex size-11 items-center justify-center rounded-full lg:hidden ${FOCUS_RING}`}
      >
        <ArrowLeft aria-hidden className="size-6" />
      </Link>
      <Link
        to={to}
        className={`-ml-1 hidden min-h-11 items-center gap-1 rounded-lg pr-2 text-base font-semibold text-link lg:inline-flex ${FOCUS_RING}`}
      >
        <ChevronLeft aria-hidden className="size-5" />
        {label}
      </Link>
    </>
  );
}
