// Copie par sélection d'un champ caché : repli quand l'API du presse-papiers
// n'est pas disponible (page servie en http hors localhost, ancien navigateur).
function copyWithSelection(text: string): boolean {
  const field = document.createElement('textarea');

  field.value = text;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.append(field);
  field.select();

  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    field.remove();
  }
}

// Copie un texte dans le presse-papiers. `false` quand le navigateur refuse
// (permission, contexte non sécurisé sans repli possible) : l'appelant prévient
// l'utilisateur.
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);

    return true;
  } catch {
    return copyWithSelection(text);
  }
}
