import type { MembersQuery, UsersQuery } from './types';

export const memberKeys = {
  all: ['members'] as const,
  list: (params: MembersQuery) => [...memberKeys.all, 'list', params] as const,
  detail: (id: number) => [...memberKeys.all, 'detail', id] as const,
};

// Imports Excel : historique (`lists` regroupe toutes les pages) et rapport
// d'un import. Hors de `memberKeys` : recharger les membres ne doit pas
// relancer le suivi d'un import.
export const memberImportKeys = {
  all: ['member-imports'] as const,
  lists: () => [...memberImportKeys.all, 'list'] as const,
  list: (page: number) => [...memberImportKeys.lists(), page] as const,
  detail: (id: number) => [...memberImportKeys.all, 'detail', id] as const,
};

// Gestion des rôles : liste des comptes et de leur rôle (`GET /api/users`).
export const userRoleKeys = {
  all: ['user-roles'] as const,
  list: (params: UsersQuery) => [...userRoleKeys.all, 'list', params] as const,
};
