import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { formatShortDate, formatTime } from '@/lib/utils';

import { useMemberImport } from '../hooks/use-member-import';
import {
  getImportFileName,
  getRowsLabel,
  isImportRunning,
} from '../imports';
import type { MemberImport } from '../types';
import { isForbiddenError, isNotFoundError } from '../utils';
import { ImportIssuesSection } from './import-issues-section';
import { ImportNotFound } from './import-not-found';
import { ImportProgressCard } from './import-progress-card';
import { ImportRowsSection } from './import-rows-section';
import { ImportSummaryTiles } from './import-summary-tiles';

type ReportData = NonNullable<MemberImport['report']>;

// Import arrêté par une erreur. Le back écrit lui-même le motif et rappelle que
// les membres déjà créés sont conservés (une transaction par ligne) : on
// n'ajoute rien, sauf quand `error` manque.
function FailureAlert({ error }: { error: string | null }) {
  return (
    <div
      role="alert"
      className="space-y-1 rounded-2xl bg-failure p-5 text-failure-foreground"
    >
      <p className="font-bold">L'import s'est arrêté.</p>
      <p>
        {error ??
          'Une erreur est survenue pendant le traitement. Les membres déjà créés sont conservés.'}
      </p>
    </div>
  );
}

// Même présentation que l'écran de vérification, sans le bouton « Importer » :
// chiffres, lignes à corriger, lignes ignorées et membres importés. `imported`
// manque aux rapports enregistrés avant son ajout au back : la liste est alors
// masquée.
function ReportDetails({ report }: { report: ReportData }) {
  return (
    <>
      <ImportSummaryTiles
        readyCount={report.created}
        readyLabel={report.created > 1 ? 'importés' : 'importé'}
        errorCount={report.error_count}
        skippedCount={report.skipped_count}
      />
      {report.errors.length > 0 ? (
        <ImportIssuesSection
          title="À corriger dans le fichier"
          issues={report.errors}
          tone="error"
        />
      ) : null}
      {report.skipped.length > 0 ? (
        <ImportIssuesSection
          title="Déjà présents, non importés"
          issues={report.skipped}
          tone="info"
        />
      ) : null}
      {report.imported && report.imported.length > 0 ? (
        <ImportRowsSection title="Membres importés" rows={report.imported} />
      ) : null}
    </>
  );
}

function ReportContent({ item }: { item: MemberImport }) {
  const { report } = item;
  const description = [
    getImportFileName(item.file_name),
    report ? getRowsLabel(report.total) : null,
    `${formatShortDate(item.created_at)} · ${formatTime(item.created_at)}`,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <>
      <PageHeader title="Rapport d'import" description={description} />
      <div className="grid gap-8">
        {isImportRunning(item.status) ? (
          <ImportProgressCard progress={item.progress} />
        ) : null}
        {item.status === 'failed' ? (
          <FailureAlert error={item.error} />
        ) : null}
        {report ? <ReportDetails report={report} /> : null}
      </div>
    </>
  );
}

type ImportReportProps = {
  id: number;
};

// Rapport d'un import, en lecture seule (« Voir le rapport » de l'historique,
// et arrivée après « Importer »). Pendant le traitement, la barre d'avancement
// remplace le rapport ; le suivi s'arrête tout seul à la fin.
export function ImportReport({ id }: ImportReportProps) {
  const query = useMemberImport(id);

  if (query.isPending) {
    return (
      <p role="status" className="py-12 text-center text-muted-foreground">
        Chargement du rapport…
      </p>
    );
  }

  if (query.isError) {
    if (isNotFoundError(query.error)) {
      return <ImportNotFound />;
    }

    if (isForbiddenError(query.error)) {
      return <ImportNotFound forbidden />;
    }

    return (
      <div
        role="alert"
        className="flex flex-col items-center gap-4 py-12 text-center"
      >
        <p className="text-destructive">Impossible de charger le rapport.</p>
        <Button
          variant="outline"
          className="h-12 rounded-xl px-5 text-base font-semibold"
          onClick={() => void query.refetch()}
        >
          Réessayer
        </Button>
      </div>
    );
  }

  return <ReportContent item={query.data} />;
}
