import { Plus } from 'lucide-react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { paths } from '@/lib/paths';

// « + Ajouter » sous `lg`, « + Ajouter un cantique » dès `lg` (maquettes
// 01-Repertoire) ; le nom accessible est toujours « Ajouter un cantique ».
// Réservé à l'admin (KAN-13) : la page le place dans un `RoleGuard`. Mène à
// l'ajout d'un cantique, écran de KAN-13 (« Bientôt » en attendant).
export function AddSongLink() {
  return (
    <Button
      asChild
      className="h-11 shrink-0 gap-2 rounded-xl px-5 text-base font-semibold"
    >
      <Link to={paths.songNew}>
        <Plus aria-hidden className="size-5" />
        <span>
          Ajouter<span className="max-lg:sr-only"> un cantique</span>
        </span>
      </Link>
    </Button>
  );
}
