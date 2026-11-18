import { useId, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

type ImportStepCardProps = {
  step: number;
  title: string;
  className?: string;
  children: ReactNode;
};

// Carte numérotée de l'écran d'import (« 1 Remplir le modèle », « 2 Envoyer le
// fichier », maquette 08).
export function ImportStepCard({
  step,
  title,
  className,
  children,
}: ImportStepCardProps) {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className={cn(
        'flex flex-col gap-4 rounded-2xl border bg-card p-5 lg:p-6',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground"
        >
          {step}
        </span>
        <h2 id={titleId} className="font-sans text-xl font-bold lg:text-2xl">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
