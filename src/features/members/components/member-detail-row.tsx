import { useId, type ReactNode } from 'react';

// Valeur affichée quand un champ n'est pas renseigné.
const EMPTY_VALUE = '-';

type DetailsCardProps = {
  title: string;
  children: ReactNode;
};

// Carte d'une section de la fiche (maquette 06-Fiche-membre) : titre en petites
// capitales au-dessus d'un cadre dont les lignes sont séparées par un filet.
// Mêmes six sections que le formulaire « Modifier la fiche ».
export function DetailsCard({ title, children }: DetailsCardProps) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId}>
      <h2
        id={headingId}
        className="mb-3 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase"
      >
        {title}
      </h2>
      <div className="divide-y overflow-hidden rounded-2xl border bg-card">
        {children}
      </div>
    </section>
  );
}

// Liste de lignes « libellé, valeur » d'une carte.
export function DetailRows({ children }: { children: ReactNode }) {
  return <dl className="divide-y">{children}</dl>;
}

type DetailRowProps = {
  label: string;
  // Valeur texte : « - » quand elle est vide.
  value?: string | null;
  // Contenu libre à la place de `value` (ex. : la voix et son lien « Changer »).
  children?: ReactNode;
};

// Une ligne : libellé à gauche, valeur à droite. Les retours à la ligne saisis
// (adresse, noms des contacts) sont conservés.
export function DetailRow({ label, value, children }: DetailRowProps) {
  return (
    <div className="flex min-h-14 items-center justify-between gap-4 px-5 py-2 text-base">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="flex min-w-0 items-center gap-3 text-right font-semibold break-words whitespace-pre-line">
        {children ?? (value || EMPTY_VALUE)}
      </dd>
    </div>
  );
}
