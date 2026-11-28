import { useParams } from 'react-router';

import { SongForm } from '../components/song-form';
import { SongLoader } from '../components/song-loader';
import { SongNotFound } from '../components/song-not-found';
import { parseSongId } from '../utils';

// « Modifier le cantique » (admin) : le formulaire d'un cantique, prérempli.
// `key` repart d'un formulaire neuf quand on passe d'un cantique à un autre.
// Le lien d'entrée (le crayon de la fiche) arrive avec KAN-25 : en attendant,
// l'écran s'ouvre par son adresse, `/songs/:id/edit`.
export function SongEditPage() {
  const songId = parseSongId(useParams().id);

  if (songId === undefined) {
    return <SongNotFound />;
  }

  return (
    <SongLoader key={songId} id={songId}>
      {(song) => <SongForm song={song} />}
    </SongLoader>
  );
}
