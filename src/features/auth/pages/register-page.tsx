import { Link } from 'react-router';

import { AuthHeading } from '@/components/common/auth-heading';
import { AuthPanel } from '@/components/common/auth-panel';
import { paths } from '@/lib/paths';

import { RegisterForm } from '../components/register-form';
import { StepHeader } from '../components/step-header';

// Inscription, étape 1 sur 2 (maquette 02-Inscription-compte).
export function RegisterPage() {
  return (
    <AuthPanel>
      <StepHeader step={1} total={2} backTo={paths.login} />
      <AuthHeading
        title="Créer votre compte"
        description="Votre email et votre mot de passe vous serviront à vous connecter à Kantica."
      />
      <div className="mt-8 flex flex-1 flex-col lg:flex-none">
        <RegisterForm />
      </div>
      <p className="flex min-h-11 flex-wrap items-center justify-center gap-1.5 pt-6 text-muted-foreground">
        Déjà inscrit ?
        <Link to={paths.login} className="font-semibold text-link">
          Se connecter
        </Link>
      </p>
    </AuthPanel>
  );
}
