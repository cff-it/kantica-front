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

export const router = createBrowserRouter([
  {
    element: <RequireGuest />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          { path: paths.login, element: <LoginPage /> },
          { path: paths.register, element: <RegisterPage /> },
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
          { path: paths.registerProfile, element: <ProfileFormPage /> },
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
          { path: paths.pendingAccount, element: <PendingAccountPage /> },
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
          { path: paths.songs, element: <ComingSoon title="Répertoire" /> },
          { path: paths.masses, element: <ComingSoon title="Messes" /> },
          {
            path: paths.rankings,
            element: <ComingSoon title="Classements" />,
          },
          {
            element: <RequireRole roles={['admin', 'secretaire']} />,
            children: [{ path: paths.members, element: <MembersListPage /> }],
          },
          { path: paths.profile, element: <ComingSoon title="Profil" /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
