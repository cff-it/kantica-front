import { useFormState, useWatch } from 'react-hook-form';
import { Navigate, useNavigate } from 'react-router';
import { toast } from 'sonner';

import { ActionButton } from '@/components/common/action-button';
import { PageHeader } from '@/components/common/page-header';
import { applyServerErrors } from '@/lib/form-errors';
import { getMembersImportReportPath, paths } from '@/lib/paths';

import { useImportFlow } from '../hooks/use-import-flow';
import { useStartMemberImport } from '../hooks/use-start-member-import';
import {
  getImportButtonLabel,
  getReviewNote,
  getRowsLabel,
} from '../imports';
import { ImportActionBar } from './import-action-bar';
import { ImportIssuesSection } from './import-issues-section';
import { ImportRowsSection } from './import-rows-section';
import { ImportSummaryTiles } from './import-summary-tiles';

// Deuxième étape de l'import (maquette 09) : ce que le back a lu dans le
// fichier, avant d'écrire quoi que ce soit. Les lignes à corriger ne sont pas
// importées. « Importer N membres » envoie le fichier une seconde fois (le back
// rejoue la même analyse) puis ouvre le rapport, qui suit l'import en tâche de
// fond. Sans fichier ni aperçu (rechargement de la page), retour à l'étape 1.
export function ImportReview() {
  const { form, preview, setPreview } = useImportFlow();
  const file: File | undefined = useWatch({
    control: form.control,
    name: 'file',
  });
  const { errors } = useFormState({ control: form.control });
  const navigate = useNavigate();
  const start = useStartMemberImport();

  if (!preview || !file) {
    return <Navigate to={paths.membersImport} replace />;
  }

  const errorMessage = errors.file?.message ?? errors.root?.server?.message;
  const readyCount = preview.ready_count;

  const onImport = () =>
    start.mutate(file, {
      onSuccess: (created) =>
        void navigate(getMembersImportReportPath(created.id), {
          replace: true,
        }),
      onError: (error) => {
        // 422 : le fichier est refusé à l'import (par exemple modifié depuis
        // la vérification) ; le motif du back s'affiche sous l'en-tête.
        if (!applyServerErrors(error, form.setError)) {
          toast.error('Import impossible. Réessayez dans un instant.');
        }
      },
    });

  const chooseAnotherFile = () => {
    setPreview(null);
    form.reset();
    void navigate(paths.membersImport);
  };

  return (
    <>
      <PageHeader
        title="Vérification"
        description={`${file.name} · ${getRowsLabel(preview.total)}`}
      />
      <div className="grid gap-8">
        {errorMessage ? (
          <p
            role="alert"
            className="rounded-2xl bg-failure p-4 text-failure-foreground"
          >
            {errorMessage}
          </p>
        ) : null}
        <ImportSummaryTiles
          readyCount={readyCount}
          readyLabel={readyCount > 1 ? 'prêts à importer' : 'prêt à importer'}
          errorCount={preview.error_count}
          skippedCount={preview.skipped_count}
        />
        {preview.errors.length > 0 ? (
          <ImportIssuesSection
            title="À corriger dans le fichier"
            issues={preview.errors}
            tone="error"
          />
        ) : null}
        {preview.skipped.length > 0 ? (
          <ImportIssuesSection
            title="Déjà présents, non importés"
            issues={preview.skipped}
            tone="info"
          />
        ) : null}
        {readyCount > 0 ? (
          <ImportRowsSection title="Prêts à importer" rows={preview.ready} />
        ) : (
          <p className="text-muted-foreground">
            Aucune ligne n'est prête à importer. Corrigez le fichier, puis
            choisissez-le à nouveau.
          </p>
        )}
      </div>
      <div className="mt-8">
        <ImportActionBar note={getReviewNote(preview)}>
          <ActionButton
            type="button"
            variant="ghost"
            disabled={start.isPending}
            onClick={chooseAnotherFile}
            className="text-muted-foreground lg:h-12 lg:w-auto"
          >
            Choisir un autre fichier
          </ActionButton>
          <ActionButton
            type="button"
            loading={start.isPending}
            disabled={readyCount === 0}
            onClick={onImport}
            className="lg:h-12 lg:w-auto"
          >
            {getImportButtonLabel(readyCount)}
          </ActionButton>
        </ImportActionBar>
      </div>
    </>
  );
}
