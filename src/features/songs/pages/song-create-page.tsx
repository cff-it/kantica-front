import { SongForm } from '../components/song-form';

// « Nouveau cantique » (KAN-13, KAN-4, admin) : le formulaire d'un cantique,
// champs vides. Le rôle est contrôlé par `RequireRole` dans le routeur ; la
// vraie barrière reste la Policy du back (403).
export function SongCreatePage() {
  return <SongForm />;
}
