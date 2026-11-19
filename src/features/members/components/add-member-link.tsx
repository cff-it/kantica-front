import { UserPlus } from 'lucide-react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { paths } from '@/lib/paths';
import { cn } from '@/lib/utils';

type AddMemberLinkProps = {
  className?: string;
};

// Bouton « Ajouter un membre » de la liste des membres, à côté d'« Importer »
// et d'« Exporter ». Seule action principale de l'en-tête (les deux autres sont
// en contour) : mène au formulaire d'ajout. Emplacement non maquetté.
export function AddMemberLink({ className }: AddMemberLinkProps) {
  return (
    <Button
      asChild
      className={cn(
        'h-12 w-full gap-2 rounded-xl px-5 text-base font-semibold sm:w-auto',
        className,
      )}
    >
      <Link to={paths.memberNew}>
        <UserPlus aria-hidden className="size-5" />
        Ajouter un membre
      </Link>
    </Button>
  );
}
