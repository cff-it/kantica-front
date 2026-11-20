import { useFormContext } from 'react-hook-form';

import type { MemberRecordInput } from '../schemas';

// Formulaire de fiche, lu dans le `FormProvider` le plus proche : celui de
// « Modifier la fiche » (valeurs `MemberRecordInput`) ou celui d'« Ajouter un
// membre », qui a un champ de plus (`mail`) que les cartes ne lisent pas.
// Le type des valeurs est posé ici, une seule fois : React Hook Form ne vérifie
// pas que le provider les porte. C'est vrai par construction, car
// `createMemberSchema` étend `memberRecordSchema`.
export function useRecordForm() {
  return useFormContext<MemberRecordInput>();
}
