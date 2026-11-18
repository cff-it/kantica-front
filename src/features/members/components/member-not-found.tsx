import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { paths } from '@/lib/paths';

// Identifiant inconnu (404 du back) ou illisible dans l'adresse.
export function MemberNotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <h1 className="text-3xl">Membre introuvable</h1>
      <p className="text-muted-foreground">
        Cette fiche n'existe pas ou n'existe plus.
      </p>
      <Button
        asChild
        variant="outline"
        className="h-12 rounded-xl px-5 text-base font-semibold"
      >
        <Link to={paths.members}>Retour à la liste des membres</Link>
      </Button>
    </div>
  );
}
