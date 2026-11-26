import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';

type UsersSearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

// Recherche « Nom ou email » (maquettes 06-Gestion-roles). Le back accepte 100
// caractères au plus (`ListUsersRequest`).
export function UsersSearchField({ value, onChange }: UsersSearchFieldProps) {
  return (
    <div className="relative lg:w-[28rem]">
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Nom ou email"
        aria-label="Rechercher un nom ou un email"
        autoComplete="off"
        maxLength={100}
        className="h-12 rounded-xl border-transparent bg-muted pl-12 text-base md:text-base lg:border-input lg:bg-background dark:bg-muted dark:lg:bg-card"
      />
    </div>
  );
}
