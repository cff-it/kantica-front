import { useFormContext } from 'react-hook-form';

import type { SongSectionsInput } from '../schemas';

// Formulaire du cantique, lu dans le `FormProvider` le plus proche : les
// sections n'en lisent que `sections`, le reste (titre, auteur...) leur est
// inconnu. Le type des valeurs est posé ici, une seule fois : React Hook Form
// ne vérifie pas que le provider le porte. C'est vrai tant que le schéma du
// formulaire contient `sections: songSectionsSchema`. Même principe que
// `useRecordForm` de `members`.
export function useSongForm() {
  return useFormContext<SongSectionsInput>();
}
