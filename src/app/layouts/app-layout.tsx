import { NavLink, Outlet } from 'react-router';

import { ThemeToggle } from '@/components/common/theme-toggle';
import { useCurrentUser } from '@/features/auth';
import { hasAnyRole } from '@/lib/roles';
import { cn } from '@/lib/utils';

import { NAV_ITEMS } from './nav-items';

// Layout des écrans connectés : contenu + barre d'onglets en bas (usage mobile
// prioritaire). Les onglets affichés dépendent du rôle. Le bouton de thème est
// en haut à droite en attendant l'écran Profil, où la maquette place le
// réglage « Mode sombre ».
export function AppLayout() {
  const { data: user } = useCurrentUser();
  const items = NAV_ITEMS.filter(
    (item) => !item.roles || hasAnyRole(user, item.roles),
  );

  return (
    <div className="relative min-h-dvh bg-background pb-24">
      <ThemeToggle className="absolute top-3 right-3 z-30" />
      <main className="mx-auto w-full max-w-5xl px-4 py-6 md:px-6">
        <Outlet />
      </main>

      <nav
        aria-label="Navigation principale"
        className="fixed inset-x-0 bottom-0 z-40 border-t bg-card pb-[env(safe-area-inset-bottom)]"
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
