import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

import { ListPagination } from '@/components/common/list-pagination';
import { Button } from '@/components/ui/button';
import { LG_MEDIA_QUERY, useMediaQuery } from '@/hooks/use-media-query';
import { getFullName } from '@/lib/names';
import { getMembersImportReportPath } from '@/lib/paths';
import { cn, formatShortDate, formatTime } from '@/lib/utils';

import { useMemberImports } from '../hooks/use-member-imports';
import {
  getImportFileName,
  getImportOutcome,
  getImportResultLabel,
} from '../imports';
import type { MemberImportListItem } from '../types';
import { ImportStatusBadge } from './import-status-badge';
import { XlsxBadge } from './xlsx-badge';

type ImportListProps = {
  imports: MemberImportListItem[];
};

// Mise en page mobile (maquette 08) : une carte par import, toute la carte est
// un lien vers le rapport. Date, heure et prénom de l'auteur sur une ligne.
function ImportCards({ imports }: ImportListProps) {
  return (
    <ul className="divide-y overflow-hidden rounded-2xl border bg-card">
      {imports.map((item) => (
        <li key={item.id}>
          <Link
            to={getMembersImportReportPath(item.id)}
            className="flex gap-3 p-4 outline-none focus-visible:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset"
          >
            <XlsxBadge />
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 truncate text-base font-semibold">
                  {getImportFileName(item.file_name)}
                </p>
                <ImportStatusBadge
                  outcome={getImportOutcome(item.status, item.summary)}
                />
              </div>
              <p className="text-muted-foreground">
                {formatShortDate(item.created_at)} ·{' '}
                {formatTime(item.created_at)} ·{' '}
                {item.user.first_name ?? item.user.last_name}
              </p>
              <div className="flex items-center justify-between gap-3">
                <p>{getImportResultLabel(item)}</p>
                <ChevronRight
                  aria-hidden
                  className="size-5 shrink-0 text-muted-foreground"
                />
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

// Mise en page web (maquette web 08) : Date, Fichier, Importé par, Lignes,
// Résultat, Statut et le lien « Voir le rapport ».
function ImportTable({ imports }: ImportListProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-card">
      <table className="w-full text-left text-base">
        <thead>
          <tr className="border-b text-xs font-bold tracking-wider text-muted-foreground uppercase">
            <th scope="col" className="px-5 py-4">
              Date
            </th>
            <th scope="col" className="px-5 py-4">
              Fichier
            </th>
            <th scope="col" className="px-5 py-4">
              Importé par
            </th>
            <th scope="col" className="px-5 py-4 text-right">
              Lignes
            </th>
            <th scope="col" className="px-5 py-4">
              Résultat
            </th>
            <th scope="col" className="px-5 py-4">
              Statut
            </th>
            <th scope="col" className="px-5 py-4">
              <span className="sr-only">Rapport</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {imports.map((item) => {
            const fileName = getImportFileName(item.file_name);

            return (
              <tr key={item.id}>
                <td className="px-5 py-3 whitespace-nowrap">
                  <p className="font-semibold">
                    {formatShortDate(item.created_at)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatTime(item.created_at)}
                  </p>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <XlsxBadge className="size-9" />
                    <span className="font-semibold">{fileName}</span>
                  </div>
                </td>
                <td className="px-5 py-3">{getFullName(item.user)}</td>
                <td className="px-5 py-3 text-right tabular-nums">
                  {item.summary?.total ?? '-'}
                </td>
                <td className="px-5 py-3">{getImportResultLabel(item)}</td>
                <td className="px-5 py-3">
                  <ImportStatusBadge
                    outcome={getImportOutcome(item.status, item.summary)}
                  />
                </td>
                <td className="px-5 py-3 text-right whitespace-nowrap">
                  <Link
                    to={getMembersImportReportPath(item.id)}
                    aria-label={`Voir le rapport de ${fileName}`}
                    className="rounded-lg font-semibold text-link outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    Voir le rapport
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// « Historique des imports » (maquette 08), sous les deux étapes : du plus
// récent au plus ancien, avec chargement, erreur et état vide. Un import en
// cours est suivi tant qu'il n'est pas terminé (`useMemberImports`).
export function ImportHistory() {
  const [page, setPage] = useState(1);
  const isWeb = useMediaQuery(LG_MEDIA_QUERY);
  const history = useMemberImports(page);
  const total = history.data?.meta.total;

  return (
    <section aria-labelledby="import-history-title" className="mt-10 lg:mt-12">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 id="import-history-title" className="text-2xl lg:text-3xl">
          Historique des imports
        </h2>
        {total ? (
          <p className="hidden text-muted-foreground lg:block">
            {total} import{total > 1 ? 's' : ''}
          </p>
        ) : null}
      </div>
      <HistoryResults
        query={history}
        isWeb={isWeb}
        onPageChange={setPage}
      />
    </section>
  );
}

type HistoryResultsProps = {
  query: ReturnType<typeof useMemberImports>;
  isWeb: boolean;
  onPageChange: (page: number) => void;
};

function HistoryResults({ query, isWeb, onPageChange }: HistoryResultsProps) {
  if (query.isPending) {
    return (
      <p role="status" className="py-8 text-center text-muted-foreground">
        Chargement de l'historique…
      </p>
    );
  }

  if (query.isError) {
    return (
      <div
        role="alert"
        className="flex flex-col items-center gap-4 py-8 text-center"
      >
        <p className="text-destructive">
          Impossible de charger l'historique des imports.
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

  const { data: imports, meta } = query.data;

  if (imports.length === 0) {
    return (
      <div className="rounded-2xl border bg-card px-4 py-10 text-center">
        <p className="text-base font-semibold">Aucun import pour le moment.</p>
        <p className="text-muted-foreground">
          Les fichiers que vous importez apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <div
      aria-busy={query.isPlaceholderData || undefined}
      className={cn(
        'transition-opacity',
        query.isPlaceholderData && 'opacity-60',
      )}
    >
      {isWeb ? (
        <ImportTable imports={imports} />
      ) : (
        <ImportCards imports={imports} />
      )}
      <ListPagination
        page={meta.current_page}
        lastPage={meta.last_page}
        onPageChange={onPageChange}
      />
    </div>
  );
}
