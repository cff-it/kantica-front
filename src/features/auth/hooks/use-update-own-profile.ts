import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateOwnProfile } from '../api/update-own-profile';
import { authKeys } from '../keys';

export function useUpdateOwnProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOwnProfile,
    // La fiche fait partie de l'utilisateur courant (`profile`) : on la
    // recharge avant de rendre la main, pour que les guards voient
    // `completed: true` dès la navigation suivante.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: authKeys.me() }),
  });
}
