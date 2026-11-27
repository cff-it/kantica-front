import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { getSongs } from '../api/get-songs';
import { songKeys } from '../keys';
import type { SongsQuery } from '../types';

export function useSongs(params: SongsQuery = {}) {
  return useQuery({
    queryKey: songKeys.list(params),
    queryFn: () => getSongs(params),
    // Évite le clignotement de la liste lors d'une recherche ou d'un
    // changement de page.
    placeholderData: keepPreviousData,
    // Hors ligne, le mode par défaut met la requête en pause : la page
    // d'accueil resterait sur « Chargement… » sans fin. Ici la requête part
    // quand même, et son échec affiche l'erreur et « Réessayer ».
    networkMode: 'always',
  });
}
