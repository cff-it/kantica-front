import { useState, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { isForbiddenError, isNotFoundError } from '@/lib/api-errors';

import { useSong } from '../hooks/use-song';
import type { Song } from '../types';
import { SongNotFound } from './song-not-found';

type SongLoaderProps = {
  id: number;
  children: (song: Song) => ReactNode;
};

// Charge un cantique et gère ce qui précède son affichage : chargement,
// cantique introuvable (404), compte sans rôle (403) ou autre erreur avec
// « Réessayer ». Sert au formulaire de modification.
//
// Le formulaire ne lit ses valeurs de départ qu'au montage : il n'est affiché
// qu'une fois le cantique rechargé (`useSong` recharge à chaque ouverture), pas
// depuis un cache périmé. Une fois affiché, un rechargement en arrière-plan ou
// son échec ne le démonte plus : la saisie en cours serait perdue.
export function SongLoader({ id, children }: SongLoaderProps) {
  const query = useSong(id);
  const [isReady, setIsReady] = useState(false);

  // Motif « ajuster un état quand une valeur change » : pas d'effet, pas de
  // rendu intermédiaire affiché.
  if (!isReady && query.isSuccess && !query.isFetching) {
    setIsReady(true);
  }

  if (isReady && query.data) {
    return children(query.data);
  }

  // Premier chargement, ou rechargement d'un cache avant l'ouverture : y
  // compris un nouvel essai après une erreur, qui garde l'ancienne erreur
  // tant qu'il n'a pas abouti.
  if (query.isFetching || !query.isError) {
    return (
      <p role="status" className="py-12 text-center text-muted-foreground">
        Chargement du cantique…
      </p>
    );
  }

  if (isNotFoundError(query.error)) {
    return <SongNotFound />;
  }

  if (isForbiddenError(query.error)) {
    return (
      <p role="alert" className="py-12 text-center text-destructive">
        Votre compte n'a pas accès au répertoire.
      </p>
    );
  }

  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-4 py-12 text-center"
    >
      <p className="text-destructive">Impossible de charger le cantique.</p>
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
