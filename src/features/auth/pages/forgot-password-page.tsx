import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

import { AuthPanel } from '@/components/common/auth-panel';
import { ComingSoon } from '@/components/common/coming-soon';
import { paths } from '@/lib/paths';

// « Mot de passe oublié ? » figure sur la maquette de connexion, mais le back
// n'expose encore aucune route de réinitialisation et aucune maquette de cet
// écran n'existe : on réserve la route sans inventer d'interface.
export function ForgotPasswordPage() {
  return (
    <AuthPanel>
      <div className="pt-10 lg:pt-0">
        <ComingSoon title="Mot de passe oublié" />
      </div>
      <Link
        to={paths.login}
        className="inline-flex min-h-11 items-center gap-2 font-semibold text-link"
      >
        <ArrowLeft aria-hidden className="size-5" />
        Retour à la connexion
      </Link>
    </AuthPanel>
  );
}
