import { AuthHeading } from '@/components/common/auth-heading';
import { AuthPanel } from '@/components/common/auth-panel';
import { paths } from '@/lib/paths';

import { ProfileForm } from '../components/profile-form';
import { StepHeader } from '../components/step-header';
import { useCurrentUser } from '../hooks/use-current-user';

// Inscription, étape 2 sur 2 (maquette 03-Inscription-fiche-recensement).
// Réutilisée par « Modifier ma fiche » : la flèche de retour n'apparaît alors
// que si la fiche existe déjà (à l'étape 2 initiale, le compte est créé et il
// n'y a pas d'étape 1 à revoir).
export function ProfileFormPage() {
  const { data: user } = useCurrentUser();

  // Le guard garantit un utilisateur connecté ; ce garde-fou satisfait TypeScript.
  if (!user) {
    return null;
  }

  return (
    <AuthPanel size="xl">
      <StepHeader
        step={2}
        total={2}
        backTo={user.profile?.completed ? paths.pendingAccount : undefined}
      />
      <AuthHeading
        title="Votre fiche de choriste"
        description="Ces informations restent au sein de la chorale."
      />
      <div className="mt-8 flex flex-1 flex-col lg:flex-none">
        <ProfileForm user={user} returnTo={paths.pendingAccount} />
      </div>
    </AuthPanel>
  );
}
