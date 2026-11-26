import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authKeys } from '@/features/auth';

import { assignMemberVoice } from '../api/assign-member-voice';
import { memberKeys } from '../keys';
import type { AssignMemberVoiceVariables } from '../types';

export function useAssignMemberVoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, voice }: AssignMemberVoiceVariables) =>
      assignMemberVoice(id, voice),
    // Même raison que `useValidateMember` : l'échec doit s'afficher tout de
    // suite, même hors ligne.
    networkMode: 'always',
    // Fiche, liste (badge et effectifs par voix) et utilisateur courant (un
    // admin peut changer sa propre voix : la carte de la barre latérale la lit)
    // rechargés avant de rendre la main.
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: memberKeys.all }),
        queryClient.invalidateQueries({ queryKey: authKeys.me() }),
      ]),
  });
}
