import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

import { LG_MEDIA_QUERY, useMediaQuery } from '@/hooks/use-media-query';
import { getSongPath } from '@/lib/paths';
import { cn } from '@/lib/utils';

import type { SongListItem } from '../types';

// Valeur affichée quand l'auteur ou la référence ne sont pas renseignés.
const EMPTY_VALUE = '-';

type SongsListProps = {
  songs: SongListItem[];
};

// Chevron de fin de ligne (maquettes mobile et web) : décoratif, le lien porte
// le nom accessible (le titre du cantique).
function RowChevron({ className }: { className?: string }) {
  return (
    <ChevronRight
      aria-hidden
      className={cn('size-5 shrink-0 text-muted-foreground', className)}
    />
  );
}

// Mise en page mobile (sous `lg`, maquette mobile 01-Repertoire) : titre en
// Cormorant Garamond, auteur en dessous. Toute la ligne est un lien vers la
// fiche du cantique ; les séparateurs vont d'un bord à l'autre de l'écran.
// La pastille du thème (« · Noël ») arrive avec KAN-23.
function SongsRows({ songs }: SongsListProps) {
  return (
    <ul className="-mx-4 divide-y">
      {songs.map((song) => (
        <li key={song.id}>
          <Link
            to={getSongPath(song.id)}
            className="flex items-center gap-4 px-4 py-2.5 outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset"
          >
            <div className="min-w-0 flex-1 space-y-0.5">
              <p className="font-heading text-xl leading-tight font-semibold wrap-anywhere">
                {song.title}
              </p>
              {song.author ? (
                <p className="truncate text-muted-foreground">{song.author}</p>
              ) : null}
            </div>
            <RowChevron />
          </Link>
        </li>
      ))}
    </ul>
  );
}

// Mise en page web (dès `lg`, maquette web 01-Repertoire) : colonnes Titre,
// Auteur et Réf., puis le chevron ; la colonne Thème de la maquette arrive avec
// KAN-23. Le lien est sur le titre et couvre toute la ligne
// (`after:absolute after:inset-0`, la ligne est `relative`).
function SongsTable({ songs }: SongsListProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-card">
      <table className="w-full text-left text-base">
        <thead>
          <tr className="border-b text-xs font-bold tracking-wider text-muted-foreground uppercase">
            <th scope="col" className="w-1/2 px-5 py-4">
              Titre
            </th>
            <th scope="col" className="px-5 py-4">
              Auteur
            </th>
            <th scope="col" className="px-5 py-4">
              Réf.
            </th>
            <th scope="col" className="w-14 px-5 py-4">
              <span className="sr-only">Fiche</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {songs.map((song) => (
            <tr
              key={song.id}
              className="relative transition-colors hover:bg-muted/50 has-focus-visible:bg-muted/50"
            >
              <td className="px-5 py-3">
                <Link
                  to={getSongPath(song.id)}
                  className="font-heading text-xl font-semibold wrap-anywhere outline-none after:absolute after:inset-0 focus-visible:after:ring-3 focus-visible:after:ring-ring/50 focus-visible:after:ring-inset"
                >
                  {song.title}
                </Link>
              </td>
              <td className="px-5 py-3">{song.author ?? EMPTY_VALUE}</td>
              <td className="px-5 py-3 text-muted-foreground tabular-nums">
                {song.reference ?? EMPTY_VALUE}
              </td>
              <td className="px-5 py-3">
                <RowChevron className="ml-auto" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Répertoire : une seule des deux mises en page est montée, selon la bascule
// `lg` du layout (barre latérale ou barre d'onglets).
export function SongsList({ songs }: SongsListProps) {
  const isWeb = useMediaQuery(LG_MEDIA_QUERY);

  return isWeb ? <SongsTable songs={songs} /> : <SongsRows songs={songs} />;
}
