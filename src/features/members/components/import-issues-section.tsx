import { Info, TriangleAlert, type LucideIcon } from 'lucide-react';

import { LG_MEDIA_QUERY, useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

import type { ImportIssue } from '../types';

type Tone = 'error' | 'info';

// Les classes sont écrites en entier pour que Tailwind les détecte. `error` :
// lignes à corriger (ambre) ; `info` : lignes ignorées, membres déjà présents.
const TONES: Record<
  Tone,
  { title: string; text: string; frame: string; icon: LucideIcon }
> = {
  error: {
    title: 'text-warning-foreground',
    text: 'text-warning-foreground',
    frame: 'border-warning-foreground/25 bg-warning/40',
    icon: TriangleAlert,
  },
  info: {
    title: 'text-muted-foreground',
    text: 'text-muted-foreground',
    frame: 'border-border bg-card',
    icon: Info,
  },
};

type IssuesProps = {
  issues: ImportIssue[];
  tone: Tone;
};

// Mise en page mobile : cartes « Ligne 7 · NOM Prénom » et son problème.
function IssuesCards({ issues, tone }: IssuesProps) {
  const { text, frame, icon: Icon } = TONES[tone];

  return (
    <ul className={cn('divide-y overflow-hidden rounded-2xl border', frame)}>
      {issues.map((issue) => (
        <li key={issue.line} className="flex gap-3 p-4">
          <Icon aria-hidden className={cn('mt-0.5 size-6 shrink-0', text)} />
          <div className="min-w-0">
            <p className="text-base">
              <span className="font-bold">Ligne {issue.line}</span>
              {issue.name ? ` · ${issue.name}` : null}
            </p>
            <p className={cn('text-base', text)}>{issue.message}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

// Mise en page web (maquette 09) : colonnes Ligne, Membre et Problème.
function IssuesTable({ issues, tone }: IssuesProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-card">
      {/* `table-fixed` : les colonnes tombent au même endroit dans les
          sections « À corriger » et « Déjà présents », quel que soit le texte. */}
      <table className="w-full table-fixed text-left text-base">
        <thead>
          <tr className="border-b text-xs font-bold tracking-wider text-muted-foreground uppercase">
            <th scope="col" className="w-40 px-5 py-4">
              Ligne
            </th>
            <th scope="col" className="w-1/3 px-5 py-4">
              Membre
            </th>
            <th scope="col" className="px-5 py-4">
              Problème
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {issues.map((issue) => (
            <tr key={issue.line}>
              <td className="px-5 py-3 font-bold whitespace-nowrap">
                Ligne {issue.line}
              </td>
              <td className="px-5 py-3">{issue.name ?? '-'}</td>
              <td className={cn('px-5 py-3', TONES[tone].text)}>
                {issue.message}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type ImportIssuesSectionProps = IssuesProps & {
  title: string;
};

// Lignes du fichier qui ne seront pas (ou n'ont pas été) importées : « À
// corriger dans le fichier » avec le numéro de ligne et le motif.
export function ImportIssuesSection({
  title,
  issues,
  tone,
}: ImportIssuesSectionProps) {
  const isWeb = useMediaQuery(LG_MEDIA_QUERY);

  return (
    <section>
      <h2
        className={cn(
          'mb-3 font-sans text-sm font-bold tracking-wider uppercase',
          TONES[tone].title,
        )}
      >
        {title}
      </h2>
      {isWeb ? (
        <IssuesTable issues={issues} tone={tone} />
      ) : (
        <IssuesCards issues={issues} tone={tone} />
      )}
    </section>
  );
}
