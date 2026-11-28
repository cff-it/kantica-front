import type { Blocker } from 'react-router';

import { ActionButton } from '@/components/common/action-button';
import { SheetDialogContent } from '@/components/common/sheet-dialog';
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type UnsavedChangesDialogProps = {
  // Venu de `useUnsavedChangesGuard` : la feuille s'ouvre quand la navigation
  // est bloquée.
  blocker: Blocker;
};

// Confirmation avant de quitter un formulaire modifié (feuille en bas sur
// mobile, fenêtre centrée dès `md`). « Rester » est le premier bouton, donc
// celui qui reçoit le focus : fermer la feuille (Échap, croix) reste aussi sur
// l'écran, seul « Quitter sans enregistrer » abandonne la saisie.
export function UnsavedChangesDialog({ blocker }: UnsavedChangesDialogProps) {
  return (
    <Dialog
      open={blocker.state === 'blocked'}
      onOpenChange={(open) => {
        if (!open && blocker.state === 'blocked') {
          blocker.reset();
        }
      }}
    >
      <SheetDialogContent>
        <DialogHeader className="gap-2">
          <DialogTitle className="text-2xl font-semibold md:text-3xl">
            Quitter sans enregistrer ?
          </DialogTitle>
          <DialogDescription className="text-base">
            Vos modifications n'ont pas été enregistrées. Elles seront perdues
            si vous quittez cet écran.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-3 sm:items-center">
          <ActionButton
            type="button"
            variant="ghost"
            onClick={() => {
              if (blocker.state === 'blocked') {
                blocker.reset();
              }
            }}
            className="text-muted-foreground sm:w-auto"
          >
            Rester
          </ActionButton>
          <ActionButton
            type="button"
            onClick={() => {
              if (blocker.state === 'blocked') {
                blocker.proceed();
              }
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 sm:w-auto"
          >
            Quitter sans enregistrer
          </ActionButton>
        </DialogFooter>
      </SheetDialogContent>
    </Dialog>
  );
}
