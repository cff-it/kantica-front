import { Download } from 'lucide-react';
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
import type { Voice } from '@/types';

import { useExportMembers } from '../hooks/use-export-members';
import type { ExportFormat } from '../types';
import { getExportScopeLabel } from '../utils';
import { ExportFormatPicker } from './export-format-picker';

const FORMAT_LABELS: Record<ExportFormat, string> = {
  pdf: 'PDF',
  csv: 'CSV',
};

type ExportMembersDialogProps = {
  // Effectif visé, pour le rappel du périmètre (voir `getExportCount`).
  count?: number;
  // Filtre de voix actif de la liste ; absent = toutes les voix.
  voice?: Voice;
};

// Bouton « Exporter » de la liste des membres et feuille « Exporter la
// liste » qu'il ouvre (maquette 07-Export-PDF-CSV). Le fichier est généré par
// le back puis téléchargé par `useExportMembers`.
export function ExportMembersDialog({
  count,
  voice,
}: ExportMembersDialogProps) {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<ExportFormat>('pdf');
  const exportMembers = useExportMembers();

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    exportMembers.mutate(
      { format, voice },
      {
        onSuccess: () => setOpen(false),
        onError: () => {
          toast.error('Export impossible. Réessayez dans un instant.');
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-12 w-full gap-2 rounded-xl px-5 text-base font-semibold text-link sm:w-auto"
        >
          <Download aria-hidden className="size-5" />
          Exporter
        </Button>
      </DialogTrigger>
      <SheetDialogContent>
        <DialogHeader className="gap-2">
          <DialogTitle className="text-2xl font-semibold md:text-3xl">
            Exporter la liste
          </DialogTitle>
          <DialogDescription className="text-base">
            {getExportScopeLabel(count, voice)}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-6">
          <ExportFormatPicker
            value={format}
            onChange={setFormat}
            disabled={exportMembers.isPending}
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
              loading={exportMembers.isPending}
              className="gap-2.5 sm:w-auto"
            >
              {exportMembers.isPending ? null : (
                <Download aria-hidden className="size-5" />
              )}
              Exporter en {FORMAT_LABELS[format]}
            </ActionButton>
          </DialogFooter>
        </form>
      </SheetDialogContent>
    </Dialog>
  );
}
