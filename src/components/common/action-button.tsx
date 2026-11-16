import { LoaderCircle } from 'lucide-react';
import type { ComponentProps } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ActionButtonProps = ComponentProps<typeof Button> & {
  loading?: boolean;
};

// Taille tactile des écrans publics : 56 px de haut, texte de 16 px.
const BASE = 'h-14 w-full rounded-xl px-6 text-base font-semibold';

// Enveloppe le Button shadcn (qui reste intact dans `components/ui/`) : taille
// tactile et état de chargement pendant l'envoi d'un formulaire.
export function ActionButton({
  loading = false,
  asChild,
  disabled,
  className,
  children,
  ...props
}: ActionButtonProps) {
  // Avec `asChild`, le Button n'accepte qu'un seul enfant (un lien, par
  // exemple) : pas de pastille de chargement.
  if (asChild) {
    return (
      <Button asChild className={cn(BASE, className)} {...props}>
        {children}
      </Button>
    );
  }

  return (
    <Button
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(BASE, className)}
      {...props}
    >
      {loading ? <LoaderCircle aria-hidden className="size-5 animate-spin" /> : null}
      {children}
    </Button>
  );
}
