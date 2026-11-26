import { ThemeSwitch } from '@/components/common/theme-switch';
import { LogoutButton, useCurrentUser } from '@/features/auth';

import { ProfileIdentityCard } from '../components/profile-identity-card';
import {
  ProfileControlRow,
  ProfileSection,
  ProfileSoonRow,
} from '../components/profile-section';

// « Mon profil » (maquettes 06-Administration-et-navigation/03-Profil). Les
// écrans de présence, d'événements et de paiements n'existent pas encore :
// leurs lignes portent le badge « Bientôt ». « Gestion des rôles », fonction
// d'admin, est dans Membres et non dans Réglages comme sur la maquette.
// « Se déconnecter » : en haut à droite dès `lg`, en bas de l'écran en dessous.
export function ProfilePage() {
  const { data: user } = useCurrentUser();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-4xl lg:text-5xl">Mon profil</h1>
        <div className="hidden lg:block">
          <LogoutButton />
        </div>
      </header>

      <ProfileIdentityCard user={user} />

      <div className="grid gap-6 lg:grid-cols-3 lg:items-start lg:gap-8">
        <ProfileSection title="Présence">
          <ProfileSoonRow label="Mon historique de présence" />
          <ProfileSoonRow label="Saisir les présences" />
        </ProfileSection>
        <ProfileSection title="Vie de la chorale">
          <ProfileSoonRow label="Événements" />
          <ProfileSoonRow
            label="Paiements"
            description="Cotisations et reste à payer"
          />
        </ProfileSection>
        <ProfileSection title="Réglages">
          <ProfileControlRow label="Mode sombre" labelId="profile-dark-mode">
            <ThemeSwitch labelId="profile-dark-mode" />
          </ProfileControlRow>
        </ProfileSection>
      </div>

      <div className="lg:hidden">
        <LogoutButton />
      </div>
    </div>
  );
}
