import { ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router';

import { AuthHeading } from '@/components/common/auth-heading';
import { AuthPanel } from '@/components/common/auth-panel';
import { paths } from '@/lib/paths';

import { ProfileForm } from '../components/profile-form';
import { useCurrentUser } from '../hooks/use-current-user';

// L'écran d'origine (`state.from`, posé par le lien d'entrée) : on y revient
// après l'enregistrement. Sans lui (adresse saisie à la main), retour au Profil.
function getReturnPath(state: unknown): string {
  const from = (state as { from?: unknown } | null)?.from;

  return typeof from === 'string' && from.startsWith('/') ? from : paths.profile;
}

// « Modifier ma fiche » d'un compte actif : même formulaire que l'étape 2 de
// l'inscription (maquette 03-Inscription-fiche-recensement), sans le suivi
// d'étapes. La voix y est en lecture seule tant que le compte n'a pas le droit
// de la modifier (voir `canUpdateOwnVoice`). L'entrée dans cet écran n'est pas
// encore définie : aucune maquette ne place « Ma fiche » dans le Profil.
export function EditProfilePage() {
  const { data: user } = useCurrentUser();
  const location = useLocation();
  const returnTo = getReturnPath(location.state);

  // Le guard garantit un utilisateur connecté ; ce garde-fou satisfait TypeScript.
  if (!user) {
    return null;
  }

  return (
    <AuthPanel size="xl">
      <Link
        to={returnTo}
        aria-label="Retour"
        className="-ml-3 flex size-11 items-center justify-center rounded-full"
      >
        <ArrowLeft aria-hidden className="size-6" />
      </Link>
      <AuthHeading
        title="Votre fiche de choriste"
        description="Ces informations restent au sein de la chorale."
      />
      <div className="mt-8 flex flex-1 flex-col lg:flex-none">
        <ProfileForm user={user} returnTo={returnTo} />
      </div>
    </AuthPanel>
  );
}
