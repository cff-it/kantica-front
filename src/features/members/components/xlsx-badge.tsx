import { cn } from '@/lib/utils';

type XlsxBadgeProps = {
  className?: string;
};

// Icône « XLSX » (carré vert) de la maquette 08 : fichier choisi et lignes de
// l'historique. Décorative, le nom du fichier est toujours écrit à côté.
export function XlsxBadge({ className }: XlsxBadgeProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex size-11 shrink-0 items-center justify-center rounded-lg',
        'bg-excel text-xs font-bold text-excel-foreground',
        className,
      )}
    >
      XLSX
    </span>
  );
}
