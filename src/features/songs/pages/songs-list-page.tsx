import { RoleGuard } from '@/components/common/role-guard';
import { SearchField } from '@/components/common/search-field';
import { usePageInRange } from '@/hooks/use-page-in-range';

import { AddSongLink } from '../components/add-song-link';
import { SongsResults } from '../components/songs-results';
import { useSongs } from '../hooks/use-songs';
import { useSongsFilters } from '../hooks/use-songs-filters';
import { getSongsCountLabel } from '../utils';

// Répertoire (KAN-18, US-04), maquettes 03-Repertoire-et-voix/01-Repertoire :
// premier onglet et page d'accueil après la connexion, pour tous les rôles.
// Les pastilles de thème (filtres, couleur liturgique, colonne Thème) arrivent
// avec KAN-23.
export function SongsListPage() {
  const filters = useSongsFilters();
  const songs = useSongs(filters.query);
  usePageInRange(songs.data?.meta, filters.query.page ?? 1, filters.setPage);
  const count = songs.data?.meta.songs_count;

  return (
    <>
      <header className="flex items-end justify-between gap-4 pb-6">
        <div className="min-w-0 space-y-1">
          <h1 className="text-4xl">Répertoire</h1>
          {count === undefined ? null : (
            <p className="text-muted-foreground">{getSongsCountLabel(count)}</p>
          )}
        </div>
        <RoleGuard roles={['admin']}>
          <AddSongLink />
        </RoleGuard>
      </header>
      <SearchField
        value={filters.search}
        onChange={filters.setSearch}
        placeholder="Titre ou auteur"
        label="Rechercher un titre ou un auteur"
        className="mb-6 lg:w-80"
      />
      <SongsResults
        query={songs}
        filtered={filters.filtered}
        onPageChange={filters.setPage}
      />
    </>
  );
}
