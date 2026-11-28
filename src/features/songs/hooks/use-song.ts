import { useQuery } from '@tanstack/react-query';

import { getSong } from '../api/get-song';
import { songKeys } from '../keys';

// Un cantique et ses sections (formulaire « Modifier le cantique »).
//
// `networkMode: 'always'` : hors ligne, le mode par défaut met la requête en
// pause et l'écran resterait sur « Chargement du cantique… » ; ici elle échoue
// et l'erreur s'affiche avec « Réessayer » (comme `useSongs`).
//
// `refetchOnMount: 'always'` : le formulaire ne lit ses valeurs de départ
// qu'au montage, et le PUT est complet (`section_id` et `notes` repartent tels
// que lus). Un cache encore frais (`staleTime` de 30 s) ferait modifier des
// sections périmées : on recharge toujours à l'ouverture, `SongLoader`
// attendant ce rechargement avant d'afficher le formulaire.
export function useSong(id: number) {
  return useQuery({
    queryKey: songKeys.detail(id),
    queryFn: () => getSong(id),
    networkMode: 'always',
    refetchOnMount: 'always',
  });
}
