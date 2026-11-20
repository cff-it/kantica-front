import { MemberCreateForm } from './member-create-form';

// Écran « Ajouter un membre » : l'en-tête (retour, titre, enregistrement) est
// dans le formulaire, dont il porte les boutons. Même cadre que
// `MemberEdit`.
export function MemberCreate() {
  return (
    <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-none">
      <MemberCreateForm />
    </div>
  );
}
