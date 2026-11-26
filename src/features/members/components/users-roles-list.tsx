import { useState } from 'react';

import { InitialsAvatar } from '@/components/common/initials-avatar';
import { RoleBadge } from '@/components/common/role-badge';
import { LG_MEDIA_QUERY, useMediaQuery } from '@/hooks/use-media-query';
import { getFullName } from '@/lib/names';
import { cn } from '@/lib/utils';
import type { Role } from '@/types';

import type { UserRoleItem } from '../types';
import { getCallName } from '../utils';
import { RolePicker } from './role-picker';

type UsersRolesListProps = {
  users: UserRoleItem[];
  onChange: (user: UserRoleItem, role: Role) => void;
  // Compte dont le changement de rôle est en cours d'envoi.
  pendingId?: number;
};

// Mise en page mobile (sous `lg`) : une ligne par compte, avec son badge de
// rôle. Toucher une ligne la déplie : « Rôle de {prénom} » et les trois
// boutons. Une seule ligne dépliée à la fois.
function UsersRows({ users, onChange, pendingId }: UsersRolesListProps) {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <ul className="-mx-4 divide-y border-y">
      {users.map((user) => {
        const open = openId === user.id;
        const panelId = `user-role-${user.id}`;
        const callName = getCallName(user);

        return (
          <li key={user.id} className={cn(open && 'bg-secondary/50')}>
            <button
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenId(open ? null : user.id)}
              className="flex w-full items-center gap-4 px-4 py-4 text-left outline-none focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-ring/50"
            >
              <InitialsAvatar person={user} className="size-14 text-lg" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-lg font-semibold">
                  {getFullName(user)}
                </span>
                <span className="block truncate text-muted-foreground">
                  {user.mail}
                </span>
              </span>
              <RoleBadge role={user.role} className="px-4 text-base" />
            </button>
            {open ? (
              <div id={panelId} className="space-y-3 px-4 pb-5">
                <p className="font-semibold">Rôle de {callName}</p>
                <RolePicker
                  layout="buttons"
                  label={`Rôle de ${getFullName(user)}`}
                  value={user.role}
                  onChange={(role) => onChange(user, role)}
                  disabled={pendingId === user.id}
                />
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

// Mise en page web (dès `lg`, maquette web 01-Gestion-roles) : colonnes
// Utilisateur, Email et Rôle ; le rôle se choisit directement dans la ligne.
function UsersTable({ users, onChange, pendingId }: UsersRolesListProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-card">
      <table className="w-full text-left text-base">
        <thead>
          <tr className="border-b text-xs font-bold tracking-wider text-muted-foreground uppercase">
            <th scope="col" className="px-5 py-4">
              Utilisateur
            </th>
            <th scope="col" className="px-5 py-4">
              Email
            </th>
            <th scope="col" className="px-5 py-4">
              Rôle
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="px-5 py-3">
                <div className="flex items-center gap-4">
                  <InitialsAvatar person={user} className="size-11 text-sm" />
                  <span className="font-semibold">{getFullName(user)}</span>
                </div>
              </td>
              <td className="px-5 py-3 whitespace-nowrap">{user.mail}</td>
              <td className="px-5 py-3 text-right">
                <RolePicker
                  layout="segmented"
                  label={`Rôle de ${getFullName(user)}`}
                  value={user.role}
                  onChange={(role) => onChange(user, role)}
                  disabled={pendingId === user.id}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Deux mises en page, une seule montée à la fois (comme la liste des membres).
export function UsersRolesList(props: UsersRolesListProps) {
  const isDesktop = useMediaQuery(LG_MEDIA_QUERY);

  return isDesktop ? <UsersTable {...props} /> : <UsersRows {...props} />;
}
