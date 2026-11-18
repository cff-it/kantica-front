import type { User } from '@/types';

import { MemberProfileForm } from './member-profile-form';

type MemberEditProps = {
  member: User;
};

// Écran « Modifier la fiche » d'un membre : l'en-tête (retour, titre,
// enregistrement) est dans le formulaire, dont il porte les boutons.
export function MemberEdit({ member }: MemberEditProps) {
  return (
    <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-none">
      <MemberProfileForm member={member} />
    </div>
  );
}
