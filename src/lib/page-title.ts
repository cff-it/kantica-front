// Nom de l'application dans le titre de l'onglet. Pour la forme courte, mettre
// 'CFF' : c'est la seule valeur à changer.
export const APP_NAME = 'Chorale Francophone de Faravohitra';

// Métadonnée d'une route (`handle` dans app/router.tsx) : le titre de la page.
export type RouteHandle = {
  title?: string;
};

// « Inscription - Chorale Francophone de Faravohitra ». Sans titre de page,
// seul le nom de l'application est affiché.
export function formatPageTitle(title?: string): string {
  return title ? `${title} - ${APP_NAME}` : APP_NAME;
}
