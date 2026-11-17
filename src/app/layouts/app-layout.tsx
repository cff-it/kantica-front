import { NavLink, Outlet } from 'react-router';

import { ThemeToggle } from '@/components/common/theme-toggle';
import { useCurrentUser } from '@/features/auth';
import { useRouteTitle } from '@/hooks/use-route-title';
import { hasAnyRole } from '@/lib/roles';
import { cn } from '@/lib/utils';

import { AppSidebar } from './app-sidebar';
import { NAV_ITEMS } from './nav-items';

// Layout des écrans connectés. Deux mises en page, une seule bascule (`lg`) :
// - sous `lg` (mobile, tablette) : contenu + barre d'onglets en bas (usage
//   mobile prioritaire), bouton de thème en haut à droite ;
// - dès `lg` (web) : barre latérale à gauche (`AppSidebar`, maquettes web),
//   contenu sur fond grisé, bouton de thème dans la barre latérale.
// Les entrées affichées dépendent du rôle. Le réglage de thème ira dans
// l'écran Profil, où la maquette place « Mode sombre ».
export function AppLayout() {
  useRouteTitle();

  const { data: user } = useCurrentUser();
  const items = NAV_ITEMS.filter(
    (item) => !item.roles || hasAnyRole(user, item.roles),
  );

  return (
    <div className="relative min-h-dvh bg-background pb-24 lg:bg-muted/50 lg:pb-0 lg:pl-62">
      <AppSidebar />
      <ThemeToggle className="absolute top-3 right-3 z-30 lg:hidden" />
      <main className="mx-auto w-full max-w-5xl px-4 py-6 lg:max-w-384 lg:px-12 lg:py-10">
        <Outlet />
      </main>

      <nav
        aria-label="Navigation principale"
        className="fixed inset-x-0 bottom-0 z-40 border-t bg-card pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <ul className="mx-auto flex max-w-xl">
          {items.map(({ to, label, icon: Icon }) => (
            <li key={to} className="flex-1">
              <NavLink
                to={to}
                className={({ isActive }) =>
                  cn(
                    'relative flex min-h-14 flex-col items-center',
                    'justify-center gap-1 px-2 text-sm font-semibold',
                    'text-muted-foreground',
                    isActive && 'text-link',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive ? (
                      <span
                        aria-hidden
                        className="absolute inset-x-6 top-0 h-0.5 rounded-b bg-brand-red"
                      />
                    ) : null}
                    <Icon className="size-6" aria-hidden />
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
