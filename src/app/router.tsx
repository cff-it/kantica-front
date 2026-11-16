import { createBrowserRouter, Navigate } from 'react-router';

import { ComingSoon } from '@/components/common/coming-soon';
import { LoginPage } from '@/features/auth';
import { MembersListPage } from '@/features/members';

import { RequireAuth, RequireGuest, RequireRole } from './guards';
import { AppLayout } from './layouts/app-layout';
import { AuthLayout } from './layouts/auth-layout';

// Page d'accueil après connexion (premier onglet de la navigation).
const DEFAULT_ROUTE = '/repertoire';

export const router = createBrowserRouter([
  {
    element: <RequireGuest />,
    children: [
      {
        element: <AuthLayout />,
        children: [{ path: '/login', element: <LoginPage /> }],
      },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to={DEFAULT_ROUTE} replace /> },
          { path: 'repertoire', element: <ComingSoon title="Répertoire" /> },
          { path: 'messes', element: <ComingSoon title="Messes" /> },
          { path: 'classements', element: <ComingSoon title="Classements" /> },
          {
            element: <RequireRole roles={['admin', 'secretaire']} />,
            children: [{ path: 'membres', element: <MembersListPage /> }],
          },
          { path: 'profil', element: <ComingSoon title="Profil" /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
