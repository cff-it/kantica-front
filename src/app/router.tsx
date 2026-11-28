import { createBrowserRouter, Navigate } from 'react-router';

import { ComingSoon } from '@/components/common/coming-soon';
import {
  EditProfilePage,
  ForgotPasswordPage,
  LoginPage,
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
  RolesPage,
} from '@/features/members';
import { ProfilePage } from '@/features/profile';
import {
  SongCreatePage,
  SongEditPage,
  SongsListPage,
} from '@/features/songs';
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
            // Répertoire (KAN-18) : tous les rôles, page d'accueil.
            path: paths.songs,
            element: <SongsListPage />,
            handle: { title: 'Répertoire' },
          },
          {
            // Ajout et modification d'un cantique (KAN-13, KAN-4) : réservés à
            // l'admin. L'ajout est ouvert par « + Ajouter » du répertoire, la
            // modification par le crayon de la fiche (KAN-25, pas encore
            // construite : l'écran s'ouvre par son adresse). `new` passe avant
            // `paths.song` (`:id`).
            element: <RequireRole roles={['admin']} />,
            children: [
              {
                path: paths.songNew,
                element: <SongCreatePage />,
                handle: { title: 'Ajouter un cantique' },
              },
              {
                path: paths.songEdit,
                element: <SongEditPage />,
                handle: { title: 'Modifier le cantique' },
              },
            ],
          },
          {
            // Fiche d'un cantique : écran de KAN-25, ouvert depuis une ligne
            // du répertoire.
            path: paths.song,
            element: <ComingSoon title="Fiche du cantique" />,
            handle: { title: 'Fiche du cantique' },
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
                // « Gestion des rôles » (KAN-8) : admin seulement, ouverte
                // depuis la liste des membres. Avant `paths.member` (`:id`).
                element: <RequireRole roles={['admin']} />,
                children: [
                  {
                    path: paths.memberRoles,
                    element: <RolesPage />,
                    handle: { title: 'Gestion des rôles' },
                  },
                ],
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
            // « Mon profil » (maquettes 06-Profil) : identité, réglages et
            // déconnexion ; présence, événements et paiements « Bientôt ».
            path: paths.profile,
            element: <ProfilePage />,
            handle: { title: 'Mon profil' },
          },
          {
            // « Modifier ma fiche » d'un compte actif. Pas encore de lien
            // d'entrée : la maquette Profil n'en a pas (voir CLAUDE.md).
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
