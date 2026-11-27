import { useTheme } from 'next-themes';

import { cn } from '@/lib/utils';

type ThemeSwitchProps = {
  // Identifiant du libellé « Mode sombre » écrit à côté (nom accessible).
  labelId: string;
  className?: string;
};

// Interrupteur « Mode sombre » de l'écran Profil (maquette 06-Profil). Même
// réglage que `ThemeToggle` (next-themes, clé `kantica-theme`). Un vrai bouton
// `role="switch"`, sans dépendance : zone tactile de 44 px, piste de 48 x 28.
export function ThemeSwitch({ labelId, className }: ThemeSwitchProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-labelledby={labelId}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'flex size-11 w-14 shrink-0 items-center justify-center rounded-full',
        'outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          'flex h-7 w-12 items-center rounded-full p-0.5 transition-colors',
          isDark ? 'bg-primary' : 'bg-input',
        )}
      >
        <span
          className={cn(
            'size-6 rounded-full bg-background shadow-sm transition-transform',
            isDark && 'translate-x-5',
          )}
        />
      </span>
    </button>
  );
}
