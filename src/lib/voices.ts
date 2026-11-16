import type { Voice } from '@/types';

export type VoiceOption = {
  value: Voice;
  label: string;
  // Pastille claire (fond teinté, lettre foncée) : tuiles et badges.
  tone: string;
  // Pastille pleine (inverse de `tone`) : lettre dans un badge.
  solidTone: string;
};

// Les 4 voix, dans l'ordre des maquettes. Les classes sont écrites en entier
// pour que Tailwind les détecte.
export const VOICES: readonly VoiceOption[] = [
  {
    value: 'S',
    label: 'Soprano',
    tone: 'bg-voice-s text-voice-s-foreground',
    solidTone: 'bg-voice-s-foreground text-voice-s',
  },
  {
    value: 'A',
    label: 'Alto',
    tone: 'bg-voice-a text-voice-a-foreground',
    solidTone: 'bg-voice-a-foreground text-voice-a',
  },
  {
    value: 'T',
    label: 'Ténor',
    tone: 'bg-voice-t text-voice-t-foreground',
    solidTone: 'bg-voice-t-foreground text-voice-t',
  },
  {
    value: 'B',
    label: 'Basse',
    tone: 'bg-voice-b text-voice-b-foreground',
    solidTone: 'bg-voice-b-foreground text-voice-b',
  },
];

// L'API renvoie le groupe de voix sous forme de chaîne (« S », « A »...).
export function findVoice(
  value: string | null | undefined,
): VoiceOption | undefined {
  return VOICES.find((voice) => voice.value === value);
}

export function toVoice(value: string | null | undefined): Voice | undefined {
  return findVoice(value)?.value;
}
