import { cn } from '@/lib/utils';
import { findVoice } from '@/lib/voices';

type VoiceProps = {
  // Groupe de voix tel que renvoyé par l'API (« S », « A », « T », « B »).
  voice: string | null | undefined;
  className?: string;
};

// Pastille ronde avec la lettre de la voix (tuiles de choix).
export function VoiceDot({ voice, className }: VoiceProps) {
  const option = findVoice(voice);

  if (!option) {
    return null;
  }

  return (
    <span
      aria-hidden
      className={cn(
        'flex size-9 shrink-0 items-center justify-center rounded-full',
        'text-base font-bold',
        option.tone,
        className,
      )}
    >
      {option.value}
    </span>
  );
}

// Badge « lettre + nom de la voix » (fiche du choriste, liste des membres).
export function VoiceBadge({ voice, className }: VoiceProps) {
  const option = findVoice(voice);

  if (!option) {
    return null;
  }

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center gap-2 rounded-full py-1 pr-3 pl-1',
        'text-sm font-semibold',
        option.tone,
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'flex size-6 items-center justify-center rounded-full',
          'text-xs font-bold',
          option.solidTone,
        )}
      >
        {option.value}
      </span>
      {option.label}
    </span>
  );
}
