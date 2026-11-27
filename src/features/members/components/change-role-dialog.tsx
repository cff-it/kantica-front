import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';

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
import { findRole, getHighestRole } from '@/lib/roles';
import type { Role, User } from '@/types';

import { useAssignUserRole } from '../hooks/use-assign-user-role';
import { getRoleErrorMessage } from '../utils';
import { RolePicker } from './role-picker';

type ChangeRoleDialogProps = {
  member: User;
  fullName: string;
};

// Lien « Changer » de la ligne Rôle de la fiche et feuille « Attribuer le
// rôle » qu'il ouvre (sur le modèle de « Attribuer la voix ») : feuille en bas
// sur mobile, fenêtre centrée dès `md`. Réservé à l'admin : la fiche ne monte
// ce composant que pour lui (`RoleGuard`), le back refuse les autres (403).
export function ChangeRoleDialog({ member, fullName }: ChangeRoleDialogProps) {
  const currentRole = getHighestRole(member) ?? null;
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<Role | null>(currentRole);
  const assign = useAssignUserRole();

  // La feuille s'ouvre toujours sur le rôle actuel, même après une annulation.
  const onOpenChange = (next: boolean) => {
    if (next) {
      setRole(currentRole);
    }

    setOpen(next);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!role || role === currentRole) {
      setOpen(false);

      return;
    }

    assign.mutate(
      { id: member.id, role },
      {
        onSuccess: (updated) => {
          setOpen(false);
          toast.success(
            `Rôle modifié : ${findRole(updated.role)?.label ?? role}.`,
          );
        },
        onError: (error) => {
          toast.error(getRoleErrorMessage(error));
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
          <span className="sr-only"> le rôle de {fullName}</span>
        </Button>
      </DialogTrigger>
      <SheetDialogContent>
        <DialogHeader className="gap-2">
          <DialogTitle className="text-2xl font-semibold md:text-3xl">
            Attribuer le rôle
          </DialogTitle>
          <DialogDescription className="text-base">{fullName}</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-6">
          <RolePicker
            layout="buttons"
            label={`Rôle de ${fullName}`}
            value={role}
            onChange={setRole}
            disabled={assign.isPending}
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
              loading={assign.isPending}
              disabled={!role}
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
