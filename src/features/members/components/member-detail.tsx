import { VoiceBadge } from '@/components/common/voice-badge';
import { getFullName } from '@/lib/names';
import type { User } from '@/types';

import { getMemberName } from '../utils';
import { MemberAvatar } from './member-avatar';
import { MemberContactsCard } from './member-contacts-card';
import { MemberDetailHeader } from './member-detail-header';
import { MemberIdentityCard } from './member-identity-card';
import {
  ChoirDetailsCard,
  EmergencyDetailsCard,
  MarriageDetailsCard,
  ParishDetailsCard,
} from './member-record-details';
import { PendingValidationBanner } from './pending-validation-banner';

type MemberDetailProps = {
  member: User;
};

// Fiche d'un membre (maquettes mobile et web 06-Fiche-membre). Une seule
// arborescence, deux mises en page (bascule `lg`) : sous `lg`, avatar, nom et
// voix centrés, blocs empilés ; dès `lg`, avatar et voix en ligne sous le titre
// de l'en-tête, Identité et Contacts côte à côte. Le nom est écrit deux fois
// (titre de l'en-tête web, titre sous l'avatar mobile) : un seul est affiché.
export function MemberDetail({ member }: MemberDetailProps) {
  const name = getMemberName(member);
  const fullName = getFullName(name);

  return (
    <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-none">
      <MemberDetailHeader memberId={member.id} fullName={fullName} />
      <div className="mt-6 flex flex-col items-center gap-3 lg:mt-6 lg:flex-row lg:gap-5">
        <MemberAvatar
          member={name}
          className="size-20 text-2xl lg:size-25 lg:text-3xl"
        />
        <h1 className="text-3xl lg:hidden">{fullName}</h1>
        <VoiceBadge voice={member.profile?.voice_group} />
      </div>
      {member.status === 'pending' ? (
        <PendingValidationBanner memberId={member.id} />
      ) : null}
      <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-2 lg:items-start lg:gap-8">
        <div className="flex flex-col gap-6 lg:gap-8">
          <MemberIdentityCard member={member} />
          <MemberContactsCard member={member} />
          <ChoirDetailsCard member={member} />
        </div>
        <div className="flex flex-col gap-6 lg:gap-8">
          <ParishDetailsCard member={member} />
          <MarriageDetailsCard member={member} />
          <EmergencyDetailsCard member={member} />
        </div>
      </div>
    </div>
  );
}
