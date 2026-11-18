import { Download, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { useDownloadImportTemplate } from '../hooks/use-download-import-template';
import { IMPORT_COLUMNS } from '../imports';
import { ImportStepCard } from './import-step-card';

// Étape 1 de l'import : les colonnes attendues et le modèle à télécharger
// (maquette 08).
export function ImportTemplateCard() {
  const download = useDownloadImportTemplate();

  const onDownload = () =>
    download.mutate(undefined, {
      onError: () => {
        toast.error('Téléchargement impossible. Réessayez dans un instant.');
      },
    });

  return (
    <ImportStepCard step={1} title="Remplir le modèle">
      <p className="text-muted-foreground">
        Une ligne par choriste, avec ces colonnes :
      </p>
      <ul className="flex flex-wrap gap-2">
        {IMPORT_COLUMNS.map((column) => (
          <li
            key={column}
            className="rounded-lg bg-muted px-3 py-2 text-sm font-semibold"
          >
            {column}
          </li>
        ))}
      </ul>
      <Button
        type="button"
        variant="outline"
        disabled={download.isPending}
        aria-busy={download.isPending || undefined}
        onClick={onDownload}
        className="mt-auto h-12 w-full gap-2 rounded-xl px-5 text-base font-semibold text-link lg:w-auto lg:self-start"
      >
        {download.isPending ? (
          <LoaderCircle aria-hidden className="size-5 animate-spin" />
        ) : (
          <Download aria-hidden className="size-5" />
        )}
        Télécharger le modèle (.xlsx)
      </Button>
    </ImportStepCard>
  );
}
