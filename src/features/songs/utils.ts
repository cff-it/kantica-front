// Sous-titre du répertoire : « 13 cantiques ». Porte sur tout le répertoire,
// pas sur le résultat de la recherche.
export function getSongsCountLabel(count: number): string {
  return `${count} cantique${count > 1 ? 's' : ''}`;
}
