import { Outlet } from 'react-router';

import { BrandMark } from '@/components/common/brand-mark';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { Watermark } from '@/components/common/watermark';
import { useRouteTitle } from '@/hooks/use-route-title';

// Layout des écrans publics (connexion, inscription, compte en attente).
// Mobile : une colonne, chaque écran gère son en-tête ; le filigrane est
// derrière le formulaire, ancré en bas à droite. Grand écran : panneau de
// marque à gauche, avec le filigrane en bas à droite du panneau, et contenu
// centré à droite (maquettes web). Le bouton de thème est en haut à droite,
// car ces écrans n'ont pas accès à Profil.
export function AuthLayout() {
  useRouteTitle();

  return (
    <div className="relative min-h-dvh lg:grid lg:grid-cols-2">
      <ThemeToggle className="absolute top-3 right-3 z-10" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden"
      >
        <Watermark className="absolute -right-[20%] -bottom-[4%] w-[115%]" />
      </div>
      <aside className="relative hidden flex-col items-center justify-center overflow-hidden bg-secondary px-12 text-center lg:flex">
        <Watermark className="absolute -right-[15%] -bottom-[20%] w-[82%]" />
        <div className="relative flex flex-col items-center gap-6">
          <BrandMark size="lg" />
          <p className="max-w-xs text-lg text-muted-foreground">
            Le répertoire, les messes et la vie de la chorale, au même endroit.
          </p>
        </div>
      </aside>
      <main className="relative flex min-h-dvh flex-col lg:justify-center lg:px-12">
        <Outlet />
      </main>
    </div>
  );
}
