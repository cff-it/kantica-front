import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { paths } from '@/lib/paths';

type ImportNotFoundProps = {
  // 403 : le rapport existe, mais l'import a été lancé par quelqu'un d'autre
  // (réservé à son auteur et à l'admin).
  forbidden?: boolean;
};

// Rapport d'import inconnu (404 du back), illisible dans l'adresse, ou réservé
// à un autre utilisateur.
export function ImportNotFound({ forbidden = false }: ImportNotFoundProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <h1 className="text-3xl">
        {forbidden ? 'Rapport inaccessible' : 'Import introuvable'}
      </h1>
      <p className="text-muted-foreground">
        {forbidden
          ? "Ce rapport est réservé à la personne qui a lancé l'import et à l'administrateur."
          : "Cet import n'existe pas ou n'existe plus."}
      </p>
      <Button
        asChild
        variant="outline"
        className="h-12 rounded-xl px-5 text-base font-semibold"
      >
        <Link to={paths.membersImport}>Retour à l'import</Link>
      </Button>
    </div>
  );
}
