import { toast } from 'sonner';

import { getFullName } from '@/lib/names';
import { findRole } from '@/lib/roles';
import type { Role } from '@/types';

import type { UserRoleItem } from '../types';
import { getRoleErrorMessage } from '../utils';
import { useAssignUserRole } from './use-assign-user-role';

// Changement de rôle depuis une ligne, avec ses messages. Un 422 (dernier
// admin, compte administrateur originel) affiche la raison du back : un nouvel
// essai échouerait pareil. `pendingId` : la ligne en cours d'envoi.
export function useRoleChange() {
  const assign = useAssignUserRole();

  const change = (user: UserRoleItem, role: Role) => {
    if (role === user.role || assign.isPending) {
      return;
    }

    assign.mutate(
      { id: user.id, role },
      {
        onSuccess: (updated) => {
          toast.success(
            `${getFullName(updated)} : ${findRole(updated.role)?.label ?? role}.`,
          );
        },
        onError: (error) => {
          toast.error(getRoleErrorMessage(error));
        },
      },
    );
  };

  return {
    change,
    pendingId: assign.isPending ? assign.variables?.id : undefined,
  };
}
