import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import type { User } from '@/types';

import { useMember } from '../hooks/use-member';
import { isNotFoundError } from '../utils';
import { MemberNotFound } from './member-not-found';

type MemberLoaderProps = {
  id: number;
  children: (member: User) => ReactNode;
};

// Charge la fiche d'un membre et gère ce qui précède son affichage :
// chargement, membre introuvable (404) ou autre erreur avec « Réessayer ». Sert
// à la fiche et au formulaire de modification.
export function MemberLoader({ id, children }: MemberLoaderProps) {
  const query = useMember(id);

  if (query.isPending) {
    return (
      <p role="status" className="py-12 text-center text-muted-foreground">
        Chargement de la fiche…
      </p>
    );
  }

  if (query.isError) {
    if (isNotFoundError(query.error)) {
      return <MemberNotFound />;
    }

    return (
      <div
        role="alert"
        className="flex flex-col items-center gap-4 py-12 text-center"
      >
        <p className="text-destructive">
          Impossible de charger la fiche du membre.
        </p>
        <Button
          variant="outline"
          className="h-12 rounded-xl px-5 text-base font-semibold"
          onClick={() => void query.refetch()}
        >
          Réessayer
        </Button>
      </div>
    );
  }

  return children(query.data);
}
