import { ROLE_OPTIONS } from '@/lib/roles';
import { cn } from '@/lib/utils';
import type { Role } from '@/types';

type RolePickerProps = {
  value: Role | null;
  onChange: (role: Role) => void;
  // Nom accessible du groupe : « Rôle de Mialy ».
  label: string;
  disabled?: boolean;
  // `segmented` : contrôle segmenté du tableau web ; `buttons` : trois boutons
  // côte à côte sous une ligne dépliée (mobile).
  layout: 'segmented' | 'buttons';
};

// Choix du rôle d'un compte (maquettes 06-Gestion-roles) : un seul rôle, le
// rôle actif est mis en avant. Boutons `aria-pressed` dans un groupe nommé.
export function RolePicker({
  value,
  onChange,
  label,
  disabled,
  layout,
}: RolePickerProps) {
  const segmented = layout === 'segmented';

  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        segmented
          ? 'inline-flex rounded-xl bg-muted p-1'
          : 'grid grid-cols-3 gap-3',
      )}
    >
      {ROLE_OPTIONS.map(({ role, label: roleLabel }) => {
        const active = value === role;

        return (
          <button
            key={role}
            type="button"
            aria-pressed={active}
            disabled={disabled}
            onClick={() => onChange(role)}
            className={cn(
              'font-semibold outline-none transition-colors',
              'focus-visible:ring-3 focus-visible:ring-ring/50',
              'disabled:cursor-not-allowed disabled:opacity-60',
              segmented
                ? 'h-11 rounded-lg px-4 text-base text-muted-foreground hover:text-foreground'
                : 'h-14 rounded-xl border bg-card text-lg',
              segmented && active && 'bg-card text-link shadow-sm hover:text-link',
              !segmented && active && 'border-2 border-primary text-link',
            )}
          >
            {roleLabel}
          </button>
        );
      })}
    </div>
  );
}
