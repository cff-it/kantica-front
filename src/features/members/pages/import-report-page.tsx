import { useParams } from 'react-router';

import { paths } from '@/lib/paths';

import { ImportBackLink } from '../components/import-back-link';
import { ImportNotFound } from '../components/import-not-found';
import { ImportReport } from '../components/import-report';
import { parseImportId } from '../imports';

// Rapport d'un import (secrétaire, admin), « Voir le rapport » de l'historique :
// même présentation que la vérification, en lecture seule. Un identifiant
// illisible affiche « Import introuvable » sans appel au back.
export function ImportReportPage() {
  const { id } = useParams();
  const importId = parseImportId(id);

  return (
    <>
      <ImportBackLink to={paths.membersImport} label="Importer des membres" />
      {importId === undefined ? (
        <ImportNotFound />
      ) : (
        <ImportReport key={importId} id={importId} />
      )}
    </>
  );
}
