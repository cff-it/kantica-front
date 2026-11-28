import { cn } from '@/lib/utils';

type SegmentedControlOption<T extends string> = {
  value: T;
  label: string;
};

type SegmentedControlProps<T extends string> = {
  name: string;
  // Nom du groupe pour les lecteurs d'écran (non affiché).
  legend: string;
  options: readonly SegmentedControlOption<T>[];
  // Une valeur hors des options (type inconnu de l'interface) ne coche rien.
  value: string;
  onChange: (value: T) => void;
  onBlur?: () => void;
  className?: string;
};

// Sélecteur segmenté à choix unique (maquette 03-Repertoire-et-voix,
// « Couplet / Refrain »). Boutons radio natifs masqués visuellement : les
// flèches du clavier et les lecteurs d'écran fonctionnent sans code en plus.
// Le segment actif est celui dont le radio est coché (`has-checked`). Chaque
// segment fait 44 px de haut au moins (zone tactile minimale de l'interface).
export function SegmentedControl<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
  onBlur,
  className,
}: SegmentedControlProps<T>) {
  return (
    <fieldset className={cn('min-w-0', className)}>
      <legend className="sr-only">{legend}</legend>
      <div className="flex rounded-xl bg-muted p-1 dark:bg-background">
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              'flex min-h-11 flex-1 cursor-pointer items-center justify-center',
              'rounded-lg px-3 text-base font-semibold text-muted-foreground',
              'transition-colors hover:text-foreground',
              'has-checked:bg-background has-checked:text-foreground',
              'has-checked:shadow-xs dark:has-checked:bg-secondary',
              'has-focus-visible:ring-3 has-focus-visible:ring-ring/50',
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              onBlur={onBlur}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
