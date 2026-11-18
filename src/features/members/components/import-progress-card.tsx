import { LoaderCircle } from 'lucide-react';

import type { ImportProgress } from '../types';

type ImportProgressCardProps = {
  progress: ImportProgress;
};

// Import en cours (en attente ou en traitement) : barre d'avancement lue dans
// `progress.percent`, mise à jour par le suivi de `useMemberImport`. Les
// maquettes n'ont pas d'écran pour cet état : le back traite l'import en tâche
// de fond.
export function ImportProgressCard({ progress }: ImportProgressCardProps) {
  return (
    <section
      aria-live="polite"
      className="space-y-4 rounded-2xl border bg-card p-5 lg:p-6"
    >
      <div className="flex items-center gap-3">
        <LoaderCircle aria-hidden className="size-6 animate-spin text-link" />
        <h2 className="font-sans text-xl font-bold">Import en cours</h2>
      </div>
      <div
        role="progressbar"
        aria-label="Avancement de l'import"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress.percent}
        className="h-3 overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-primary transition-[width]"
          style={{ width: `${progress.percent}%` }}
        />
      </div>
      <p className="text-muted-foreground">
        {progress.percent} %. L'import continue en tâche de fond : vous pouvez
        quitter cette page, il restera dans l'historique.
      </p>
    </section>
  );
}
