import type { ImportStatus, ImportSummary, MemberImportListItem } from './types';

// Taille maximale d'un fichier d'import (ImportUsersRequest : 5 Mo).
export const IMPORT_FILE_MAX_BYTES = 5 * 1024 * 1024;

// Colonnes annoncées par la maquette 08. Le modèle téléchargé reprend toutes
// les colonnes du formulaire de recensement ; ces cinq sont celles que l'import
// exige (le téléphone est facultatif).
export const IMPORT_COLUMNS = [
  'Nom',
  'Prénom',
  'Voix (S, A, T ou B)',
  'Téléphone',
  'Email',
] as const;

// Membres montrés sur l'écran de vérification et dans le rapport (maquette 09) :
// les suivants sont résumés par « et 36 autres choristes ».
export const IMPORT_ROWS_VISIBLE = 4;

// Intervalle de suivi d'un import en cours (détail et historique).
export const IMPORT_POLL_INTERVAL_MS = 2000;

// Valeur affichée quand une information manque.
const EMPTY_VALUE = '-';

// `pending` et `running` : l'import se déroule en tâche de fond.
export function isImportRunning(status: ImportStatus): boolean {
  return status === 'pending' || status === 'running';
}

// Issue d'un import, qui donne le badge de statut de l'historique.
export type ImportOutcome = 'running' | 'completed' | 'partial' | 'failed';

export const IMPORT_OUTCOME_LABELS: Record<ImportOutcome, string> = {
  running: 'En cours',
  completed: 'Terminé',
  partial: 'Partiel',
  failed: 'Échec',
};

// « Partiel » : des lignes sont à corriger. « Échec » : le traitement s'est
// arrêté, ou rien n'a été importé alors que des lignes sont à corriger.
export function getImportOutcome(
  status: ImportStatus,
  counts: ImportSummary | null,
): ImportOutcome {
  if (isImportRunning(status)) {
    return 'running';
  }

  if (status === 'failed') {
    return 'failed';
  }

  if (!counts || counts.error_count === 0) {
    return 'completed';
  }

  return counts.created === 0 ? 'failed' : 'partial';
}

function countLabel(count: number, singular: string): string {
  return `${count} ${singular}${count > 1 ? 's' : ''}`;
}

// Colonne « Résultat » de l'historique : « 40 importés · 2 à corriger »,
// « 8 importés », « Aucun import · 5 à corriger ».
export function getImportResultLabel(item: MemberImportListItem): string {
  if (isImportRunning(item.status)) {
    return `En cours · ${item.progress.percent} %`;
  }

  if (item.status === 'failed') {
    return item.error ?? 'Import interrompu';
  }

  const counts = item.summary;

  if (!counts) {
    return EMPTY_VALUE;
  }

  const parts = [
    counts.created > 0 ? countLabel(counts.created, 'importé') : 'Aucun import',
  ];

  if (counts.error_count > 0) {
    parts.push(`${counts.error_count} à corriger`);
  }

  if (counts.skipped_count > 0) {
    parts.push(countLabel(counts.skipped_count, 'déjà présent'));
  }

  return parts.join(' · ');
}

// Les imports lancés avant l'ajout de `file_name` au back n'ont pas de nom.
export function getImportFileName(fileName: string | null): string {
  return fileName ?? 'Import sans nom';
}

// « 42 lignes » (lignes du fichier, en-tête exclu).
export function getRowsLabel(total: number): string {
  return countLabel(total, 'ligne');
}

// Pied de la liste des membres : « et 36 autres choristes ».
export function getRemainingLabel(count: number): string {
  return `et ${count} autre${count > 1 ? 's' : ''} choriste${
    count > 1 ? 's' : ''
  }`;
}

// Bouton de l'écran de vérification : « Importer 40 membres ».
export function getImportButtonLabel(count: number): string {
  return `Importer ${countLabel(count, 'membre')}`;
}

type ReviewCounts = {
  error_count: number;
  skipped_count: number;
};

// Pied de l'écran de vérification (maquette web 09), selon ce que l'aperçu
// a trouvé. `null` quand il n'y a rien à expliquer.
export function getReviewNote({
  error_count: errorCount,
  skipped_count: skippedCount,
}: ReviewCounts): string | null {
  if (errorCount > 0) {
    return (
      'Les lignes à corriger ne seront pas importées. Corrigez-les dans le ' +
      'fichier puis importez-le à nouveau : les membres déjà présents ne ' +
      'seront pas dupliqués.'
    );
  }

  if (skippedCount > 0) {
    return 'Les membres déjà présents ne seront pas dupliqués.';
  }

  return null;
}

const sizeFormatter = new Intl.NumberFormat('fr-FR', {
  maximumFractionDigits: 1,
});

// Taille d'un fichier : « 128 Ko », « 1,2 Mo ».
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} o`;
  }

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} Ko`;
  }

  return `${sizeFormatter.format(bytes / (1024 * 1024))} Mo`;
}

// Identifiant de la route `/members/import/:id` : entier positif écrit en
// chiffres, sinon `undefined` (la page affiche « Import introuvable » sans
// requête).
export function parseImportId(value: string | undefined): number | undefined {
  return value && /^[1-9]\d*$/.test(value) ? Number(value) : undefined;
}
