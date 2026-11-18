import { Check } from 'lucide-react';
import { useId } from 'react';

import { cn } from '@/lib/utils';

type ChoiceChipsProps = {
  name: string;
  legend: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  onBlur?: () => void;
  required?: boolean;
  // Texte d'aide sous les pastilles (ex. : « Plusieurs choix possibles »).
  hint?: string;
  error?: string;
};

// Choix multiple en pastilles (maquette 11, « À contacter en cas d'urgence »).
// Cases à cocher natives masquées visuellement : clavier et lecteurs d'écran
// fonctionnent sans code en plus. La coche apparaît quand la pastille est
// cochée (`group/chip`).
export function ChoiceChips({
  name,
  legend,
  options,
  value,
  onChange,
  onBlur,
  required,
  hint,
  error,
}: ChoiceChipsProps) {
  const hintId = useId();
  const errorId = useId();
  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') ||
    undefined;

  const toggle = (option: string) => {
    onChange(
      value.includes(option)
        ? value.filter((selected) => selected !== option)
        : [...value, option],
    );
  };

  return (
    <fieldset aria-describedby={describedBy} className="min-w-0 space-y-2">
      <legend className="mb-2 text-base font-semibold">
        {legend}
        {required ? (
          <span aria-hidden className="text-destructive">
            {' *'}
          </span>
        ) : null}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option}
            className={cn(
              'group/chip flex min-h-11 cursor-pointer items-center gap-2 rounded-full',
              'border bg-background px-4 text-base font-semibold transition-colors',
              'hover:bg-muted',
              'has-checked:border-primary has-checked:bg-primary',
              'has-checked:text-primary-foreground has-checked:hover:bg-primary/90',
              'has-focus-visible:ring-3 has-focus-visible:ring-ring/50',
            )}
          >
            <input
              type="checkbox"
              name={name}
              value={option}
              checked={value.includes(option)}
              onChange={() => toggle(option)}
              onBlur={onBlur}
              className="sr-only"
            />
            <Check
              aria-hidden
              className="hidden size-4 group-has-[:checked]/chip:block"
            />
            {option}
          </label>
        ))}
      </div>
      {hint ? (
        <p id={hintId} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
