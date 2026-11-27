import { findRole } from '@/lib/roles';
import { cn } from '@/lib/utils';
import type { Role } from '@/types';

type RoleBadgeProps = {
  role: Role | null | undefined;
  className?: string;
};

// Badge du rôle (maquettes 06 : Profil, Gestion des rôles) : Admin bleu nuit
// plein, Secrétaire bleu clair, Membre gris. Rien sans rôle.
export function RoleBadge({ role, className }: RoleBadgeProps) {
  const option = findRole(role);

  if (!option) {
    return null;
  }

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full px-3 py-1',
        'text-base font-semibold',
        option.tone,
        className,
      )}
    >
      {option.label}
    </span>
  );
}
