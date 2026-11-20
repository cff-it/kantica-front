import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createMember } from '../api/create-member';
import { memberKeys } from '../keys';

export function useCreateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMember,
    // Même raison que `useUpdateMember` : l'échec (email déjà utilisé, réseau
    // coupé) doit s'afficher tout de suite, même hors ligne.
    networkMode: 'always',
    // La liste et ses effectifs par voix sont rechargés avant de rendre la
    // main : le nouveau membre y figure au retour.
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: memberKeys.all }),
  });
}
