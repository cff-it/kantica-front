import { useId, type ComponentProps, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { FieldLabel } from './field-label';

type FormTextareaProps = ComponentProps<'textarea'> & {
  label: string;
  error?: string;
  hint?: ReactNode;
  // Mention « (facultatif) » après le libellé.
  optional?: boolean;
  // Libellé réservé aux lecteurs d'écran : pour un champ dont le contexte
  // visuel (une carte numérotée) tient lieu de libellé.
  hideLabel?: boolean;
};

// Zone de texte multiligne : même gabarit que `FormField` (libellé, indice et
// erreur reliés pour les lecteurs d'écran, texte de 16 px). Le composant
// shadcn `textarea` n'est pas installé : le champ natif reprend le style de
// `Input`.
export function FormTextarea({
  label,
  error,
  hint,
  optional,
  hideLabel,
  required,
  id,
  className,
  ...textareaProps
}: FormTextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  const errorId = `${textareaId}-error`;
  const hintId = `${textareaId}-hint`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') ||
    undefined;

  return (
    <div className="space-y-2">
      <div className={hideLabel ? 'sr-only' : undefined}>
        <FieldLabel
          htmlFor={textareaId}
          required={required}
          optional={optional}
        >
          {label}
        </FieldLabel>
      </div>
      <textarea
        id={textareaId}
        rows={3}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={cn(
          'min-h-24 w-full resize-y rounded-xl border border-input bg-transparent px-4 py-3 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
          className,
        )}
        {...textareaProps}
      />
      {hint ? <div id={hintId}>{hint}</div> : null}
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
