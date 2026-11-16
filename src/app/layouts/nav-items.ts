import {
  BookOpen,
  CalendarDays,
  Trophy,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react';

import type { Role } from '@/types';

export type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  // Absent : l'onglet est visible par tous les rôles.
  roles?: Role[];
};

// Onglets de la barre de navigation, dans l'ordre de la maquette
// 06-Administration-et-navigation/04-Navigation-par-role.
export const NAV_ITEMS: NavItem[] = [
  { to: '/repertoire', label: 'Répertoire', icon: BookOpen },
  { to: '/messes', label: 'Messes', icon: CalendarDays },
  { to: '/classements', label: 'Classements', icon: Trophy },
  {
    to: '/membres',
    label: 'Membres',
    icon: Users,
    roles: ['admin', 'secretaire'],
  },
  { to: '/profil', label: 'Profil', icon: UserRound },
];
