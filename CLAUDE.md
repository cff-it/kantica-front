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
- **API** : back-end Laravel `kantica-back`, authentification Laravel Sanctum par jeton Bearer (le back
  servira aussi une future app mobile : pas de session ni de cookies)

---

## Architecture des dossiers

```
src/
├── app/                      # Démarrage de l'appli : rien de métier
│   ├── providers.tsx         # QueryClient, ThemeProvider, Router, Toaster, handler 401
│   ├── router.tsx            # Table des routes uniquement
│   ├── guards.tsx            # RequireAuth, RequirePending, RequireGuest, RequireRole
│   └── layouts/
│       ├── auth-layout.tsx   # Écrans publics et parcours « en attente » : panneau de marque (grand écran)
│       ├── app-layout.tsx    # Écrans connectés : barre d'onglets (sous `lg`) ou barre latérale (dès `lg`)
│       ├── app-sidebar.tsx   # Barre latérale web : marque, entrées selon le rôle, carte de l'utilisateur
│       └── nav-items.ts      # Entrées de navigation et rôles autorisés
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
│   └── common/               # Composants partagés : PageHeader, RoleGuard, ComingSoon, Toaster,
│                             # FormField, PasswordField (FormField + œil afficher/masquer, à utiliser pour tout
│                             # mot de passe), ActionButton (enveloppes de shadcn), AuthPanel, AuthHeading,
│                             # BrandMark, Watermark, ThemeToggle, VoiceBadge, SheetDialogContent (modale :
│                             # feuille en bas sur mobile, fenêtre centrée dès `md`)
│
├── lib/
│   ├── api-client.ts         # Instance Axios unique (jeton Bearer, intercepteur 401)
│   ├── auth-token.ts         # Jeton Bearer : lecture, écriture, effacement (localStorage)
│   ├── download-file.ts      # downloadBlob() et nom de fichier de Content-Disposition (exports)
│   ├── query-client.ts       # Configuration TanStack Query
│   ├── form-errors.ts        # Mapping des erreurs 422 Laravel vers React Hook Form
│   ├── page-title.ts         # APP_NAME et format du titre de l'onglet
│   ├── paths.ts              # Chemins des écrans et destination d'un compte « en attente »
│   ├── roles.ts              # hasAnyRole() et getRoleLabel() : guards, navigation, carte de l'utilisateur
│   ├── names.ts              # getFullName(), getInitials() : prénom, nom et avatars
│   ├── voices.ts             # Les 4 voix : libellés et classes de couleur
│   └── utils.ts              # cn(), formatage de dates
│
├── assets/brand/             # Logo et filigranes (PNG transparents, voir Points d'attention)
├── hooks/                    # Hooks génériques sans métier (useDebounce, useMediaQuery, useRouteTitle)
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

## Authentification Sanctum (jeton Bearer)

Décision du 16 novembre 2026 : le front suit le mode jeton déjà en place côté `kantica-back`, parce que le
même back servira plus tard une app mobile. Pas de session, pas de cookies, pas de CSRF.

- `POST /api/auth/login` renvoie `{ token }` ; `POST /api/register` renvoie `{ token, user }` (compte créé
  `pending`, connecté d'office). Les hooks `useLogin` et `useRegister` rangent le jeton avec
  `setAuthToken()` (`lib/auth-token.ts`, `localStorage`, clé `kantica-token`, copie en mémoire si le
  stockage est indisponible), puis rechargent l'utilisateur courant. Les fonctions de `api/` restent pures :
  elles ne touchent pas au jeton.
- `lib/api-client.ts` ajoute `Authorization: Bearer <jeton>` à chaque requête. Les appels passent par
  `/api` sur **la même origine que le front** : proxy Vite en dev, nginx en production. Pas de CORS, pas
  d'URL d'API en dur.
- L'utilisateur courant est chargé via `useCurrentUser()` (TanStack Query, clé `['auth', 'me']`). Sans jeton,
  aucun appel n'est fait et `data` vaut `null` ; un 401 de `GET /api/me` donne aussi `null` : ce n'est pas
  une erreur.
- Intercepteur **401** : le jeton local est oublié (seulement s'il s'agit du jeton envoyé par la requête
  refusée), puis le handler de `app/providers.tsx` vide l'utilisateur du cache et redirige vers `/login`. Il
  ne fait rien si aucun utilisateur n'est en cache (cas du visiteur, géré par les guards).
- `useLogout` oublie le jeton même si l'appel échoue, met `me` à `null` (les guards redirigent vers `/login`)
  puis retire les autres requêtes du cache. Ne pas utiliser `queryClient.clear()` : il supprime la requête
  `me` et les guards restent liés à l'ancienne requête, sans redirection.
- Le jeton dans `localStorage` est lisible par un script injecté (XSS) : pas de contenu HTML non maîtrisé,
  pas de `dangerouslySetInnerHTML`.

### Comptes « en attente » (`status: 'pending'`)

Parcours : `/register` (étape 1, visiteurs) → `/register/profile` (étape 2) → `/pending-account`.
Les chemins sont dans `lib/paths.ts` et **toujours en anglais** (`/songs`, `/masses`, `/rankings`, `/members`,
`/profile`) : un nouvel écran ajoute sa clé dans `paths`, le routeur et la navigation l'utilisent, aucun
chemin n'est écrit en dur ailleurs.

- `RequireGuest` : un visiteur voit `/login` et `/register` ; un compte `pending` est renvoyé vers son
  parcours, un compte actif vers l'accueil. C'est ce guard, et non la page, qui envoie le nouvel inscrit
  vers l'étape 2 après `useRegister`.
- `RequirePending` : réservé aux comptes `pending` (un compte actif retourne à l'accueil). Avec
  `requireProfile`, une fiche non enregistrée (`profile.completed: false`) renvoie à l'étape 2.
- `RequireAuth` : réservé aux comptes actifs ; un compte `pending` est renvoyé vers `getPendingPath()`.
- `/register/profile` sert aussi de « Modifier ma fiche » (formulaire pré-rempli), depuis l'écran d'attente ;
  après l'enregistrement, retour sur `/pending-account` avec la fiche rechargée (`useUpdateOwnProfile`
  invalide `me` avant la navigation).
- L'email de contact est l'email du compte : le back ne l'accepte pas en saisie, il est en lecture seule.
- **Voix réservée après validation** : `canUpdateOwnVoice(user)` (`features/auth/utils.ts`) reprend
  `UserPolicy::updateOwnVoice` du back : voix libre si le compte est en attente, sans fiche ou admin, réservée
  sinon (la secrétaire passe par la fiche du membre). Voix réservée : `VoicePicker` est en lecture seule
  (`disabled`, avec un texte d'aide), `createProfileSchema(false)` ne l'exige plus et la requête **n'envoie pas
  `voice_group`**. Le renvoyer sans la voix précise donnerait un 422 (« Votre voix ne peut être modifiée que
  par un administrateur »), car le back compare aussi `voice`.
- **Voix précise (`voice`, ex. « A2 »)** : le formulaire ne la saisit pas. `getVoiceToKeep` la renvoie tant que le
  groupe ne change pas ; sans cela, enregistrer la fiche l'efface côté back.
- **« Modifier ma fiche » d'un compte validé** : route `/profile/edit` (`paths.profileEdit`, `EditProfilePage`),
  sous `RequireAuth` et `AppLayout` (barre d'onglets, « Profil » en surbrillance). Même formulaire, sans le suivi
  d'étapes, avec une flèche de retour. `ProfileForm` reçoit `returnTo` : l'écran d'origine est lu dans
  `location.state.from` (le lien d'entrée doit le poser : `<Link to={paths.profileEdit} state={{ from: ... }}>`),
  avec le Profil en repli (adresse saisie à la main). **Aucun lien d'entrée n'existe encore** : le ticket le
  laisse « à définir » (pas d'entrée « Ma fiche » dans le Profil des maquettes), à poser avec l'écran Profil.

### Connexion (`/login`)

- `POST /api/auth/login` répond **401** (« Identifiants invalides. ») aussi bien pour un email inconnu que pour
  un mauvais mot de passe : le front affiche un message unique (`isInvalidCredentialsError` dans
  `features/auth/utils.ts`) et ne les distingue jamais. Une 422 est mappée sur les champs par
  `applyServerErrors` ; toute autre erreur (réseau coupé, 5xx) ouvre un toast.
- `loginSchema` nettoie l'email (`trim`) : les claviers mobiles ajoutent souvent une espace finale. Le mot de
  passe n'est jamais modifié.
- `useLogin` est en `networkMode: 'always'`. Par défaut, TanStack Query met une mutation en pause hors
  ligne : le bouton tournerait sans fin, sans requête ni message. À reprendre pour toute mutation de
  formulaire dont l'échec doit s'afficher tout de suite (`useRegister` ne l'a pas encore).
- `/forgot-password` : route réservée (`<ComingSoon />`). Le lien figure sur la maquette de connexion, mais le
  back n'a aucune route de réinitialisation de mot de passe et aucune maquette de l'écran n'existe.
- `/profile` : en attendant l'écran Profil, la page affiche `<ComingSoon />` et `LogoutButton` (le bouton
  « Se déconnecter » de la maquette). Retirer le bouton de `app/router.tsx` quand l'écran sera construit.
- Un compte actif dont l'email n'est pas vérifié reçoit un 403 `EMAIL_NOT_VERIFIED` sur les routes
  protégées ; ce cas n'est pas encore traité côté front.
- Le back impose au mot de passe 8 caractères, majuscule, minuscule, chiffre et symbole ; la maquette
  n'affiche que « Au moins 8 caractères ». Les erreurs 422 du back s'affichent sous le champ.

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
- Les maquettes web et mobile sont deux mises en page différentes (barre latérale ou barre d'onglets,
  tableau ou lignes empilées), pas une mise à l'échelle. Une seule bascule, `lg` (1024 px), pour tout
  l'écran : ne pas mélanger `md:` et `lg:` pour une même mise en page. Un écran se vérifie à 390 px
  (émulation d'appareil : le redimensionnement de fenêtre ne descend pas sous 500 px) et à 1440 px.
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
  `components/common/theme-toggle.tsx` bascule clair et sombre ; il est en haut à droite de `AuthLayout` et
  `AppLayout`. La maquette place ce réglage (« Mode sombre ») dans l'écran Profil : à son implémentation,
  y déplacer le bouton et le retirer des layouts.
- Titres (`h1` à `h3`) en Cormorant Garamond 600 (`font-heading`), interface en Source Sans 3 (`font-sans`).
  Les polices sont importées dans `src/main.tsx`.
- Badges de voix (Soprano, Alto, Ténor, Basse), `success` et `warning` : tokens codés dans `src/index.css`,
  valeurs du mode clair relevées sur les maquettes du lot 1, valeurs du mode sombre dérivées. Les classes
  de chaque voix sont dans `lib/voices.ts`, le rendu dans `components/common/voice-badge.tsx`.
- Couleurs liturgiques : définies dans la charte, pas encore codées. Ajouter leurs tokens quand un écran
  en a besoin, en relevant les valeurs sur la maquette.

### Navigation par rôle

Barre d'onglets en bas de l'écran (maquette `06-Administration-et-navigation/04-Navigation-par-role`).
La source de vérité est `app/layouts/nav-items.ts`.

| Rôle | Onglets |
|---|---|
| `membre` | Répertoire, Messes, Classements, Profil |
| `secretaire`, `admin` | Répertoire, Messes, Classements, Membres, Profil |

Événements et Paiements sont rangés dans Profil en attendant leurs écrans. Les routes des lots ultérieurs
affichent `<ComingSoon />` : ne pas y inventer d'interface.

**Web (dès `lg`)** : la barre d'onglets cède la place à une barre latérale à gauche
(`app/layouts/app-sidebar.tsx`, maquettes `01-Lot1-Recensement/web`) : marque en haut, mêmes entrées sauf
Profil, carte de l'utilisateur en bas (initiales, nom, « Rôle · Voix ») qui ouvre `/profile`, bouton de
thème juste au-dessus. Le contenu passe sur fond grisé (`bg-muted/50`). Sous `lg` (mobile et tablette), la
barre d'onglets est conservée. Écarts connus avec les maquettes : l'entrée « Accueil » (première des
maquettes web et mobile) est absente, faute d'écran ; la maquette mobile retire « Profil » des onglets (le
profil s'ouvre depuis l'avatar de l'accueil), ce qui est impossible tant que l'accueil n'existe pas.

### Titre de l'onglet

Format : « Page - Chorale Francophone de Faravohitra » (ex. « Inscription - Chorale Francophone de
Faravohitra »). Le titre de chaque écran est déclaré **dans la table des routes**, par `handle: { title }`
dans `app/router.tsx` ; `useRouteTitle()` (`hooks/use-route-title.ts`, appelé par `AuthLayout` et
`AppLayout`) lit la route active et met à jour `document.title`. Une page n'a donc rien à faire ; un nouvel
écran ajoute simplement son `handle.title`. Le nom de l'application est la constante `APP_NAME` de
`lib/page-title.ts` : y mettre `'CFF'` pour la forme courte. Le `<title>` de `index.html` (avant le
chargement du JS) est le nom seul.

### Composants shadcn

- `components/ui/` est généré par la CLI shadcn (style `radix-vega`) : `button`, `input`, `label` et `dialog` y sont.
  Ne pas les modifier à la main : les adapter par une enveloppe dans `components/common/` (`FormField`,
  `ActionButton` : hauteur tactile de 48 et 56 px, texte de 16 px).
- `components.json` a été écrit à la main : la commande `shadcn init` expire (le serveur met environ 15 s
  à répondre, la CLI abandonne à 10 s). Il n'y a donc pas eu d'init, `src/index.css` n'a pas été réécrit.
  Pour ajouter un composant : `npx shadcn@latest add <nom>`. Si la CLI expire, relancer (le réseau est
  intermittent), ou télécharger l'élément avec `curl` depuis
  `https://ui.shadcn.com/r/styles/radix-vega/<nom>.json` et passer le fichier local à `shadcn add`.
- Piège : un élément installé ainsi peut déclarer `cn` comme dépendance npm et importer `from "cn"`. Il faut
  alors désinstaller le paquet `cn` et rétablir `import { cn } from "@/lib/utils"`. Les paquets `radix-ui`
  nécessaires doivent être installés à part.
- `dialog` : `shadcn add dialog` propose d'écraser `button.tsx` (refuser) et ajoute le paquet `cn` (à
  désinstaller). Le JSON du registre est brut (alias `@/registry/...`, `IconPlaceholder`, `cn-font-heading`) :
  `dialog.tsx` a été posé à la main avec `@/lib/utils`, `@/components/ui/button`, `XIcon` de lucide et
  `font-heading`. Ses animations utilisent les variants `data-open` et `data-closed`, déclarés dans
  `src/index.css` (Radix pose `data-state`). La croix et le « Close » anglais de shadcn ne servent pas :
  `SheetDialogContent` pose sa propre croix (« Fermer »).
- Le composant shadcn `sonner` dépend de `next-themes`, déjà installé. `components/common/toaster.tsx`
  enveloppe `sonner` directement en attendant.

---

## Liste des membres

- `GET /api/members?search=&voice=&page=` (20 par page, `PER_PAGE` du back). `useMembersFilters` porte la
  recherche (anti-rebond), le filtre de voix et la page ; la page revient à 1 quand la recherche ou la voix
  change, sans effet ni requête en plus.
- Deux mises en page, une seule montée à la fois (`useMediaQuery(LG_MEDIA_QUERY)` dans `MembersList`) :
  lignes empilées sous `lg`, tableau dès `lg` (Nom, Voix, Téléphone, Email, Statut, maquette
  `web/05-Liste-membres`). Chaque ligne est un lien vers la fiche (`getMemberPath(id)` de `lib/paths.ts`,
  motif `paths.member`) avec son chevron de fin de ligne, décoratif ; en web le lien est sur le nom et
  couvre toute la ligne. La route `/members/:id` affiche `<ComingSoon />` en attendant la fiche membre.
- **Téléphone et Email** : `MemberListItemResource` ne les renvoie pas. Chaque ligne du tableau lit donc la
  fiche (`GET /api/members/{id}`, `useMemberContact`, même clé de cache que la future fiche, `staleTime` de
  5 min) : 20 requêtes pour une page pleine. Elles ne partent que dès `lg`, jamais sur mobile. Si le back
  ajoute `phone` et `contact_mail` à la ligne de liste, supprimer `useMemberContact`, `getMember` et lire les
  champs sur `MemberListItem`.
- Autour de 1024 px, cinq colonnes ne tiennent pas à côté de la barre latérale : le tableau défile dans sa
  carte (Téléphone et Email ne se coupent jamais). Dès environ 1280 px, tout tient.
- Le contenu des écrans connectés (`AppLayout`) occupe toute la largeur à droite de la barre latérale,
  plafonnée à 1536 px (`lg:max-w-384`) pour ne pas s'étirer sur les très grands écrans.

## Export de la liste des membres

- `GET /api/members/export?format=pdf|csv&voice=S|A|T|B` renvoie le fichier lui-même, pas du JSON :
  `exportMembers` (`features/members/api/`) lit la réponse en `Blob` et tire le nom de fichier de
  `Content-Disposition`. `useExportMembers` télécharge le fichier dans son `onSuccess` (`downloadBlob`,
  `lib/download-file.ts`), donc même si la feuille est fermée pendant la génération. Le back accepte aussi
  `xlsx` : hors maquette, non proposé.
- `ExportMembersDialog` (bouton « Exporter » et feuille « Exporter la liste ») reçoit `count` et `voice`.
  `getExportCount` lit l'effectif dans `meta.registered_count` ou `meta.voice_counts` de la liste. La page lui
  passe le filtre de voix actif ; la recherche n'est pas reprise (le back n'exporte que par voix).
- Écart connu : `registered_count` compte les comptes en attente, alors que l'export du back ne prend que
  les comptes `active`. Le rappel « N choristes » peut donc dépasser le nombre de lignes du fichier.
- Une erreur de l'export (réseau, 403, 500) ouvre un toast et laisse la feuille ouverte ; le corps de
  l'erreur est un `Blob`, il n'est pas lu. `useExportMembers` est en `networkMode: 'always'`, comme
  `useLogin`.

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
- nginx proxifie `/api/*` et `/sanctum/*` vers le back (`/sanctum` n'est plus utilisé depuis le passage au
  jeton Bearer ; conservé sans effet). `nginx.conf` est un **gabarit `envsubst`**, copié dans
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

- **Logo et filigrane** : les fichiers sont dans `src/assets/brand/` (`logo-cff.png`, `watermark-light.png`,
  `watermark-dark.png`, `watermark-gray.png`, tous en 543 x 487, fond transparent). `BrandMark` affiche le
  logo ; `Watermark` (`components/common/watermark.tsx`) affiche le filigrane clair ou sombre selon le thème,
  ancré en bas à droite par `AuthLayout` (panneau de gauche sur grand écran, derrière le formulaire sur
  mobile). Les versions claire (encre à environ 6 %) et sombre (blanc à environ 5 %) sont déjà à leur
  opacité : ne pas ajouter d'opacité CSS. `watermark-gray.png` (Gris CFF `#C8C8C8`, pleine opacité) est la
  version source, pas encore utilisée.
- **Favicon** : `public/favicon-32.png`, `favicon-192.png` et `apple-touch-icon.png` sont générés à partir du
  logo sur **fond blanc** (le logo reste lisible sur les onglets sombres). Les deux favicons sont des
  **disques** (cercle complet, hors-disque transparent) ; le logo est mis à l'échelle d'après son tracé
  bleu et rouge, les ailes grises très claires pouvant être rognées par le cercle.
  `apple-touch-icon.png` reste carré et opaque, car iOS applique son propre arrondi et refuse la
  transparence. Les régénérer si le logo change.
- **Lint** : `components/ui/button.tsx` (généré par shadcn) exporte `buttonVariants` à côté de `Button`, ce
  qui déclenche `react-refresh/only-export-components`. Un `eslint-disable-next-line` est posé sur l'export
  et `eslint.config.js` reste intact (le hook `config-protection` interdit de l'assouplir). Si la CLI shadcn
  réécrit `button.tsx`, remettre ce commentaire.
- **Taille du bundle** : un seul chunk d'environ 560 kB (175 kB gzip). Découper par route (`lazy`) quand les
  écrans des lots suivants arriveront.

---

## Lot en cours : Lot 1, recensement des membres

1. Socle
   - [x] Providers, routeur, layouts, client API, thème clair/sombre, guards par rôle, Docker
   - [x] Composants shadcn `button`, `input`, `label`, `dialog`
   - [x] Logo officiel, filigrane et favicon
   - [ ] `DataTable` générique (la liste des membres a son propre tableau, `MembersList`)
2. `auth` : Connexion, Inscription (compte + fiche de recensement), Compte en attente
   - [x] Couche données : `useCurrentUser`, `useLogin`, `useLogout`, `useRegister`, `useUpdateOwnProfile`
   - [x] KAN-57 : inscription en 2 étapes, écran d'attente, guards du statut `pending`
   - [x] KAN-58 : page de connexion, déconnexion depuis Profil
   - [x] KAN-59 : modification de la fiche (formulaire pré-rempli, voix en lecture seule après validation)
   - [x] KAN-59 : route `/profile/edit` pour un compte validé
   - [ ] KAN-59 : lien d'entrée vers `/profile/edit` (à définir, avec l'écran Profil)
   - [ ] Vérification d'email, « Mot de passe oublié » (back et maquette absents)
3. `members` : Liste des membres (secrétaire), Fiche membre, Export PDF / CSV
   - [x] Couche données de la liste : `getMembers`, `useMembers`, `memberKeys`
   - [x] KAN-61 : export PDF / CSV (feuille « Exporter la liste », voir « Export de la liste des membres »)
   - [x] Liste : tableau (web, 5 colonnes de la maquette) et lignes (mobile), recherche, filtre de voix,
     pagination (voir « Liste des membres »)
   - [ ] Fiche membre
