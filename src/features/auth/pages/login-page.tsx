import { AuthPanel } from '@/components/common/auth-panel';
import { BrandMark } from '@/components/common/brand-mark';
import { PageHeader } from '@/components/common/page-header';

// Page de connexion : le formulaire (maquette 01-Connexion) est assemblé à
// l'étape 2 du lot 1, avec les composants shadcn Input, Button et Label. Sur
// mobile, la marque est en tête de page ; sur grand écran, elle est dans le
// panneau de gauche du layout.
export function LoginPage() {
  return (
    <AuthPanel>
      <BrandMark className="pb-10 lg:hidden" />
      <PageHeader
        title="Bienvenue"
        description="Connectez-vous pour retrouver le répertoire et les messes."
      />
    </AuthPanel>
  );
}
