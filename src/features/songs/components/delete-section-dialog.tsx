import { Trash2 } from 'lucide-react';

import { ActionButton } from '@/components/common/action-button';
import { SheetDialogContent } from '@/components/common/sheet-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type DeleteSectionDialogProps = {
  // Rang de la section à l'écran (à partir de 1), pour la nommer.
  position: number;
  onConfirm: () => void;
};

// Bouton « Supprimer » d'une section et feuille de confirmation qu'il ouvre.
// Rien n'est supprimé côté back avant « Enregistrer le cantique » : la section
// est seulement retirée de la liste du formulaire. Le déclencheur est dans le
// composant (`DialogTrigger`) : Radix rend ainsi le focus au bouton quand on
// annule.
export function DeleteSectionDialog({
  position,
  onConfirm,
}: DeleteSectionDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          aria-label={`Supprimer la section ${position}`}
          className="h-11 gap-2 rounded-xl px-3 text-base font-semibold text-muted-foreground hover:text-destructive"
        >
          <Trash2 aria-hidden className="size-5" />
          Supprimer
        </Button>
      </DialogTrigger>
      <SheetDialogContent>
        <DialogHeader className="gap-2">
          <DialogTitle className="text-2xl font-semibold md:text-3xl">
            Supprimer la section ?
          </DialogTitle>
          <DialogDescription className="text-base">
            {`La section ${position} sera retirée du cantique à l'enregistrement. Son texte sera perdu.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-3 sm:items-center">
          <DialogClose asChild>
            <ActionButton
              type="button"
              variant="ghost"
              className="text-muted-foreground sm:w-auto"
            >
              Annuler
            </ActionButton>
          </DialogClose>
          <DialogClose asChild>
            <ActionButton
              type="button"
              onClick={onConfirm}
              className="gap-2.5 bg-destructive text-destructive-foreground hover:bg-destructive/90 sm:w-auto"
            >
              <Trash2 aria-hidden className="size-5" />
              Supprimer
            </ActionButton>
          </DialogClose>
        </DialogFooter>
      </SheetDialogContent>
    </Dialog>
  );
}
