import { paths } from '@/lib/paths';

import { ImportBackLink } from '../components/import-back-link';
import { ImportReview } from '../components/import-review';

// Vérification du fichier (secrétaire, admin), maquette 09-Import-membres-
// verification. Le bas de page garde du vide sous `lg` pour la barre d'actions
// fixe (deux boutons).
export function ImportReviewPage() {
  return (
    <div className="pb-36 lg:pb-0">
      <ImportBackLink to={paths.membersImport} label="Importer des membres" />
      <ImportReview />
    </div>
  );
}
