import { Upload } from 'lucide-react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { paths } from '@/lib/paths';

// Bouton « Importer (Excel) » de la liste des membres, à côté de « Exporter »
// (maquettes 05 mobile et web). Mène à l'écran d'import.
export function ImportMembersLink() {
  return (
    <Button
      asChild
      variant="outline"
      className="h-12 w-full gap-2 rounded-xl px-5 text-base font-semibold text-link sm:w-auto"
    >
      <Link to={paths.membersImport}>
        <Upload aria-hidden className="size-5" />
        Importer (Excel)
      </Link>
    </Button>
  );
}
