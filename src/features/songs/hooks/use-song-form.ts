import { useFormContext } from 'react-hook-form';

import type { SongFormInput } from '../schemas';

// Formulaire du cantique, lu dans le `FormProvider` le plus proche : les champs
// (`SongInfoCard`) et les cartes de sections (`SongSectionCard`) le lisent sans
// recevoir de prop `form`. Le type des valeurs est posé ici, une seule fois :
// React Hook Form ne vérifie pas que le provider le porte. C'est vrai parce que
// `SongForm` est le seul à l'installer, avec `songFormSchema`. Même principe
// que `useRecordForm` de `members`.
export function useSongForm() {
  return useFormContext<SongFormInput>();
}
