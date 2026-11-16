# CLAUDE.md : Kantica Front-end

> Chorale Francophone de Faravohitra (CFF) : guide d'architecture du front React pour Claude Code

---

## Stack technique

- **Build** : Vite
- **Framework** : React + TypeScript (mode `strict`)
- **Routing** : React Router
- **Données serveur** : TanStack Query + Axios
- **Formulaires** : React Hook Form + Zod
- **UI** : Tailwind CSS v4 + shadcn/ui (thèmes clair et sombre)
- **Thème** : next-themes (classe `dark` sur `<html>`)
- **Polices** : Cormorant Garamond (titres) et Source Sans 3 (interface), via Fontsource
- **Icônes** : lucide-react
- **Notifications** : sonner, enveloppé dans `components/common/toaster.tsx`
- **Conteneurs** : Docker, nginx non-root en production (voir la section Docker)
- **API** : back-end Laravel `kantica-back`, authentification Laravel Sanctum en mode SPA (cookies)

---

## Architecture des dossiers

```
src/
├── app/                      # Démarrage de l'appli : rien de métier
│   ├── providers.tsx         # QueryClient, ThemeProvider, Router, Toaster, handler 401
│   ├── router.tsx            # Table des routes uniquement
│   ├── guards.tsx            # RequireAuth, RequireGuest, RequireRole
│   └── layouts/
│       ├── auth-layout.tsx   # Écrans publics (connexion, inscription)
│       ├── app-layout.tsx    # Écrans connectés : barre d'onglets selon le rôle
│       └── nav-items.ts      # Onglets de navigation et rôles autorisés
│
├── features/                 # ⭐ Cœur : 1 dossier = 1 domaine métier
│   ├── auth/
│   │   ├── api/              # Fonctions Axios pures et typées
│   │   ├── hooks/            # Hooks TanStack Query (useQuery / useMutation)
│   │   ├── components/       # Composants propres à la feature
│   │   ├── pages/            # Pages routées
│   │   ├── keys.ts           # Clés de cache (authKeys)
│   │   ├── schemas.ts        # Schémas Zod
│   │   ├── types.ts          # Types de la feature
│   │   └── index.ts          # API publique de la feature
│   ├── members/              # Lot 1 : liste, fiche, export
│   ├── songs/                # Répertoire des cantiques (lot ultérieur)
│   ├── masses/               # Messes + PPTX (lot ultérieur)
│   └── attendance/           # Présences + classements (lot ultérieur)
│
├── components/
│   ├── ui/                   # Composants shadcn générés par le CLI
│   └── common/               # Composants partagés : PageHeader, RoleGuard, ComingSoon, Toaster
│                             # (DataTable à ajouter avec la liste des membres)
│
├── lib/
│   ├── api-client.ts         # Instance Axios unique (credentials, XSRF, intercepteurs 401 et 419)
│   ├── query-client.ts       # Configuration TanStack Query
│   ├── form-errors.ts        # Mapping des erreurs 422 Laravel vers React Hook Form
│   ├── roles.ts              # hasAnyRole() : partagé par les guards et la navigation
│   └── utils.ts              # cn(), formatage de dates
│
├── hooks/                    # Hooks génériques sans métier (useDebounce, useMediaQuery)
└── types/                    # Types partagés : User, Role, Voice, Paginated<T>
```

Les sous-dossiers d'une feature (`components/`, `types.ts`...) sont créés au besoin : une feature ne
contient que ce qu'elle utilise. Seul `index.ts` est obligatoire.

---

## Règles fondamentales

### 1. La page ne fait qu'assembler

Une page compose des composants et appelle des hooks. Aucun appel Axios direct, aucune logique métier.

```tsx
// ✅ Correct
export function MembersListPage() {
  const { data, isLoading } = useMembers();

  return (
    <>
      <PageHeader title="Membres" />
      <MembersTable members={data?.data ?? []} loading={isLoading} />
    </>
  );
}

// ❌ Interdit : appel API et logique dans la page
export function MembersListPage() {
  const [members, setMembers] = useState([]);
  useEffect(() => {
    axios.get('/api/members').then((r) => setMembers(r.data.filter(...)));
  }, []);
}
```

### 2. Le flux d'une donnée est toujours le même

`api/` → `hooks/` → `components/` ou `pages/`

```ts
// features/members/api/get-members.ts
export async function getMembers(params: MembersQuery): Promise<MembersPage> {
  const { data } = await apiClient.get<MembersPage>('/members', { params });
  return data;
}

// features/members/hooks/use-members.ts
export function useMembers(params: MembersQuery = {}) {
  return useQuery({
    queryKey: memberKeys.list(params),
    queryFn: () => getMembers(params),
  });
}
```

- Une fonction de `api/` est pure : elle reçoit des paramètres typés, renvoie une `Promise` typée, sans état React.
- Un composant n'importe **jamais** `apiClient` directement.
- Les clés de cache sont centralisées dans un objet `xxxKeys` par feature, dans `keys.ts` :

```ts
export const memberKeys = {
  all: ['members'] as const,
  list: (params: MembersQuery) => [...memberKeys.all, 'list', params] as const,
  detail: (id: number) => [...memberKeys.all, 'detail', id] as const,
};
```

### 3. Les frontières entre features sont respectées

Une feature n'importe que l'`index.ts` public d'une autre feature, jamais ses fichiers internes.

```ts
// ✅ Correct
import { SongPicker } from '@/features/songs';

// ❌ Interdit : import d'un fichier interne d'une autre feature
import { SongPicker } from '@/features/songs/components/song-picker';
```

Si un élément devient utile à plusieurs features, il remonte dans `components/common/`, `hooks/` ou `types/`.

### 4. Les types suivent les Resources Laravel

Une `UserResource` côté back correspond à un type `User` côté front, avec les mêmes noms de champs. Les champs restent en **snake_case**, comme renvoyés par l'API : aucune conversion automatique.

```ts
// ✅ Correct : calqué sur UserResource (voir src/types/user.ts)
export type User = {
  id: number;
  mail: string;
  last_name: string;
  nick_name: string | null;
  status: UserStatus;
  roles?: Role[];
};

// ❌ Interdit : champs inventés ou renommés
export type User = {
  id: number;
  fullName: string; // n'existe pas dans la Resource
  email: string; // la Resource expose `mail`
};
```

- Les relations d'une Resource (`roles`, `firstnames`, `profile`) sont conditionnelles côté back
  (`whenLoaded`) : elles sont optionnelles dans le type, sauf pour `GET /api/me` qui les charge toutes.
- Les réponses sont enveloppées dans `{ data: ... }` (comportement par défaut de Laravel) ; les listes
  paginées suivent `Paginated<T>` (`data`, `links`, `meta`).

Aucun champ hors MCD et hors Resources ne doit être inventé.

### 5. Les formulaires passent par Zod + React Hook Form

```tsx
// features/auth/schemas.ts
// Le back attend le champ `mail` (LoginRequest), pas `email`.
export const loginSchema = z.object({
  mail: z.email('Adresse email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});
export type LoginInput = z.infer<typeof loginSchema>;

// features/auth/components/login-form.tsx
const form = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });
const login = useLogin();

const onSubmit = form.handleSubmit((values) =>
  login.mutate(values, {
    onError: (error) => applyServerErrors(error, form.setError),
  }),
);
```

Zod est en version 4 : on écrit `z.email()` et non `z.string().email()` (déprécié).

Les erreurs de validation 422 de Laravel sont mappées sur les champs **uniquement** via `lib/form-errors.ts`.
Sans champ concerné, le message est posé sur `form.formState.errors.root.server`.

### 6. Les rôles sont gérés à deux niveaux

- **Routeur** : un guard (`RequireRole` dans `app/guards.tsx`) bloque l'accès aux pages selon le rôle.
- **Interface** : `<RoleGuard>` masque les actions non autorisées.

```tsx
<RoleGuard roles={['admin', 'secretaire']}>
  <ExportMembersButton />
</RoleGuard>
```

Le front ne fait que de l'ergonomie : la vraie barrière reste les Policies Laravel côté back.

Rôles v1 : `admin`, `secretaire`, `membre`. Le rôle `externe` est hors v1.

---

## Authentification Sanctum (mode SPA)

- `lib/api-client.ts` configure Axios avec `withCredentials: true` et `withXSRFToken: true`.
- Les appels passent par `/api` et `/sanctum` sur **la même origine que le front** : proxy Vite en dev,
  nginx en production. Pas de CORS, pas de cookies tiers, pas d'URL d'API en dur.
- Avant le login ou l'inscription : appel de `GET /sanctum/csrf-cookie` (`getCsrfCookie()`), fait par la
  fonction de `api/` concernée.
- L'utilisateur courant est chargé via `useCurrentUser()` (TanStack Query, clé `['auth', 'me']`). Pour un
  visiteur non connecté, `data` vaut `null` : le 401 de `GET /api/me` n'est pas une erreur.
- Intercepteurs :
  - **401** : vider le cache de l'utilisateur et rediriger vers `/login`. Le handler est enregistré dans
    `app/providers.tsx` et ne fait rien si aucun utilisateur n'est en cache (cas du visiteur, géré par les guards)
  - **419** (CSRF expiré) : rappeler `/sanctum/csrf-cookie` puis rejouer la requête une seule fois

### Prérequis côté back (état constaté le 16 novembre 2026)

Le front est écrit pour le mode SPA par cookies, mais `kantica-back` n'y est pas encore configuré :

- `POST /api/auth/login` et `POST /api/register` renvoient un **token Bearer**, pas une session.
- `bootstrap/app.php` n'appelle pas `$middleware->statefulApi()`, il n'y a pas de `config/sanctum.php` et
  `SANCTUM_STATEFUL_DOMAINS` n'est pas défini dans `.env`.
- `GET /sanctum/csrf-cookie` fonctionne déjà : 204 avec les cookies `XSRF-TOKEN` et `laravel-session`.

À faire côté back avant l'étape 2 (Connexion) : activer `statefulApi()`, déclarer les origines du front dans
`SANCTUM_STATEFUL_DOMAINS` (par exemple `localhost:5173,localhost:8080`), faire ouvrir la session par le login
et la fermer par le logout. Tant que ce n'est pas fait, le login côté front ne peut pas aboutir.

---

## Ce qui est interdit

| ❌ Interdit | ✅ Remplacer par |
|---|---|
| Appel Axios dans une page ou un composant | Fonction dans `api/` + hook dans `hooks/` |
| `useEffect` + `useState` pour charger des données serveur | `useQuery` |
| Redux / Zustand pour des données serveur | TanStack Query |
| Import d'un fichier interne d'une autre feature | `index.ts` public de la feature |
| Logique métier dans une page | Hook ou fonction de la feature |
| Modification manuelle de `components/ui/` | Composant dans `components/common/` qui enveloppe le composant shadcn |
| Type `any` | Type explicite ou `unknown` |
| Champ de type inventé hors Resources Laravel | Type calqué sur la Resource |
| Couleurs en dur (`#123456`, `bg-blue-500`) | Variables du thème (`bg-primary`, `text-muted-foreground`) |
| URL d'API en dur ou variable `VITE_API_URL` | Chemin relatif `/api` (proxy Vite et nginx) |
| Composants et non-composants dans le même fichier de composants | Fichiers séparés (règle Fast Refresh) |
| FSD complet, Clean Architecture | Architecture par features suffisante |

---

## Conventions de nommage

| Élément | Fichier | Export |
|---|---|---|
| Composant | `members-table.tsx` | `MembersTable` |
| Page | `members-list-page.tsx` | `MembersListPage` |
| Hook | `use-members.ts` | `useMembers` |
| Fonction API | `get-members.ts` | `getMembers` |
| Schéma Zod | `schemas.ts` | `loginSchema` + type `LoginInput` |
| Clés de cache | `keys.ts` | `memberKeys` |

- Fichiers en **kebab-case**, composants en **PascalCase**, hooks préfixés par `use`.
- Fonctions API : verbe + nom (`getMembers`, `createMember`, `updateMember`, `exportMembers`).
- Mutations : `useCreateMember`, `useUpdateMember`, `useExportMembers`.
- Imports via l'alias `@/`, jamais de chemins relatifs qui remontent de plus d'un niveau (`../../../../../..`).

---

## Style de code

- Indentation de 2 espaces, marge douce de 80 caractères.
- Point-virgule, guillemets simples et virgule finale, comme dans les exemples de ce fichier. Les fichiers
  de configuration générés par Vite (`vite.config.ts`, `eslint.config.js`) gardent le style du gabarit.
- Ordre des imports : paquets externes, ligne vide, alias `@/`, ligne vide, chemins relatifs de la feature
  (`../keys`).
- Un fichier de composants n'exporte que des composants (règle ESLint `react-refresh/only-export-components`) :
  c'est pourquoi les guards sont dans `app/guards.tsx` et non dans `app/router.tsx`.
- Avant chaque commit : `npm run lint` et `npm run build` doivent passer.

---

## Interface

- Responsive obligatoire : l'usage mobile est prioritaire pour les membres.
- Zones tactiles de 44 px minimum, texte courant de 16 px minimum.
- Thèmes clair et sombre via les variables CSS de shadcn, conformes à la charte graphique Kantica.
- Les écrans suivent les maquettes du projet (`Kantica-maquettes/`) : ne pas inventer d'écran ni de champ absent des maquettes et des specs.
- Le vocabulaire liturgique est celui du projet : livret, antienne, prière après la communion, cycle A/B/C.

### Thème et charte graphique

Source : `Kantica-maquettes/02-Mode-sombre-et-charte/03-Charte-graphique.png`. Les couleurs sont définies une
seule fois dans `src/index.css`, avec les noms de variables de shadcn : les composants ajoutés par la CLI
héritent de la charte sans retouche.

| Charte | Hex | Token | Usage |
|---|---|---|---|
| Bleu CFF | `#3A6FC9` | `primary` | Boutons, navigation |
| Bleu texte | `#2F5DAE` | `link` (`text-link`) | Liens, texte bleu |
| Rouge CFF | `#E8231A` | `brand-red`, `destructive` | Accent ponctuel |
| Gris CFF | `#C8C8C8` | `brand-gray` | Filigranes |
| Encre | `#1F2430` | `foreground` | Texte principal |
| Ardoise | `#5F6675` | `muted-foreground` | Texte secondaire |
| Blanc | `#FFFFFF` | `background` | Fond principal |
| Nuit | `#11141B` | `background` (sombre) | Fond sombre |
| Surface | `#1A1E27` | `card` (sombre) | Champs sombres |
| Bleu nuit | `#7FA6EA` | `primary` (sombre) | Principal sombre |

- Les tokens `secondary`, `accent`, `muted`, `border`, `input`, ainsi que le texte clair du mode sombre,
  sont des teintes dérivées : la charte ne les fournit pas.
- Thème géré par `next-themes` : préférence du système par défaut, choix mémorisé sous la clé `kantica-theme`.
- Titres (`h1` à `h3`) en Cormorant Garamond 600 (`font-heading`), interface en Source Sans 3 (`font-sans`).
  Les polices sont importées dans `src/main.tsx`.
- Badges de voix (Soprano, Alto, Ténor, Basse) et couleurs liturgiques : définis dans la charte, pas encore
  codés. Ajouter leurs tokens quand un écran en a besoin, en relevant les valeurs sur la maquette.

### Navigation par rôle

Barre d'onglets en bas de l'écran (maquette `06-Administration-et-navigation/04-Navigation-par-role`).
La source de vérité est `app/layouts/nav-items.ts`.

| Rôle | Onglets |
|---|---|
| `membre` | Répertoire, Messes, Classements, Profil |
| `secretaire`, `admin` | Répertoire, Messes, Classements, Membres, Profil |

Événements et Paiements sont rangés dans Profil en attendant leurs écrans. Les routes des lots ultérieurs
affichent `<ComingSoon />` : ne pas y inventer d'interface.

### Composants shadcn

- `components/ui/` est généré par la CLI shadcn et n'existe pas encore : `components.json` n'a pas été créé
  car la CLI interroge `ui.shadcn.com`, injoignable depuis l'environnement où le socle a été posé.
- À lancer depuis un terminal avec accès réseau : `npx shadcn@latest init -t vite -b radix -p vega`.
  L'init réécrit des variables dans `src/index.css` : relire le diff et rétablir les valeurs de la charte
  (tableau ci-dessus). Les alias `@/` et le plugin Tailwind sont déjà configurés.
- Puis ajouter les composants au fur et à mesure : `npx shadcn@latest add button input label`, etc.
- Le composant shadcn `sonner` dépend de `next-themes`, déjà installé. `components/common/toaster.tsx`
  enveloppe `sonner` directement en attendant.

---

## Docker

Fichiers : `Dockerfile` (multi-étapes), `docker-compose.yml`, `nginx.conf`, `.dockerignore`.

| Cible | Rôle | Commande | URL |
|---|---|---|---|
| `prod` | Build statique (`tsc -b` puis `vite build`) servi par nginx non-root | `docker compose up --build` | http://localhost:8080 |
| `dev` | Vite avec HMR, code monté en volume (profil `dev`) | `docker compose --profile dev up dev` | http://localhost:5173 |

- Port de dev déjà pris : `DEV_PORT=5174 docker compose --profile dev up dev`.
- **Après tout ajout ou mise à jour de dépendance** (`package.json`), reconstruire et renouveler le volume
  anonyme de `node_modules` : `docker compose --profile dev up --build -V dev`. Sans `-V`, Compose réutilise
  l'ancien volume et Vite ne trouve pas les nouveaux paquets (`Failed to resolve import`).
- Le back n'est pas dans ce compose : il est lancé séparément (`kantica-back`, exposé sur le port 8008 de
  l'hôte). Le front le joint via `host.docker.internal:8008`.
- nginx : fallback SPA, gzip, `index.html` en `no-cache`, `/assets/` en cache immuable d'un an, en-têtes de
  sécurité, `client_max_body_size 10m` (import Excel), timeout de 120 s sur l'API (génération PPTX).
- nginx proxifie `/api/*` et `/sanctum/*` vers le back. `nginx.conf` est un **gabarit `envsubst`**, copié dans
  `/etc/nginx/templates/` : seules les variables d'environnement définies (`API_UPSTREAM`) sont remplacées.
- nginx n'hérite pas des `add_header` du niveau `server` dès qu'un `location` en déclare un : les en-têtes de
  sécurité sont répétés dans chaque `location` qui définit son propre `Cache-Control`.
- Le conteneur tourne en utilisateur non-root (uid 101) et expose un healthcheck sur le port 8080.

### Variables d'environnement

| Variable | Utilisée par | Défaut | Rôle |
|---|---|---|---|
| `API_PROXY_TARGET` | Proxy Vite (dev) | `http://localhost:8008` (`http://host.docker.internal:8008` dans Compose) | Cible du proxy `/api` et `/sanctum` |
| `API_UPSTREAM` | nginx (prod) | `http://host.docker.internal:8008` | Back Laravel joint par nginx |
| `DEV_PORT` | Compose | `5173` | Port hôte du service `dev` |

Aucune variable `VITE_*` : l'URL de l'API est relative (`/api`), donc identique en dev et en production.

---

## Commandes

```bash
npm run dev      # Vite hors Docker (http://localhost:5173)
npm run build    # tsc -b puis vite build
npm run lint     # ESLint
```

---

## Points d'attention

- **Logo officiel** : aucun fichier n'est fourni (`Documents/Cff.jpg` est le MCD de la base, pas le logo).
  `auth-layout.tsx` dessine l'icône simplifiée de la charte (C bleu, point rouge) en CSS. Déposer un SVG ou
  PNG transparent dans `src/assets/` et le brancher, avec le filigrane (Gris CFF, 5 à 7 % d'opacité).
- **Favicon** : `public/favicon.svg` est celui du gabarit Vite, à remplacer par l'icône Kantica.
- **Compte `pending`** : les guards ne traitent pas encore le statut `pending` (écran « Compte en attente »,
  étape 2). Le back refuse déjà ces comptes sur les routes protégées.
- **Taille du bundle** : un seul chunk d'environ 560 kB (175 kB gzip). Découper par route (`lazy`) quand les
  écrans des lots suivants arriveront.

---

## Lot en cours : Lot 1, recensement des membres

1. Socle
   - [x] Providers, routeur, layouts, client API, thème clair/sombre, guards par rôle, Docker
   - [ ] Composants shadcn (init de la CLI), logo officiel, `DataTable`
2. `auth` : Connexion, Inscription (compte + fiche de recensement), Compte en attente
   - [x] Couche données : `useCurrentUser`, `useLogin`, `useLogout`, `loginSchema`
   - [ ] Prérequis back (mode SPA par cookies), pages et formulaires, guard du statut `pending`
3. `members` : Liste des membres (secrétaire), Fiche membre, Export PDF / CSV
   - [x] Couche données de la liste : `getMembers`, `useMembers`, `memberKeys`
   - [ ] Tableau, recherche et filtre de voix, fiche membre, export
