import { PageHeader } from './page-header';

// Écran d'un lot ultérieur : réserve la route et l'onglet de navigation sans
// inventer d'interface absente des maquettes livrées pour le lot en cours.
export function ComingSoon({ title }: { title: string }) {
  return (
    <PageHeader
      title={title}
      description="Cet écran sera disponible dans un prochain lot."
    />
  );
}
