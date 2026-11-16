export type PaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

// Réponse d'une Resource collection Laravel paginée.
// `TMeta` décrit les clés ajoutées à `meta` par `->additional()` côté back.
export type Paginated<T, TMeta = unknown> = {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
    links: PaginationLink[];
  } & TMeta;
};
