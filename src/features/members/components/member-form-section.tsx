import { useId, type ReactNode } from 'react';

type MemberFormSectionProps = {
  title: string;
  // Précision du titre, hors capitales : « facultatif » pour le mariage.
  note?: string;
  children: ReactNode;
};

// Carte d'une section du formulaire « Modifier la fiche » (maquette
// 11-Modification-fiche-membre) : titre en petites capitales, champs empilés.
export function MemberFormSection({
  title,
  note,
  children,
}: MemberFormSectionProps) {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className="rounded-2xl border bg-card p-5 lg:p-6"
    >
      <h2
        id={titleId}
        className="mb-4 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase"
      >
        {title}
        {note ? (
          <span className="tracking-normal normal-case">{` · ${note}`}</span>
        ) : null}
      </h2>
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  );
}
