import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authKeys } from '@/features/auth';

import { updateMember } from '../api/update-member';
import { memberKeys } from '../keys';
import type { UpdateMemberVariables } from '../types';

export function useUpdateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: UpdateMemberVariables) =>
      updateMember(id, input),
    // Même raison que `useValidateMember` : l'échec doit s'afficher tout de
    // suite, même hors ligne.
    networkMode: 'always',
    // Fiche et liste rechargées avant de rendre la main. Un admin peut aussi
    // modifier sa propre fiche ici : la carte de la barre latérale (rôle et
    // voix) lit l'utilisateur courant, rechargé lui aussi.
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: memberKeys.all }),
        queryClient.invalidateQueries({ queryKey: authKeys.me() }),
      ]),
  });
}
