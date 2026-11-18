import { cn } from '@/lib/utils';

import { IMPORT_OUTCOME_LABELS, type ImportOutcome } from '../imports';

// Les classes sont écrites en entier pour que Tailwind les détecte. « Échec »
// est un rouge foncé (`failure`), distinct du rouge CFF.
const TONES: Record<ImportOutcome, string> = {
  running: 'bg-secondary text-secondary-foreground',
  completed: 'bg-success-soft text-success-soft-foreground',
  partial: 'bg-warning text-warning-foreground',
  failed: 'bg-failure text-failure-foreground',
};

type ImportStatusBadgeProps = {
  outcome: ImportOutcome;
  className?: string;
};

// Badge de statut de l'historique : Terminé (vert), Partiel (ambre), Échec
// (rouge foncé) et, pendant le traitement, En cours.
export function ImportStatusBadge({
  outcome,
  className,
}: ImportStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full px-3 py-1 text-sm font-semibold',
        TONES[outcome],
        className,
      )}
    >
      {IMPORT_OUTCOME_LABELS[outcome]}
    </span>
  );
}
