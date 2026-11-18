import { ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router';

import logo from '@/assets/brand/logo-cff.png';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { useCurrentUser } from '@/features/auth';
import { getFullName, getInitials } from '@/lib/names';
import { paths } from '@/lib/paths';
import { getRoleLabel, hasAnyRole } from '@/lib/roles';
import { cn } from '@/lib/utils';
import { findVoice } from '@/lib/voices';

import { NAV_ITEMS } from './nav-items';

// Barre latérale du grand écran (dès `lg`), maquettes web : marque en haut,
// entrées de navigation selon le rôle, carte de l'utilisateur en bas qui ouvre
// le profil. Le bouton de thème est une languette flottante collée au bord
// gauche de l'écran (`ThemeHandle`). Sous `lg`, c'est la barre d'onglets du
// bas qui la remplace (voir `AppLayout`) : la largeur `w-62` est répétée dans
// le layout.
export function AppSidebar() {
  const { data: user } = useCurrentUser();
  const items = NAV_ITEMS.filter(
    (item) =>
      item.sidebar !== false && (!item.roles || hasAnyRole(user, item.roles)),
  );
  const person = user && {
    first_name:
      user.profile?.first_name ?? user.firstnames?.[0]?.first_name ?? null,
    last_name: user.profile?.last_name ?? user.last_name,
  };
  const subtitle = [
    getRoleLabel(user),
    findVoice(user?.profile?.voice_group)?.label,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-62 flex-col border-r bg-card lg:flex">
      <div className="flex items-center gap-3 px-5 pt-8 pb-6">
        <img
          src={logo}
          alt=""
          width={543}
          height={487}
          className="h-auto w-11 shrink-0"
        />
        <div className="min-w-0">
          <p className="font-heading text-2xl leading-none font-semibold">
            Kantica
          </p>
          <p className="mt-1 text-xs leading-tight text-muted-foreground">
            Chorale Francophone Faravohitra
          </p>
        </div>
      </div>

      <nav aria-label="Navigation principale" className="flex-1 px-4">
        <ul className="space-y-2">
          {items.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  cn(
                    'relative flex min-h-12 items-center gap-3 rounded-xl px-4',
                    'text-base font-semibold text-muted-foreground',
                    'transition-colors hover:bg-muted',
                    'outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                    isActive && 'bg-secondary text-link hover:bg-secondary',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive ? (
                      <span
                        aria-hidden
                        className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-brand-red"
                      />
                    ) : null}
                    <Icon className="size-6 shrink-0" aria-hidden />
                    {label}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4">
        {person ? (
          <NavLink
            to={paths.profile}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-2xl border p-3',
                'transition-colors hover:bg-muted',
                'outline-none focus-visible:ring-3 focus-visible:ring-ring/50',
                isActive && 'bg-secondary hover:bg-secondary',
              )
            }
          >
            <span
              aria-hidden
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground ring-1 ring-border"
            >
              {getInitials(person)}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-semibold">
                {getFullName(person)}
              </span>
              <span className="block truncate text-sm text-muted-foreground">
                {subtitle}
              </span>
            </span>
          </NavLink>
        ) : null}
      </div>

      <ThemeHandle />
    </aside>
  );
}

// Languette flottante collée au bord gauche de l'écran, juste au-dessus de la
// carte de l'utilisateur : seule la flèche est visible au repos ; au survol ou
// au focus clavier (`focus-within`), elle s'élargit vers la droite et révèle
// le bouton de thème. Le bouton reste dans le DOM, donc atteignable au clavier
// même replié.
function ThemeHandle() {
  return (
    <div
      className={cn(
        'group absolute bottom-24 left-0 z-10 flex h-11 w-5 items-center',
        'overflow-hidden rounded-r-full border border-l-0 bg-card shadow-sm',
        'transition-[width] duration-200 ease-out motion-reduce:transition-none',
        'hover:w-16 focus-within:w-16',
      )}
    >
      <span className="flex w-5 shrink-0 items-center justify-center">
        <ChevronRight
          className={cn(
            'size-4 text-muted-foreground transition-transform duration-200',
            'group-hover:rotate-180 group-focus-within:rotate-180',
            'motion-reduce:transition-none',
          )}
          aria-hidden
        />
      </span>
      <ThemeToggle className="size-9 shrink-0" />
    </div>
  );
}
