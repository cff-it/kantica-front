import { getFullName } from '@/lib/names';
import { findVoice } from '@/lib/voices';
import type { User } from '@/types';

import { toDisplayDate } from '../record';
import { getMemberName } from '../utils';
import { ChangeVoiceDialog } from './change-voice-dialog';
import { DetailRow, DetailRows, DetailsCard } from './member-detail-row';

// Valeur affichée quand la voix n'est pas renseignée.
const EMPTY_VALUE = '-';

type MemberIdentityCardProps = {
  member: User;
};

// Bloc « Identité » de la fiche : nom, prénom, naissance et voix, avec le lien
// « Changer » qui ouvre la feuille « Attribuer la voix » (KAN-15), proposé dès
// que la fiche existe, même incomplète. Attention : `profile.completed` ne veut
// pas dire « fiche complète » mais « fiche enregistrée » (MemberProfileResource
// du back : `profile !== null`), c'est exactement la règle de
// `PUT /members/{id}/voice`. Sans fiche, le back répondrait 422 : « Modifier »
// la fait remplir d'abord. `member.profile` lui-même est toujours présent dans
// la réponse de la fiche, il ne suffit donc pas à tester l'existence. Comme dans le
// formulaire « Modifier la fiche », sauf la voix, qui reste ici (ticket KAN-60)
// au lieu de la carte Chorale.
export function MemberIdentityCard({ member }: MemberIdentityCardProps) {
  const profile = member.profile;
  const name = getMemberName(member);
  const voiceLabel = findVoice(profile?.voice_group)?.label;

  return (
    <DetailsCard title="Identité">
      <DetailRows>
        <DetailRow label="Nom" value={name.last_name} />
        <DetailRow label="Prénom" value={name.first_name} />
        <DetailRow
          label="Date de naissance"
          value={toDisplayDate(profile?.birth_date)}
        />
        <DetailRow label="Lieu de naissance" value={profile?.birth_place} />
        <DetailRow label="Voix">
          {voiceLabel ?? EMPTY_VALUE}
          {profile?.completed ? (
            <ChangeVoiceDialog member={member} fullName={getFullName(name)} />
          ) : null}
        </DetailRow>
      </DetailRows>
    </DetailsCard>
  );
}
