import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type ProfileSectionProps = {
  title: string;
  children: ReactNode;
};

// Carte d'une section de « Mon profil » (Présence, Vie de la chorale,
// Réglages) : titre en capitales, puis des lignes séparées par un filet. Le
// titre est au-dessus de la carte sous `lg`, dans la carte dès `lg`.
export function ProfileSection({ title, children }: ProfileSectionProps) {
  const id = `profile-section-${title}`;

  return (
    <section aria-labelledby={id} className="space-y-3 lg:space-y-0">
      <h2
        id={id}
        className="px-2 font-sans text-sm font-bold tracking-widest text-muted-foreground uppercase lg:rounded-t-2xl lg:border lg:border-b-0 lg:bg-card lg:px-6 lg:pt-6 lg:pb-4"
      >
        {title}
      </h2>
      <ul className="divide-y rounded-2xl border bg-card lg:rounded-t-none">
        {children}
      </ul>
    </section>
  );
}

const ROW = 'flex min-h-16 items-center justify-between gap-4 px-6 py-4';

// Ligne d'un écran pas encore construit : grisée, badge « Bientôt », pas de
// lien (comme les écrans des lots ultérieurs, voir `ComingSoon`).
export function ProfileSoonRow({
  label,
  description,
}: {
  label: string;
  description?: string;
}) {
  return (
    <li className={ROW}>
      <div className="min-w-0">
        <p className="text-lg font-semibold text-muted-foreground">{label}</p>
        {description ? (
          <p className="text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <span className="shrink-0 rounded-lg bg-muted px-3 py-1 text-sm font-semibold text-muted-foreground">
        Bientôt
      </span>
    </li>
  );
}

// Ligne avec une commande à droite (interrupteur « Mode sombre »). `labelId`
// relie le libellé à la commande.
export function ProfileControlRow({
  label,
  labelId,
  children,
}: {
  label: string;
  labelId: string;
  children: ReactNode;
}) {
  return (
    <li className={cn(ROW, 'py-2.5')}>
      <span id={labelId} className="text-lg font-semibold">
        {label}
      </span>
      {children}
    </li>
  );
}
