import { PageHeader } from '@/components/common/page-header';
import { paths } from '@/lib/paths';

import { ImportBackLink } from '../components/import-back-link';
import { ImportHistory } from '../components/import-history';
import { ImportMembersForm } from '../components/import-members-form';

// Importer des membres (secrétaire, admin), maquette 08-Import-membres-Excel :
// les deux étapes (modèle, fichier), puis l'historique des imports. Le bas de
// page garde du vide sous `lg` pour la barre d'actions fixe.
export function ImportMembersPage() {
  return (
    <div className="pb-24 lg:pb-0">
      <ImportBackLink to={paths.members} label="Membres" />
      <PageHeader
        title="Importer des membres"
        description="Ajoutez plusieurs choristes d'un coup à partir d'un fichier Excel."
      />
      <ImportMembersForm />
      <ImportHistory />
    </div>
  );
}
