import { Upload, X } from 'lucide-react';
import { useId, useState, type DragEvent } from 'react';
import { useController, useFormState, useWatch } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useImportFlow } from '../hooks/use-import-flow';
import { formatFileSize } from '../imports';
import { ImportStepCard } from './import-step-card';
import { XlsxBadge } from './xlsx-badge';

const ACCEPT =
  '.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

// Étape 2 de l'import : zone de dépôt (maquette web 08) et fichier choisi, avec
// sa croix pour le retirer. Sous `lg` (pas de glisser-déposer au doigt), la
// zone cède la place au fichier dès qu'il est choisi (maquette mobile 08). Le
// fichier est la valeur du champ `file` du formulaire du layout ; une erreur du
// schéma ou du back (422) s'affiche en dessous.
export function ImportFileCard() {
  const { form, setPreview } = useImportFlow();
  const { field, fieldState } = useController({
    name: 'file',
    control: form.control,
  });
  const { errors } = useFormState({ control: form.control });
  const inputId = useId();
  const [dragging, setDragging] = useState(false);
  // `useWatch` plutôt que `field.value` : `field` embarque la ref du champ, et
  // la règle `react-hooks/refs` refuse d'y lire une valeur pendant le rendu.
  const file: File | undefined = useWatch({
    control: form.control,
    name: 'file',
  });
  const errorMessage = fieldState.error?.message ?? errors.root?.server?.message;

  const selectFile = (next: File | undefined) => {
    if (!next) {
      return;
    }

    // Un autre fichier : l'aperçu de l'ancien ne vaut plus.
    setPreview(null);
    field.onChange(next);
  };

  const removeFile = () => {
    setPreview(null);
    form.reset();
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    selectFile(event.dataTransfer.files[0]);
  };

  return (
    <ImportStepCard step={2} title="Envoyer le fichier">
      <label
        htmlFor={inputId}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'flex cursor-pointer flex-col items-center gap-2 rounded-2xl',
          'border-2 border-dashed border-input px-4 py-8 text-center',
          'transition-colors has-focus-visible:border-ring',
          'has-focus-visible:ring-3 has-focus-visible:ring-ring/50',
          dragging && 'border-primary bg-secondary',
          file && 'hidden lg:flex',
        )}
      >
        <Upload aria-hidden className="size-7 text-link" />
        <span className="text-base font-semibold text-link">
          <span className="lg:hidden">Choisir un fichier Excel</span>
          <span className="hidden lg:inline">
            Glissez votre fichier ici ou choisissez-le
          </span>
        </span>
        <span className="text-sm text-muted-foreground">
          .xlsx, 5 Mo au plus
        </span>
        <input
          id={inputId}
          type="file"
          accept={ACCEPT}
          className="sr-only"
          onChange={(event) => {
            selectFile(event.target.files?.[0]);
            // Permet de rechoisir le même fichier après l'avoir retiré.
            event.target.value = '';
          }}
        />
      </label>
      {file ? (
        <div className="flex items-center gap-3 rounded-xl bg-secondary p-3">
          <XlsxBadge />
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold">{file.name}</p>
            <p className="text-muted-foreground">{formatFileSize(file.size)}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Retirer le fichier"
            onClick={removeFile}
            className="size-11 shrink-0 rounded-full"
          >
            <X aria-hidden className="size-5" />
          </Button>
        </div>
      ) : null}
      {errorMessage ? (
        <p role="alert" className="text-destructive">
          {errorMessage}
        </p>
      ) : null}
    </ImportStepCard>
  );
}
