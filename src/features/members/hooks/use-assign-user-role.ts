import { useMutation, useQueryClient } from '@tanstack/react-query';

import { authKeys } from '@/features/auth';

import { assignUserRole } from '../api/assign-user-role';
import { memberKeys, userRoleKeys } from '../keys';
import type { AssignUserRoleVariables } from '../types';

export function useAssignUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: AssignUserRoleVariables) =>
      assignUserRole(id, role),
    // L'échec doit s'afficher tout de suite, même hors ligne.
    networkMode: 'always',
    // Liste des rôles et décomptes, fiche du membre (ligne « Rôle ») et
    // utilisateur courant rechargés : un admin qui se retire le rôle perd
    // l'accès à l'écran (le guard le renvoie à l'accueil) et la carte de la
    // barre latérale change.
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: userRoleKeys.all }),
        queryClient.invalidateQueries({ queryKey: memberKeys.all }),
        queryClient.invalidateQueries({ queryKey: authKeys.me() }),
      ]),
  });
}
