import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import { VOICES } from '@/lib/voices';
import type { Voice } from '@/types';

import type { VoiceCount } from '../types';

type FilterChipProps = {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
};

function FilterChip({ active, onClick, children }: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'inline-flex h-11 shrink-0 items-center rounded-full border px-5',
        'text-base font-semibold transition-colors outline-none',
        'focus-visible:ring-3 focus-visible:ring-ring/50',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'bg-background hover:bg-muted',
      )}
    >
      {children}
    </button>
  );
}

type VoiceFilterProps = {
  value: Voice | undefined;
  onChange: (value: Voice | undefined) => void;
  // Effectif par groupe de voix (`meta.voice_counts`), absent tant que la liste
  // n'est pas chargée.
  counts: VoiceCount[] | undefined;
};

// Pastilles « Tous · Soprano · 3 · Alto · 2... » (maquette 05-Liste-membres).
// Sur mobile elles défilent à l'horizontale, jusqu'au bord de l'écran.
export function VoiceFilter({ value, onChange, counts }: VoiceFilterProps) {
  return (
    <div
      role="group"
      aria-label="Filtrer par voix"
      className="-mx-4 flex [scrollbar-width:none] gap-2 overflow-x-auto px-4 py-1 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
    >
      <FilterChip active={value === undefined} onClick={() => onChange(undefined)}>
        Tous
      </FilterChip>
      {VOICES.map((voice) => {
        const count = counts?.find(
          (group) => group.voice_group === voice.value,
        )?.count;

        return (
          <FilterChip
            key={voice.value}
            active={value === voice.value}
            onClick={() => onChange(voice.value)}
          >
            {count === undefined ? voice.label : `${voice.label} · ${count}`}
          </FilterChip>
        );
      })}
    </div>
  );
}
