import { createBrowserRouter, Navigate } from 'react-router';

import { ComingSoon } from '@/components/common/coming-soon';
import {
  EditProfilePage,
  ForgotPasswordPage,
  LoginPage,
  LogoutButton,
  PendingAccountPage,
  ProfileFormPage,
  RegisterPage,
} from '@/features/auth';
import {
  ImportMembersLayout,
  ImportMembersPage,
  ImportReportPage,
  ImportReviewPage,
  MemberCreatePage,
  MemberDetailPage,
  MemberEditPage,
  MembersListPage,
} from '@/features/members';
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
            path: paths.forgotPassword,
            element: <ForgotPasswordPage />,
            handle: { title: 'Mot de passe oublié' },
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
              {
                // Import Excel : ce layout sans chemin garde le fichier choisi
                // entre le choix et la vérification. Le rapport est hors du
                // layout : en y arrivant, l'état du parcours est oublié.
                element: <ImportMembersLayout />,
                children: [
                  {
                    path: paths.membersImport,
                    element: <ImportMembersPage />,
                    handle: { title: 'Importer des membres' },
                  },
                  {
                    path: paths.membersImportReview,
                    element: <ImportReviewPage />,
                    handle: { title: 'Vérification' },
                  },
                ],
              },
              {
                path: paths.membersImportReport,
                element: <ImportReportPage />,
                handle: { title: "Rapport d'import" },
              },
              {
                path: paths.memberNew,
                element: <MemberCreatePage />,
                handle: { title: 'Ajouter un membre' },
              },
              {
                path: paths.member,
                element: <MemberDetailPage />,
                handle: { title: 'Fiche membre' },
              },
              {
                path: paths.memberEdit,
                element: <MemberEditPage />,
                handle: { title: 'Modifier la fiche' },
              },
            ],
          },
          {
            // Écran Profil à venir : en attendant, seul le bouton de
            // déconnexion de la maquette (le ticket l'attend dans Profil).
            path: paths.profile,
            element: (
              <>
                <ComingSoon title="Profil" />
                <LogoutButton />
              </>
            ),
            handle: { title: 'Profil' },
          },
          {
            // « Modifier ma fiche » d'un compte actif. Pas encore de lien
            // d'entrée : l'écran Profil n'est pas construit (voir CLAUDE.md).
            path: paths.profileEdit,
            element: <EditProfilePage />,
            handle: { title: 'Fiche de choriste' },
          },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);
