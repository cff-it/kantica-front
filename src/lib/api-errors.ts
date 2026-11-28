import { isAxiosError } from 'axios';

// Statut d'une erreur de l'API, partagé entre les features : membres (fiche,
// rapport d'import, voix, ajout) et répertoire.

// Le back répond 404 pour une ressource inconnue (membre, import, cantique).
export function isNotFoundError(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 404;
}

// Le back répond 403 quand le rôle ne suffit pas, ou (rapport d'import) quand
// l'import a été lancé par quelqu'un d'autre qu'un admin.
export function isForbiddenError(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 403;
}
