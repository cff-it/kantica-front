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

import { useUpdateMember } from '../hooks/use-update-member';
import { getVoiceChangeInput } from '../record';

type ChangeVoiceDialogProps = {
  member: User;
  fullName: string;
};

// Lien « Changer » de la ligne Voix et feuille « Attribuer la voix » qu'il
// ouvre (maquettes 03-Repertoire-et-voix/Attribution-voix) : feuille en bas sur
// mobile, fenêtre centrée dès `md`. Le PUT du back est complet : on renvoie
// toute la fiche du membre avec la nouvelle voix (`getVoiceChangeInput`).
export function ChangeVoiceDialog({
  member,
  fullName,
}: ChangeVoiceDialogProps) {
  const currentVoice = toVoice(member.profile?.voice_group);
  const [open, setOpen] = useState(false);
  const [voice, setVoice] = useState<Voice | undefined>(currentVoice);
  const updateMember = useUpdateMember();

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

    // La voix précise de la fiche (A2...) n'est pas renvoyée : elle appartient
    // à l'ancien groupe et le back la refuserait (422).
    const input = getVoiceChangeInput(member, voice);

    if (!input) {
      toast.error('La fiche est incomplète : utilisez « Modifier ».');

      return;
    }

    updateMember.mutate(
      { id: member.id, input },
      {
        onSuccess: () => {
          setOpen(false);
          toast.success('Voix modifiée.');
        },
        onError: () => {
          toast.error('Impossible de modifier la voix. Réessayez.');
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
            disabled={updateMember.isPending}
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
              loading={updateMember.isPending}
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
