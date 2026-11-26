import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';

import { ActionButton } from '@/components/common/action-button';
import { SheetDialogContent } from '@/components/common/sheet-dialog';
import { VoicePicker } from '@/components/common/voice-picker';
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
import { toVoice } from '@/lib/voices';
import type { User, Voice } from '@/types';

import { useAssignMemberVoice } from '../hooks/use-assign-member-voice';
import { getValidationMessage, isForbiddenError } from '../utils';

type ChangeVoiceDialogProps = {
  member: User;
  fullName: string;
};

// Lien « Changer » de la ligne Voix et feuille « Attribuer la voix » qu'il
// ouvre (maquettes 03-Repertoire-et-voix/Attribution-voix) : feuille en bas sur
// mobile, fenêtre centrée dès `md`. Seule la voix est envoyée
// (`PUT /members/{id}/voice`) : une fiche incomplète se change aussi.
export function ChangeVoiceDialog({
  member,
  fullName,
}: ChangeVoiceDialogProps) {
  const currentVoice = toVoice(member.profile?.voice_group);
  const [open, setOpen] = useState(false);
  const [voice, setVoice] = useState<Voice | undefined>(currentVoice);
  const assignVoice = useAssignMemberVoice();

  // La feuille s'ouvre toujours sur la voix actuelle, même après une annulation.
  const onOpenChange = (next: boolean) => {
    if (next) {
      setVoice(currentVoice);
    }

    setOpen(next);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!voice || voice === currentVoice) {
      setOpen(false);

      return;
    }

    // Le back garde la voix précise (A2...) tant que le groupe ne change pas,
    // et l'efface sinon : elle n'appartiendrait plus au groupe.
    assignVoice.mutate(
      { id: member.id, voice },
      {
        onSuccess: () => {
          setOpen(false);
          toast.success('Voix modifiée.');
        },
        // 422 (membre sans fiche, voix refusée) : la raison du back, car un
        // nouvel essai échouerait pareil. « Réessayez » reste pour le réseau
        // et les erreurs serveur.
        onError: (error) => {
          toast.error(
            getValidationMessage(error, 'voice') ??
              (isForbiddenError(error)
                ? 'Vous n\'avez pas le droit de modifier la voix de ce membre.'
                : 'Impossible de modifier la voix. Réessayez.'),
          );
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="-mr-2 h-11 px-2 text-base font-semibold text-link"
        >
          Changer
          <span className="sr-only"> la voix de {fullName}</span>
        </Button>
      </DialogTrigger>
      <SheetDialogContent>
        <DialogHeader className="gap-2">
          <DialogTitle className="text-2xl font-semibold md:text-3xl">
            Attribuer la voix
          </DialogTitle>
          <DialogDescription className="text-base">
            {fullName}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-6">
          <VoicePicker
            name="voice_group"
            layout="sheet"
            value={voice}
            onChange={setVoice}
            disabled={assignVoice.isPending}
          />
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
            <ActionButton
              type="submit"
              loading={assignVoice.isPending}
              disabled={!voice}
              className="sm:w-auto"
            >
              Enregistrer
            </ActionButton>
          </DialogFooter>
        </form>
      </SheetDialogContent>
    </Dialog>
  );
}
