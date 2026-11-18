import { useId } from 'react';

import { formatPhones } from '@/lib/phone';
import type { MemberSacrament, User } from '@/types';

import { toDisplayDate } from '../record';
import { DetailRow, DetailRows, DetailsCard } from './member-detail-row';

// Cartes de la fiche, en lecture seule : mêmes sections et mêmes champs que le
// formulaire « Modifier la fiche » (`member-record-sections.tsx`). Les dates de
// l'API (1998-03-12, 1998-05, 2008) s'affichent comme dans le formulaire
// (12/03/1998, 05/1998, 2008). Identité et Contacts sont dans leurs propres
// fichiers : la voix y garde son lien « Changer ».

type CardProps = {
  member: User;
};

export function ChoirDetailsCard({ member }: CardProps) {
  const profile = member.profile;

  return (
    <DetailsCard title="Chorale">
      <DetailRows>
        <DetailRow
          label="Date d'adhésion"
          value={toDisplayDate(profile?.adhesion_date)}
        />
        <DetailRow
          label="Date d'engagement"
          value={toDisplayDate(profile?.engagement_date)}
        />
        <DetailRow
          label="Lieu de l'engagement"
          value={profile?.engagement_place}
        />
      </DetailRows>
    </DetailsCard>
  );
}

type SacramentRowsProps = {
  title: string;
  sacrament: MemberSacrament | undefined;
};

// Un sacrement : titre en police de titre, date et lieu, comme dans le
// formulaire. Le groupe est nommé par son titre.
function SacramentRows({ title, sacrament }: SacramentRowsProps) {
  const titleId = useId();

  return (
    <div role="group" aria-labelledby={titleId}>
      <h3 id={titleId} className="px-5 pt-4 pb-1 text-xl">
        {title}
      </h3>
      <DetailRows>
        <DetailRow label="Date" value={toDisplayDate(sacrament?.date)} />
        <DetailRow label="Lieu" value={sacrament?.place} />
      </DetailRows>
    </div>
  );
}

export function ParishDetailsCard({ member }: CardProps) {
  const profile = member.profile;

  return (
    <DetailsCard title="Paroisse et sacrements">
      <DetailRows>
        <DetailRow
          label="N° Matricule et Quartier"
          value={profile?.region_registration_number}
        />
      </DetailRows>
      <SacramentRows title="Baptême" sacrament={profile?.baptism} />
      <SacramentRows
        title="Première Communion"
        sacrament={profile?.first_communion}
      />
      <SacramentRows title="Confirmation" sacrament={profile?.confirmation} />
    </DetailsCard>
  );
}

export function MarriageDetailsCard({ member }: CardProps) {
  const marriage = member.profile?.marriage;

  return (
    <DetailsCard title="Mariage">
      <DetailRows>
        <DetailRow label="Marié(e) à" value={marriage?.spouse} />
        <DetailRow
          label="Date du mariage"
          value={toDisplayDate(marriage?.date)}
        />
        <DetailRow label="Lieu du mariage" value={marriage?.place} />
      </DetailRows>
    </DetailsCard>
  );
}

export function EmergencyDetailsCard({ member }: CardProps) {
  const contact = member.profile?.emergency_contact;

  return (
    <DetailsCard title="Contact en cas d'urgence">
      <DetailRows>
        <DetailRow
          label="À contacter"
          value={contact?.relationships.join(', ')}
        />
        <DetailRow label="Nom" value={contact?.name} />
        <DetailRow label="Téléphone" value={formatPhones(contact?.phone)} />
      </DetailRows>
    </DetailsCard>
  );
}
