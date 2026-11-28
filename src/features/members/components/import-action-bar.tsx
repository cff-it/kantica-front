import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type ImportActionBarProps = {
  // Texte d'aide à gauche des boutons, sur le web seulement (maquette web 09).
  note?: string | null;
  // Bouton secondaire d'abord, bouton principal ensuite.
  children: ReactNode;
};

// Boutons d'action des écrans d'import. Deux mises en page, une seule bascule
// (`lg`) :
// - mobile : barre fixe au-dessus de la barre d'onglets, bouton principal en
//   haut et bouton secondaire dessous (maquettes mobile 08 et 09) ;
// - web : rangée alignée à droite, bouton principal à l'extrême droite.
// La page qui l'utilise garde du vide en bas (`pb-*`) pour que la barre fixe ne
// cache pas la fin du contenu.
export function ImportActionBar({ note, children }: ImportActionBarProps) {
  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-(--tabbar-height) z-30',
        'border-t bg-background px-4 py-3',
        'lg:static lg:z-auto lg:border-0 lg:bg-transparent lg:p-0',
      )}
    >
      <div className="mx-auto flex max-w-5xl flex-col-reverse gap-2 lg:max-w-none lg:flex-row lg:items-center lg:justify-end lg:gap-4">
        {note ? (
          <p className="hidden max-w-xl text-muted-foreground lg:mr-auto lg:block">
            {note}
          </p>
        ) : null}
        {children}
      </div>
    </div>
  );
}
