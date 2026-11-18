import { cn } from '@/lib/utils';

type TileProps = {
  value: number;
  label: string;
  className: string;
};

function Tile({ value, label, className }: TileProps) {
  return (
    <div className={cn('rounded-2xl p-4 lg:p-6', className)}>
      {/* `lining-nums` : Cormorant Garamond a des chiffres elzéviriens par
          défaut (le « 1 » ressemble à un « I »), la maquette des alignés. */}
      <p className="font-heading text-5xl font-semibold lining-nums">
        {value}
      </p>
      <p className="text-base font-semibold">{label}</p>
    </div>
  );
}

type ImportSummaryTilesProps = {
  // Membres prêts à importer (vérification) ou importés (rapport).
  readyCount: number;
  readyLabel: string;
  errorCount: number;
  // Membres déjà présents, non importés : une tuile seulement s'il y en a, la
  // maquette n'en montre pas.
  skippedCount: number;
};

// Tuiles de chiffres de la vérification et du rapport (maquette 09) : bleue
// pour les membres, ambre pour les lignes à corriger. Deux par ligne sur
// mobile ; sur le web, toutes sur une seule ligne, alignées à gauche, de 22 rem
// au plus (elles se partagent la largeur quand la tuile « déjà présent » s'y
// ajoute).
export function ImportSummaryTiles({
  readyCount,
  readyLabel,
  errorCount,
  skippedCount,
}: ImportSummaryTilesProps) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:auto-cols-[minmax(0,22rem)] lg:grid-flow-col lg:grid-cols-none lg:gap-5">
      <Tile
        value={readyCount}
        label={readyLabel}
        className="bg-secondary text-link"
      />
      <Tile
        value={errorCount}
        label="à corriger"
        className="bg-warning text-warning-foreground"
      />
      {skippedCount > 0 ? (
        <Tile
          value={skippedCount}
          label={skippedCount > 1 ? 'déjà présents' : 'déjà présent'}
          className="bg-muted text-muted-foreground"
        />
      ) : null}
    </div>
  );
}
