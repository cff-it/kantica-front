import { useId } from 'react';

import { VoiceDot } from '@/components/common/voice-badge';
import { cn } from '@/lib/utils';
import { VOICES } from '@/lib/voices';
import type { Voice } from '@/types';

type VoicePickerProps = {
  name: string;
  value: Voice | undefined;
  onChange: (value: Voice) => void;
  onBlur?: () => void;
  error?: string;
};

// Choix de la voix en 4 tuiles (S, A, T, B). Boutons radio natifs masqués
// visuellement : clavier et lecteurs d'écran fonctionnent sans code en plus.
export function VoicePicker({
  name,
  value,
  onChange,
  onBlur,
  error,
}: VoicePickerProps) {
  const errorId = useId();

  return (
    <fieldset
      aria-describedby={error ? errorId : undefined}
      className="min-w-0 space-y-2"
    >
      <legend className="mb-2 text-base font-semibold">Voix</legend>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-2">
        {VOICES.map((voice) => (
          <label
            key={voice.value}
            className={cn(
              'flex min-h-14 cursor-pointer items-center gap-3 rounded-xl',
              'border bg-background px-3 transition-colors hover:bg-muted',
              'has-checked:border-primary has-checked:bg-secondary',
              'has-checked:ring-1 has-checked:ring-primary',
              'has-focus-visible:ring-3 has-focus-visible:ring-ring/50',
            )}
          >
            <input
              type="radio"
              name={name}
              value={voice.value}
              checked={value === voice.value}
              onChange={() => onChange(voice.value)}
              onBlur={onBlur}
              className="sr-only"
            />
            <VoiceDot voice={voice.value} />
            <span className="font-semibold">{voice.label}</span>
          </label>
        ))}
      </div>
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
