import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ThemeToggleProps = {
  className?: string;
};

// Bascule entre les thèmes clair et sombre. L'icône montre l'action possible
// (lune en clair, soleil en sombre) : les deux sont dans le DOM et la variante
// `dark:` de Tailwind choisit celle à afficher. `resolvedTheme` est indéfini au
// premier rendu, tant que le thème du système n'est pas lu : l'icône n'en
// dépend donc pas, ce qui évite un scintillement. Le choix est mémorisé par
// next-themes (clé `kantica-theme`) ; sans choix, le thème suit le système.
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn('size-11 rounded-full', className)}
    >
      <Moon className="size-5 dark:hidden" aria-hidden />
      <Sun className="hidden size-5 dark:block" aria-hidden />
    </Button>
  );
}
