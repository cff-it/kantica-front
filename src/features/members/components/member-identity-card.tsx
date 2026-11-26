import { RoleGuard } from '@/components/common/role-guard';
import { getFullName } from '@/lib/names';
import { findRole, getHighestRole } from '@/lib/roles';
import { findVoice } from '@/lib/voices';
import type { User } from '@/types';

import { toDisplayDate } from '../record';
import { getMemberName, hasMemberRecord } from '../utils';
import { ChangeRoleDialog } from './change-role-dialog';
import { ChangeVoiceDialog } from './change-voice-dialog';
import { DetailRow, DetailRows, DetailsCard } from './member-detail-row';

// Valeur affichée quand la voix ou le rôle n'est pas renseigné.
const EMPTY_VALUE = '-';

type MemberIdentityCardProps = {
  member: User;
};

// Bloc « Identité » de la fiche : nom, prénom, naissance et voix, avec le lien
// « Changer » qui ouvre la feuille « Attribuer la voix » (KAN-15), proposé dès
// que la fiche existe, même incomplète (`hasMemberRecord`). Sans fiche, le back
// répondrait 422 : « Modifier » la fait remplir d'abord. Puis le rôle, lisible
// par la secrétaire, modifiable par l'admin. Comme dans le formulaire
// « Modifier la fiche », sauf la voix, qui reste ici (ticket KAN-60) au lieu de
// la carte Chorale.
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
          {hasMemberRecord(member) ? (
            <ChangeVoiceDialog member={member} fullName={getFullName(name)} />
          ) : null}
        </DetailRow>
        {/* Rôle (KAN-63) : visible par la secrétaire, modifiable par l'admin
            seulement (« Changer » masqué sinon, refusé par le back). */}
        <DetailRow label="Rôle">
          {findRole(getHighestRole(member))?.label ?? EMPTY_VALUE}
          <RoleGuard roles={['admin']}>
            <ChangeRoleDialog member={member} fullName={getFullName(name)} />
          </RoleGuard>
        </DetailRow>
      </DetailRows>
    </DetailsCard>
  );
}
