import { useId, type ComponentProps, type ReactNode } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type FormFieldProps = ComponentProps<typeof Input> & {
  label: string;
  error?: string;
  hint?: ReactNode;
  // Élément posé à droite, dans la saisie (par exemple l'œil d'un mot de
  // passe). Il doit se positionner lui-même en `absolute` ; la saisie réserve
  // la place avec un padding droit.
  trailing?: ReactNode;
};

// Champ de formulaire : libellé, saisie, indice et message d'erreur reliés
// entre eux pour les lecteurs d'écran. Dimensionné pour le tactile (48 px de
// haut, texte de 16 px y compris sur grand écran).
export function FormField({
  label,
  error,
  hint,
  trailing,
  id,
  className,
  ...inputProps
}: FormFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') ||
    undefined;

  return (
    <div className="space-y-2">
      <Label htmlFor={inputId} className="text-base font-semibold">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            'h-12 rounded-xl px-4 text-base md:text-base',
            trailing && 'pr-14',
            className,
          )}
          {...inputProps}
        />
        {trailing}
      </div>
      {hint ? <div id={hintId}>{hint}</div> : null}
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
