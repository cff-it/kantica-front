import { VoiceBadge } from '@/components/common/voice-badge';
import { LG_MEDIA_QUERY, useMediaQuery } from '@/hooks/use-media-query';

import { getRemainingLabel, IMPORT_ROWS_VISIBLE } from '../imports';
import type { ImportRow } from '../types';
import { MemberName } from './member-name';

type RowsProps = {
  rows: ImportRow[];
};

// Mise en page mobile : le nom, puis la voix à droite.
function RowsList({ rows }: RowsProps) {
  return (
    <ul className="divide-y">
      {rows.map((row) => (
        <li
          key={row.line}
          className="flex items-center justify-between gap-3 px-4 py-4"
        >
          <p className="min-w-0 text-base">
            <MemberName member={row} />
          </p>
          <VoiceBadge voice={row.voice} />
        </li>
      ))}
    </ul>
  );
}

// Mise en page web (maquette 09) : colonnes Nom, Voix et Email.
function RowsTable({ rows }: RowsProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-base">
        <thead>
          <tr className="border-b text-xs font-bold tracking-wider text-muted-foreground uppercase">
            <th scope="col" className="px-5 py-4">
              Nom
            </th>
            <th scope="col" className="px-5 py-4">
              Voix
            </th>
            <th scope="col" className="px-5 py-4">
              Email
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((row) => (
            <tr key={row.line}>
              <td className="px-5 py-3">
                <MemberName member={row} />
              </td>
              <td className="px-5 py-3">
                <VoiceBadge voice={row.voice} />
              </td>
              <td className="px-5 py-3 whitespace-nowrap">{row.mail}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type ImportRowsSectionProps = RowsProps & {
  title: string;
};

// Membres prêts à importer (vérification) ou importés (rapport) : les premiers
// seulement, les autres sont résumés par « et 36 autres choristes » (maquette
// 09).
export function ImportRowsSection({ title, rows }: ImportRowsSectionProps) {
  const isWeb = useMediaQuery(LG_MEDIA_QUERY);
  const visible = rows.slice(0, IMPORT_ROWS_VISIBLE);
  const remaining = rows.length - visible.length;

  return (
    <section>
      <h2 className="mb-3 font-sans text-sm font-bold tracking-wider text-muted-foreground uppercase">
        {title}
      </h2>
      <div className="overflow-hidden rounded-2xl border bg-card">
        {isWeb ? <RowsTable rows={visible} /> : <RowsList rows={visible} />}
        {remaining > 0 ? (
          <p className="border-t px-4 py-3 text-sm text-muted-foreground lg:px-5">
            {getRemainingLabel(remaining)}
          </p>
        ) : null}
      </div>
    </section>
  );
}
