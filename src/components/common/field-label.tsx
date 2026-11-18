import type { ReactNode } from 'react';

import { Label } from '@/components/ui/label';

type FieldLabelProps = {
  htmlFor: string;
  // Astérisque rouge des maquettes (champ obligatoire).
  required?: boolean;
  // Mention « (facultatif) » en gris, après le libellé.
  optional?: boolean;
  children: ReactNode;
};

// Libellé d'un champ de formulaire. Libellé, astérisque et mention sont dans
// un seul `span` : le `Label` de shadcn est un flex avec un `gap`, qui
// écarterait l'astérisque du texte.
export function FieldLabel({
  htmlFor,
  required,
  optional,
  children,
}: FieldLabelProps) {
  return (
    <Label htmlFor={htmlFor} className="text-base font-semibold">
      <span>
        {children}
        {required ? (
          <span aria-hidden className="text-destructive">
            {' *'}
          </span>
        ) : null}
        {optional ? (
          <span className="font-normal text-muted-foreground">
            {' (facultatif)'}
          </span>
        ) : null}
      </span>
    </Label>
  );
}
