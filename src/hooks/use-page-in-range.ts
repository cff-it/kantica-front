type PageMeta = {
  current_page: number;
  last_page: number;
};

// Ramène une liste paginée à sa dernière page quand la page demandée n'existe
// plus : des éléments supprimés pendant qu'on était en page 3, par exemple. Le
// back répond alors `data: []` avec `current_page > last_page`, et l'écran
// n'aurait ni ligne ni pagination pour revenir en arrière.
//
// À appeler dans le composant qui porte la page (motif React « ajuster un état
// quand une valeur change ») : la page est corrigée pendant le rendu. `page`
// (la page actuelle) évite de reposer la même valeur à chaque rendu tant que
// la réponse corrigée n'est pas arrivée, ce qui ferait boucler React.
export function usePageInRange(
  meta: PageMeta | undefined,
  page: number,
  setPage: (page: number) => void,
) {
  if (
    meta !== undefined &&
    isPageOutOfRange(meta) &&
    page !== meta.last_page
  ) {
    setPage(meta.last_page);
  }
}

// La page demandée dépasse la dernière, et cette dernière existe : c'est le
// seul cas que `usePageInRange` corrige. Sert aussi à l'écran, pour afficher
// le chargement pendant la correction et non pour une réponse incohérente.
export function isPageOutOfRange(meta: PageMeta): boolean {
  return meta.last_page >= 1 && meta.current_page > meta.last_page;
}
