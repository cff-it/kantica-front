import { Link } from 'react-router';

import { AuthHeading } from '@/components/common/auth-heading';
import { AuthPanel } from '@/components/common/auth-panel';
import { BrandMark } from '@/components/common/brand-mark';
import { paths } from '@/lib/paths';

import { LoginForm } from '../components/login-form';

// Connexion (maquette 01-Connexion). Sur mobile, la marque est en tête de page
// et le lien d'inscription collé en bas ; sur grand écran, la marque est dans
// le panneau de gauche du layout et le lien suit le formulaire.
export function LoginPage() {
  return (
    <AuthPanel>
      <BrandMark className="lg:hidden" />
      <AuthHeading
        title="Bienvenue"
        description="Connectez-vous pour retrouver le répertoire et les messes."
      />
      <div className="mt-8">
        <LoginForm />
      </div>
      <p className="mt-auto flex min-h-11 flex-wrap items-center justify-center gap-1.5 pt-10 text-muted-foreground lg:mt-0 lg:pt-6">
        Pas encore de compte ?
        <Link to={paths.register} className="font-semibold text-link">
          Créer un compte
        </Link>
      </p>
    </AuthPanel>
  );
}
