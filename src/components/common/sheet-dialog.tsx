import { X } from 'lucide-react';
import type { ComponentProps } from 'react';

import { Button } from '@/components/ui/button';
import { DialogClose, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// Contenu de modale responsive (maquette 07-Export-PDF-CSV) : feuille ancrée
// en bas de l'écran avec une poignée sur mobile, fenêtre centrée avec une
// croix de fermeture dès `md`. Enveloppe le DialogContent shadcn, qui reste
// intact dans `components/ui/`. La croix de shadcn (libellé anglais) est
// remplacée par la nôtre.
export function SheetDialogContent({
  className,
  children,
  ...props
}: ComponentProps<typeof DialogContent>) {
  return (
    <DialogContent
      showCloseButton={false}
      className={cn(
        // Mobile : feuille pleine largeur collée en bas, qui glisse.
        'top-auto bottom-0 left-0 max-w-none translate-x-0 translate-y-0',
        'rounded-t-3xl rounded-b-none p-6 pb-8 sm:max-w-none',
        'data-open:slide-in-from-bottom-full data-open:zoom-in-100',
        'data-closed:slide-out-to-bottom-full data-closed:zoom-out-100',
        // Grand écran : fenêtre centrée, qui zoome.
        'md:top-1/2 md:bottom-auto md:left-1/2 md:max-w-lg',
        'md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl md:p-8',
        'md:data-open:slide-in-from-bottom-0 md:data-open:zoom-in-95',
        'md:data-closed:slide-out-to-bottom-0 md:data-closed:zoom-out-95',
        className,
      )}
      {...props}
    >
      <div
        aria-hidden
        className="mx-auto -mb-2 h-1.5 w-12 rounded-full bg-border md:hidden"
      />
      {children}
      <DialogClose asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-6 right-6 hidden size-11 rounded-full md:inline-flex"
        >
          <X aria-hidden className="size-5" />
          <span className="sr-only">Fermer</span>
        </Button>
      </DialogClose>
    </DialogContent>
  );
}
