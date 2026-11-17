import { useCallback, useSyncExternalStore } from 'react';

// Breakpoint `lg` de Tailwind : le point de bascule entre la mise en page
// mobile et la mise en page web (voir `AppLayout`).
export const LG_MEDIA_QUERY = '(min-width: 1024px)';

// Suit une media query CSS. Sert à ne monter que la mise en page affichée
// (et donc à ne charger que les données qu'elle montre), là où `hidden lg:block`
// monterait les deux.
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);

      list.addEventListener('change', onChange);

      return () => list.removeEventListener('change', onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
