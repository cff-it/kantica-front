import { MemberCreate } from '../components/member-create';

// « Ajouter un membre » (secrétaire, admin) : la page de modification de la
// fiche, en mode création. Le rôle est contrôlé par `RequireRole` dans le
// routeur ; la vraie barrière reste la Policy du back (403).
export function MemberCreatePage() {
  return <MemberCreate />;
}
