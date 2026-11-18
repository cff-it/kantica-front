import type { UseFormReturn } from 'react-hook-form';
import { useOutletContext } from 'react-router';

import type { ImportFileInput } from '../schemas';
import type { ImportPreview } from '../types';

// État partagé par l'écran de choix du fichier et l'écran de vérification
// (layout `ImportMembersLayout`) : le formulaire qui porte le fichier (un
// `File` ne passe pas par l'adresse) et l'aperçu que le back en a fait.
export type ImportFlow = {
  form: UseFormReturn<ImportFileInput>;
  preview: ImportPreview | null;
  setPreview: (preview: ImportPreview | null) => void;
};

export function useImportFlow(): ImportFlow {
  return useOutletContext<ImportFlow>();
}
