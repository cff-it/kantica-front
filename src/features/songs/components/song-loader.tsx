import type { ReactNode } from 'react';

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
export function SongLoader({ id, children }: SongLoaderProps) {
  const query = useSong(id);

  if (query.isPending) {
    return (
      <p role="status" className="py-12 text-center text-muted-foreground">
        Chargement du cantique…
      </p>
    );
  }

  if (query.isError) {
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

  return children(query.data);
}
