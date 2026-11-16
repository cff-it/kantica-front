import { Hourglass } from 'lucide-react';
import { Link } from 'react-router';

import { ActionButton } from '@/components/common/action-button';
import { AuthPanel } from '@/components/common/auth-panel';
import { paths } from '@/lib/paths';

import { MemberSummaryCard } from '../components/member-summary-card';
import { PendingStatusBadge } from '../components/pending-status-badge';
import { useCurrentUser } from '../hooks/use-current-user';
import { useLogout } from '../hooks/use-logout';
import { getGivenName } from '../utils';

// Écran d'attente de validation (maquette 04-Compte-en-attente). Un compte en
// attente y est toujours renvoyé après connexion (voir les guards).
export function PendingAccountPage() {
  const { data: user } = useCurrentUser();
  const logout = useLogout();
  const profile = user?.profile;

  // Le guard garantit un compte en attente avec une fiche enregistrée.
  if (!profile) {
    return null;
  }

  return (
    <AuthPanel
      size="lg"
      className="items-center text-center lg:items-start lg:text-left"
    >
      <span
        aria-hidden
        className="mt-10 flex size-24 items-center justify-center rounded-full bg-secondary text-primary lg:mt-0"
      >
        <Hourglass className="size-10" />
      </span>
      <h1 className="mt-8 text-4xl">Merci, {getGivenName(profile)}&nbsp;!</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Votre fiche est enregistrée. Votre compte sera actif dès sa validation
        par la secrétaire ou un administrateur.{' '}
        <span className="mt-2 block lg:mt-0 lg:inline">
          Vous recevrez un email à cette occasion.
        </span>
      </p>
      <MemberSummaryCard profile={profile} className="mt-8 w-full text-left" />
      <PendingStatusBadge className="mt-4" />
      <div className="mt-auto flex w-full flex-col gap-3 pt-10 lg:mt-8 lg:flex-row lg:items-center lg:pt-0">
        <ActionButton
          asChild
          variant="outline"
          className="border-primary text-link lg:w-auto"
        >
          <Link to={paths.registerProfile}>Modifier ma fiche</Link>
        </ActionButton>
        <ActionButton
          type="button"
          variant="ghost"
          loading={logout.isPending}
          onClick={() => logout.mutate()}
          className="text-muted-foreground lg:w-auto"
        >
          Se déconnecter
        </ActionButton>
      </div>
    </AuthPanel>
  );
}
