import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type SearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  // Nom accessible du champ : le texte d'aide disparaît à la saisie.
  label: string;
  // Largeur dès `lg` (pleine largeur en dessous) et marges.
  className?: string;
};

// Recherche des listes (membres, gestion des rôles, répertoire) : loupe à
// gauche, fond gris sans bordure sous `lg`, fond blanc bordé dès `lg` (la page
// est sur fond grisé). Les listes du back acceptent 100 caractères au plus
// (`ListMembersRequest`, `ListUsersRequest`, `ListSongsRequest`).
export function SearchField({
  value,
  onChange,
  placeholder,
  label,
  className,
}: SearchFieldProps) {
  return (
    <div className={cn('relative', className)}>
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={label}
        autoComplete="off"
        maxLength={100}
        className="h-12 rounded-xl border-transparent bg-muted pl-12 text-base md:text-base lg:border-input lg:bg-background dark:bg-muted dark:lg:bg-card"
      />
    </div>
  );
}
