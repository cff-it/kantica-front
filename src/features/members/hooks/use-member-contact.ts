import { useQuery } from '@tanstack/react-query';

import { getMember } from '../api/get-member';
import { memberKeys } from '../keys';

// Coordonnées d'un membre pour les colonnes Téléphone et Email du tableau web.
// La liste du back ne les renvoie pas (`MemberListItemResource`) : on les lit
// dans la fiche, qui a la même clé de cache que la future fiche membre. Une
// requête par ligne affichée, d'où le `staleTime` : revenir sur une page déjà
// vue ne relance rien.
export function useMemberContact(id: number) {
  return useQuery({
    queryKey: memberKeys.detail(id),
    queryFn: () => getMember(id),
    staleTime: 5 * 60 * 1000,
    select: (member) => ({
      phone: member.profile?.phone ?? null,
      mail: member.profile?.contact_mail ?? member.mail,
    }),
  });
}
