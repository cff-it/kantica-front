import { getInitials } from '@/lib/names';
import { cn } from '@/lib/utils';

type InitialsAvatarProps = {
  person: { first_name: string | null; last_name: string | null };
  className?: string;
};

// Pastille d'initiales (« HR »), décorative : le nom est toujours écrit à côté.
// 44 px par défaut (liste mobile) ; `className` règle la taille ailleurs
// (tableau web, fiche membre).
export function InitialsAvatar({ person, className }: InitialsAvatarProps) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex size-11 shrink-0 items-center justify-center rounded-full',
        'bg-muted text-sm font-bold text-muted-foreground ring-1 ring-border',
        className,
      )}
    >
      {getInitials(person)}
    </span>
  );
}
