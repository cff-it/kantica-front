import { isAxiosError } from 'axios';
import type {
  FieldPath,
  FieldValues,
  UseFormSetError,
} from 'react-hook-form';

type LaravelValidationError = {
  message: string;
  errors?: Record<string, string[]>;
};

// Mappe une erreur de validation 422 de Laravel sur les champs du formulaire.
// Renvoie `false` si l'erreur n'est pas une 422 (l'appelant la traite alors).
export function applyServerErrors<TFieldValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TFieldValues>,
): boolean {
  if (!isAxiosError<LaravelValidationError>(error)) {
    return false;
  }

  if (error.response?.status !== 422) {
    return false;
  }

  const { message, errors = {} } = error.response.data;
  const fields = Object.entries(errors);

  fields.forEach(([field, messages], index) => {
    setError(
      field as FieldPath<TFieldValues>,
      { type: 'server', message: messages[0] },
      // Le premier champ de la réponse prend le focus : sur un long formulaire,
      // l'erreur peut être hors de l'écran et le bouton d'envoi sembler ne rien
      // faire. La page se cale sous la barre collée (`scroll-padding-top`). Un
      // champ sans référence focalisable (liste de pastilles) ne bouge pas.
      { shouldFocus: index === 0 },
    );
  });

  if (fields.length === 0) {
    setError('root.server', { type: 'server', message });
  }

  return true;
}

// Message d'une 422 de Laravel pour un champ (à défaut, le message général),
// `null` pour toute autre erreur. Pour les actions sans formulaire RHF, où
// `applyServerErrors` n'a pas de champ où poser l'erreur : un nouvel essai
// échouerait de la même façon, il faut donc en donner la raison.
export function getValidationMessage(
  error: unknown,
  field: string,
): string | null {
  if (
    !isAxiosError<LaravelValidationError>(error) ||
    error.response?.status !== 422
  ) {
    return null;
  }

  const data = error.response.data;

  return data?.errors?.[field]?.[0] ?? data?.message ?? null;
}
