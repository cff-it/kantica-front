import { InitialsAvatar } from '@/components/common/initials-avatar';
import { RoleBadge } from '@/components/common/role-badge';
import { VoiceBadge } from '@/components/common/voice-badge';
import { getFullName } from '@/lib/names';
import { formatPhones } from '@/lib/phone';
import { getHighestRole } from '@/lib/roles';
import type { User } from '@/types';

type ProfileIdentityCardProps = {
  user: User;
};

// Carte du haut de « Mon profil » (maquettes 06-Profil) : initiales, nom, voix
// et rôle ; dès `lg`, l'email et le téléphone à droite. Le nom vient de la
// fiche quand elle existe, sinon du compte (comme la carte de la barre
// latérale).
export function ProfileIdentityCard({ user }: ProfileIdentityCardProps) {
  const person = {
    first_name:
      user.profile?.first_name ?? user.firstnames?.[0]?.first_name ?? null,
    last_name: user.profile?.last_name ?? user.last_name,
  };
  const contacts = [user.mail, formatPhones(user.profile?.phone, ' / ')]
    .filter(Boolean)
    .join(' · ');

  return (
    <section
      aria-label="Mon identité"
      className="flex items-center gap-5 rounded-2xl border bg-card p-5 lg:gap-6 lg:p-8"
    >
      <InitialsAvatar
        person={person}
        className="size-16 text-xl lg:size-25 lg:text-3xl"
      />
      <div className="min-w-0 flex-1 space-y-2">
        <p className="font-heading text-2xl leading-tight font-semibold lg:text-4xl">
          {getFullName(person)}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <VoiceBadge voice={user.profile?.voice_group} />
          <RoleBadge role={getHighestRole(user)} />
        </div>
      </div>
      <p className="hidden text-right text-muted-foreground lg:block">
        {contacts}
      </p>
    </section>
  );
}
