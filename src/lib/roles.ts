import type { Role, User } from '@/types';

export function hasAnyRole(
  user: User | null | undefined,
  roles: readonly Role[],
): boolean {
  const userRoles = user?.roles ?? [];

  return roles.some((role) => userRoles.includes(role));
}

export type RoleOption = {
  role: Role;
  label: string;
  // Badge du rôle (maquettes 06) : Admin bleu nuit plein, Secrétaire bleu
  // clair, Membre gris. Classes écrites en entier pour que Tailwind les voie.
  tone: string;
};

// Du rôle le plus élevé au plus bas, avec le libellé affiché.
export const ROLE_OPTIONS: readonly RoleOption[] = [
  {
    role: 'admin',
    label: 'Admin',
    tone: 'bg-role-admin text-role-admin-foreground',
  },
  {
    role: 'secretaire',
    label: 'Secrétaire',
    tone: 'bg-role-secretary text-role-secretary-foreground',
  },
  {
    role: 'membre',
    label: 'Membre',
    tone: 'bg-role-member text-role-member-foreground',
  },
];

export function findRole(role: Role | null | undefined): RoleOption | undefined {
  return ROLE_OPTIONS.find((option) => option.role === role);
}

// Rôle le plus élevé de l'utilisateur : un compte n'a qu'un rôle depuis
// KAN-35, les anciens comptes à plusieurs rôles affichent le plus élevé.
export function getHighestRole(
  user: User | null | undefined,
): Role | undefined {
  return ROLE_OPTIONS.find(({ role }) => user?.roles?.includes(role))?.role;
}

// Libellé du rôle le plus élevé de l'utilisateur (carte de la barre latérale).
export function getRoleLabel(
  user: User | null | undefined,
): string | undefined {
  return findRole(getHighestRole(user))?.label;
}
