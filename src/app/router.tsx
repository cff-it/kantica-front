import { createBrowserRouter, Navigate } from 'react-router';

import { ComingSoon } from '@/components/common/coming-soon';
import {
  LoginPage,
  PendingAccountPage,
  ProfileFormPage,
  RegisterPage,
} from '@/features/auth';
import { MembersListPage } from '@/features/members';
import { paths } from '@/lib/paths';

import {
  RequireAuth,
  RequireGuest,
  RequirePending,
  RequireRole,
} from './guards';
import { AppLayout } from './layouts/app-layout';
import { AuthLayout } from './layouts/auth-layout';

// `handle.title` : titre de la page dans l'onglet, lu par `useRouteTitle` dans
// les layouts (« Titre - Chorale Francophone de Faravohitra »).
export const router = createBrowserRouter([
  {
    element: <RequireGuest />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: paths.login,
            element: <LoginPage />,
            handle: { title: 'Connexion' },
          },
          {
            path: paths.register,
            element: <RegisterPage />,
            handle: { title: 'Inscription' },
          },
        ],
      },
    ],
  },
  {
    // Parcours d'un compte « en attente » : fiche de recensement (étape 2),
    // puis écran d'attente de validation.
    element: <RequirePending />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: paths.registerProfile,
            element: <ProfileFormPage />,
            handle: { title: 'Fiche de choriste' },
          },
        ],
      },
    ],
  },
  {
    element: <RequirePending requireProfile />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: paths.pendingAccount,
            element: <PendingAccountPage />,
            handle: { title: 'Compte en attente' },
          },
        ],
      },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to={paths.home} replace /> },
          {
            path: paths.songs,
            element: <ComingSoon title="Répertoire" />,
            handle: { title: 'Répertoire' },
          },
          {
            path: paths.masses,
            element: <ComingSoon title="Messes" />,
            handle: { title: 'Messes' },
          },
          {
            path: paths.rankings,
            element: <ComingSoon title="Classements" />,
            handle: { title: 'Classements' },
          },
          {
            element: <RequireRole roles={['admin', 'secretaire']} />,
            children: [
              {
                path: paths.members,
                element: <MembersListPage />,
                handle: { title: 'Membres' },
              },
            ],
          },
          {
            path: paths.profile,
            element: <ComingSoon title="Profil" />,
            handle: { title: 'Profil' },
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
