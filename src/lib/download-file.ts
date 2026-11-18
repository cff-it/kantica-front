// Nom de fichier proposé par l'API : `Content-Disposition: attachment;
// filename=membres-cff-2026-11-17.csv` (avec ou sans guillemets).
export function getFilenameFromDisposition(
  disposition: unknown,
): string | undefined {
  if (typeof disposition !== 'string') {
    return undefined;
  }

  return /filename="?([^";]+)"?/i.exec(disposition)?.[1]?.trim();
}

// Enregistre un fichier déjà en mémoire (réponse binaire de l'API) : un lien
// temporaire pointe vers le Blob et on simule le clic. Le lien doit être dans
// le document pour que Firefox le prenne en compte.
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();

  // Libérée un peu après le clic, pour laisser le navigateur démarrer
  // l'enregistrement.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
