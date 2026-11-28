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
│   ├── members/              # Lot 1 : liste, fiche, export, import Excel ; « Gestion des rôles » (KAN-63)
│   ├── profile/              # « Mon profil » (identité, réglages, déconnexion)
│   ├── songs/                # Répertoire : liste et recherche des cantiques (KAN-18)
│   ├── masses/               # Messes + PPTX (lot ultérieur)
│   └── attendance/           # Présences + classements (lot ultérieur)
│
├── components/
│   ├── ui/                   # Composants shadcn générés par le CLI
│   └── common/               # Composants partagés : PageHeader, RoleGuard, ComingSoon, Toaster,
│                             # FormField, PasswordField (FormField + œil afficher/masquer, à utiliser pour tout
│                             # mot de passe), ActionButton (enveloppes de shadcn), AuthPanel, AuthHeading,
│                             # BrandMark, Watermark, ThemeToggle, VoiceBadge, VoicePicker (choix de la voix :
│                             # `layout` « form » ou « sheet »), SheetDialogContent (modale : feuille en bas
│                             # sur mobile, fenêtre centrée dès `md`), FieldLabel (libellé avec astérisque ou
│                             # « (facultatif) »), FormTextarea, ChoiceChips (choix multiple en pastilles),
│                             # DateField (champ de date en lecture seule qui ouvre le sélecteur), DatePickerDialog (sélecteur
│                             # à précision : année, mois ou jour), PhoneField (téléphone : drapeau, pays et numéro
│                             # national, valeur en E.164), PhoneListField (plusieurs numéros, un par ligne),
│                             # InitialsAvatar (pastille d'initiales), ListPagination (pages précédente et
│                             # suivante des listes), SearchField (recherche des listes : membres, rôles,
│                             # répertoire), RoleBadge (badge du rôle), ThemeSwitch (interrupteur
│                             # « Mode sombre » du Profil)
│
├── lib/
│   ├── api-client.ts         # Instance Axios unique (jeton Bearer, intercepteur 401)
│   ├── api-errors.ts         # isNotFoundError(), isForbiddenError() : 404 et 403 de l'API (membres, répertoire)
│   ├── auth-token.ts         # Jeton Bearer : lecture, écriture, effacement (localStorage)
│   ├── download-file.ts      # downloadBlob() et nom de fichier de Content-Disposition (exports)
│   ├── clipboard.ts          # copyText() : copie dans le presse-papiers, avec repli
│   ├── query-client.ts       # Configuration TanStack Query
│   ├── form-errors.ts        # Mapping des erreurs 422 Laravel vers React Hook Form ; getValidationMessage()
│                             # (message d'une 422 pour une action sans formulaire)
│   ├── page-title.ts         # APP_NAME et format du titre de l'onglet
│   ├── paths.ts              # Chemins des écrans et destination d'un compte « en attente »
│   ├── roles.ts              # hasAnyRole(), getHighestRole(), getRoleLabel(), ROLE_OPTIONS (libellés et
│                             # couleurs des badges) : guards, navigation, carte de l'utilisateur, rôles
│   ├── names.ts              # getFullName(), getInitials() : prénom, nom et avatars
│   ├── voices.ts             # Les 4 voix : libellés et classes de couleur
│   ├── dates.ts              # Dates de la fiche : lecture de la saisie (jj/mm/aaaa, mm/aaaa, aaaa) et écriture du choix du sélecteur
│   ├── phone.ts              # Téléphones : liste des pays et drapeaux, saisie vers E.164, validation, affichage international
│   ├── phone-schema.ts       # phonesSchema() : règle Zod d'un ou plusieurs numéros (members et auth)
│   └── utils.ts              # cn(), formatage de dates et d'heures (formatShortDate, formatTime)
│
├── assets/brand/             # Logo et filigranes (PNG transparents, voir Points d'attention)
├── hooks/                    # Hooks génériques sans métier (useDebounce, useMediaQuery, useRouteTitle,
│                             # usePageInRange : retour à la dernière page d'une liste qui a rétréci)
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
- `/profile` : écran « Mon profil » (voir « Profil »), avec `LogoutButton` (« Se déconnecter »).
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
  `components/common/theme-toggle.tsx` bascule clair et sombre : en haut à droite de `AuthLayout`, et dans la
  languette de la barre latérale web. Sous `lg`, l'écran connecté n'a plus de bouton flottant : le réglage est
  l'interrupteur « Mode sombre » du Profil (`ThemeSwitch`, maquette 06-Profil).
- Titres (`h1` à `h3`) en Cormorant Garamond 600 (`font-heading`), interface en Source Sans 3 (`font-sans`).
  Les polices sont importées dans `src/main.tsx`.
- Badges de voix (Soprano, Alto, Ténor, Basse), `success` et `warning` : tokens codés dans `src/index.css`,
  valeurs du mode clair relevées sur les maquettes du lot 1, valeurs du mode sombre dérivées. Les classes
  de chaque voix sont dans `lib/voices.ts`, le rendu dans `components/common/voice-badge.tsx`.
- Badges de rôle (`role-admin`, `role-secretary`, `role-member` et leurs `-foreground`) : Admin bleu nuit plein
  `#1D3566`, Secrétaire `#E4ECFA` / `#234A8F`, Membre `#F2F3F5` / `#3D4452`, relevés sur les maquettes 06 ;
  mode sombre dérivé. Classes dans `ROLE_OPTIONS` (`lib/roles.ts`), rendu dans `components/common/role-badge.tsx`.
- Tokens de l'import Excel (`success-soft`, `failure`, `excel`) : valeurs du mode clair relevées sur les maquettes
  `08` et `09` du lot 1, mode sombre dérivé. `failure` est le rouge foncé des imports en échec, distinct du rouge CFF
  (`destructive`) ; `excel` est le vert de la pastille XLSX. Les tuiles bleues et ambre réutilisent `secondary` et
  `warning`.
- Couleurs liturgiques : définies dans la charte, pas encore codées. Ajouter leurs tokens quand un écran
  en a besoin, en relevant les valeurs sur la maquette.

### Navigation par rôle

Barre d'onglets en bas de l'écran (maquette `06-Administration-et-navigation/04-Navigation-par-role`).
La source de vérité est `app/layouts/nav-items.ts`.

| Rôle | Onglets |
|---|---|
| `membre` | Répertoire, Messes, Classements, Profil |
| `secretaire`, `admin` | Répertoire, Messes, Classements, Membres, Profil |

Événements et Paiements sont rangés dans Profil (« Vie de la chorale », badge « Bientôt ») en attendant leurs
écrans. Les routes des lots ultérieurs affichent `<ComingSoon />` : ne pas y inventer d'interface.

**Web (dès `lg`)** : la barre d'onglets cède la place à une barre latérale à gauche
(`app/layouts/app-sidebar.tsx`, maquettes `01-Lot1-Recensement/web`) : marque en haut, mêmes entrées sauf
Profil, carte de l'utilisateur en bas (initiales, nom, « Rôle · Voix ») qui ouvre `/profile`, bouton de
thème en languette flottante collée au bord gauche de l'écran, au-dessus de la carte (`ThemeHandle`) : seule la
flèche « > » est visible, le bouton apparaît au survol ou au focus clavier. Le contenu passe sur fond grisé (`bg-muted/50`). Sous `lg` (mobile et tablette), la
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

- `GET /api/members?search=&voice=&page=` (20 par page, `PER_PAGE` du back ; au-delà de la page 100 000, le back
  répond 422). `useMembersFilters` porte la recherche (anti-rebond), le filtre de voix et la page. Chaque changement
  de recherche ou de voix ramène à la page 1, même quand il revient à des filtres déjà vus (« a » en page 3,
  effacée, puis « a » de nouveau ; voix S en page 2, puis A, puis S) : le hook garde les filtres pour lesquels la
  page a été choisie (clé `recherche|voix`) et remet la page à 1 pendant le rendu quand ils changent (motif React
  « ajuster un état quand une valeur change »), sans effet ni requête pour l'ancienne page. Dans ce rendu
  intermédiaire, la requête demande déjà la page 1. **Vérifié contre le vrai back** (branches
  `fix/listes-pagination`, 25 comptes temporaires ajoutés puis supprimés) à 1440 px en clair et 390 px en sombre :
  défaut reproduit avec l'ancien hook (page 2 rendue), puis page 1 dans les deux cas avec le nouveau.
- **Page devenue trop grande** : comme pour le répertoire, `usePageInRange` ramène la page à la dernière pendant le
  rendu de `MembersListPage`, et `MembersResults` affiche « Chargement des membres… » le temps qu'elle arrive
  (`isPageOutOfRange`), au lieu d'un faux « Aucun membre ». **Vérifié contre le vrai back** (25 comptes temporaires,
  supprimés en base pendant la lecture de la page 1, puis « Suivant ») à 1440 px en clair : retour en page 1.
- Deux mises en page, une seule montée à la fois (`useMediaQuery(LG_MEDIA_QUERY)` dans `MembersList`) :
  lignes empilées sous `lg`, tableau dès `lg` (Nom, Voix, Téléphone, Email, Statut, maquette
  `web/05-Liste-membres`). Chaque ligne est un lien vers la fiche (`getMemberPath(id)` de `lib/paths.ts`,
  motif `paths.member`) avec son chevron de fin de ligne, décoratif ; en web le lien est sur le nom et
  couvre toute la ligne. La route `/members/:id` ouvre la fiche membre (voir « Fiche membre »).
- **Téléphone et Email** : `MemberListItemResource` renvoie `phone` (null sans fiche saisie) et `contact_mail`
  (toujours l'email du compte), au format de la fiche (KAN-33 côté back). Le tableau web les lit sur la ligne,
  sans requête en plus ; les téléphones s'affichent au format international, un numéro par ligne (`formatPhone`), « - » sans numéro. Le front dépend de ce champ : un back sans
  KAN-33 laisserait la colonne Email vide.
- Autour de 1024 px, cinq colonnes ne tiennent pas à côté de la barre latérale : le tableau défile dans sa
  carte (Téléphone et Email ne se coupent jamais). Dès environ 1280 px, tout tient.
- Le contenu des écrans connectés (`AppLayout`) occupe toute la largeur à droite de la barre latérale,
  plafonnée à 1536 px (`lg:max-w-384`) pour ne pas s'étirer sur les très grands écrans.

## Fiche membre

Routes `/members/:id` (`paths.member`, `MemberDetailPage`) et `/members/:id/edit` (`paths.memberEdit`,
`MemberEditPage`), sous `RequireRole` (`admin`, `secretaire`). Maquettes `01-Lot1-Recensement/{mobile,web}`.

- **Une seule arborescence, deux mises en page** : `MemberDetail` rend les deux maquettes avec les classes `lg:`
  (pas de `useMediaQuery`). `MemberDetailHeader` contient deux `<header>` : mobile (flèche, « Fiche membre »,
  « Modifier », `lg:hidden`) et web (« Membres », nom en titre, bouton « Modifier », `hidden lg:block`). Le
  nom complet n'est donc le `h1` qu'une fois à l'écran : celui du web, ou celui sous l'avatar en mobile.
  L'en-tête mobile garde `pr-12` : `ThemeToggle` est en `absolute top-3 right-3` sous `lg` et recouvrirait
  « Modifier ».
- **Chargement** : `MemberLoader` (`id`, enfant en fonction) gère le chargement, la 404 (`isNotFoundError`,
  `MemberNotFound`) et les autres erreurs (alerte et « Réessayer »). Les deux pages passent `key={memberId}`
  pour repartir d'un état propre quand l'identifiant change. Un identifiant illisible (`parseMemberId` :
  entier positif, rien d'autre) affiche `MemberNotFound` sans appel au back.
- **Cache** : la fiche (`memberKeys.detail(id)`) et la liste sont sous `memberKeys.all` : une mutation les
  recharge donc toutes les deux (la liste est à jour au retour). Les deux mutations
  (`useValidateMember`, `useUpdateMember`) sont en `networkMode: 'always'` et renvoient la Promise
  d'invalidation de leur `onSuccess` : le bouton reste en chargement jusqu'au rechargement de la fiche.
  `useUpdateMember` invalide aussi `authKeys.me()` (un admin peut modifier sa propre fiche, la carte de la
  barre latérale lit `me`).
- **Validation d'un compte** : `PendingValidationBanner` (si `status === 'pending'`), `POST
  /api/members/{id}/validate`. La réponse est une `UserResource` **sans `profile` ni prénoms** : on invalide
  `memberKeys.all` au lieu de `setQueryData`, sinon la fiche perdrait ses coordonnées. Bouton « Valider »
  sous `lg`, « Valider le compte » dès `lg` (un seul bouton, `aria-label` fixe).
- **Attribution de la voix** (KAN-15 / KAN-64, `ChangeVoiceDialog`, lien « Changer », maquettes
  `03-Repertoire-et-voix/{mobile,web}/*-Attribution-voix`) : feuille en bas sur mobile, fenêtre centrée dès `md`
  (`SheetDialogContent`). Route dédiée `PUT /api/members/{id}/voice` avec `{ voice: 'S' | 'A' | 'T' | 'B' }`
  (KAN-34 côté back, `assignMemberVoice`, `useAssignMemberVoice`) : seule la voix est envoyée, la fiche n'a pas
  besoin d'être complète. Le lien apparaît dès que la fiche existe (`profile.completed`) ; sans fiche, le back
  répond 422 et le lien est masqué (« Modifier » la fait remplir). Le back garde la voix précise (`voice`, ex.
  « A2 ») tant que le groupe ne change pas et l'efface sinon. Même groupe : la feuille se ferme sans requête.
  Succès : toast « Voix modifiée. », `memberKeys.all` et `authKeys.me()` invalidés (fiche, liste, effectifs par
  voix, carte de la barre latérale). 422 (membre sans fiche, voix refusée) : toast avec la raison du back
  (`getValidationMessage` de `lib/form-errors.ts` : message du champ `voice`, sinon le premier message de la
  réponse, jamais le `message` général de Laravel qui peut finir en anglais), car un nouvel essai échouerait
  pareil ; 403 : toast dédié ; réseau et 5xx : « Impossible de modifier la voix. Réessayez. ».
  Le lien n'apparaît que si `hasMemberRecord(member)` (`utils.ts`) : `profile.completed` veut dire « fiche
  enregistrée » (`profile !== null` côté back), pas « fiche complète », c'est la règle exacte de la route.
  **Vérifié contre le vrai back** (branches `feature/kan-34-assign-voice` et `feature/kan-64-assign-voice`, compte
  admin) à 1440 px en clair et à 375 px en sombre : fiche incomplète (Alto vers Ténor puis Ténor vers Alto, voix
  précise A2 effacée, téléphone conservé en base), badge et effectifs de la liste à jour, lien masqué pour un
  membre sans fiche, vrai 422 (fiche supprimée en base pendant que la feuille était ouverte : toast avec la raison
  du back, puis base remise en état par le seeder). **Non vérifié** à l'écran : les toasts 403 et d'erreur réseau
  (le 403 est couvert côté back par les tests). Les membres de test (`kan15.*@scenarios.kantica.test`) ont été purgés par `MemberReferenceSeeder`.
- **Modifier la fiche** (`MemberProfileForm`, maquettes `01-Lot1-Recensement/{mobile,web}/11-Modification-fiche-membre`) :
  `PUT /api/members/{id}` est **complet** (`UpdateMemberProfileRequest`) : toute la fiche est envoyée à chaque
  enregistrement et un champ facultatif envoyé à `null` est effacé. Six cartes (`member-record-sections.tsx`,
  rangées par `MemberRecordFields`, partagé avec « Ajouter un membre » : Identité, Coordonnées, Chorale,
  Paroisse et sacrements, Mariage, Contact en cas d'urgence), sur deux colonnes
  dès `lg` (Identité, Coordonnées et Chorale à gauche, le reste à droite), empilées dans l'ordre de la maquette
  en dessous. Les champs obligatoires portent l'astérisque rouge, les facultatifs « (facultatif) » (`FieldLabel`).
  L'en-tête est dans le `<form>` (`MemberFormHeader` : « Annuler », titre, « Enregistrer » sous `lg` ; dès `lg`,
  fil avec le nom du membre, « Annuler » et « Enregistrer les modifications ») et porte **les seuls boutons** :
  pas de rangée de boutons en bas du formulaire. L'alerte d'erreur serveur est donc posée sous l'en-tête.
  Les barres sont **collées en haut** (`sticky top-0 z-20`, fond opaque, comme un en-tête figé de tableur) pour que
  « Enregistrer » reste atteignable sur toute la longueur. Un `sticky` est borné par son parent : les barres sont
  des enfants directs du `<form>` (le fil web est donc hors de la barre, avec `-mb-5` pour annuler le `gap-5`) et
  débordent du `px-4 py-6` (mobile) ou du `px-12` (web) de `AppLayout` par des marges négatives. `src/index.css`
  pose `scroll-padding-top: 6rem` sur `html` : le champ focalisé (premier champ en erreur après « Enregistrer »)
  se cale sous la barre au lieu de passer dessous.
- **Modifier la fiche, données** : `schemas.ts` (`memberRecordSchema`) a la forme du corps du PUT (blocs
  `baptism`, `first_communion`, `confirmation`, `marriage` et `emergency_contact` imbriqués), pour que
  `applyServerErrors` pose les erreurs 422 à clés pointées (`baptism.date`) sous le bon champ. `record.ts` porte
  les valeurs de départ (`getMemberRecordDefaults`) et le corps du PUT (`toUpdateMemberInput`). Les **dates**
  restent du texte : le back lit `jj/mm/aaaa`, `mm/aaaa`, `aaaa` ou « Septembre 2019 », refuse le futur et exige
  un jour complet pour la naissance ; le front ne contrôle que la présence, l'erreur 422 s'affiche sous le champ.
  **Cliquer le champ de date** (`DateField` de `components/common/`, branché par `RecordDateField` de
  `member-record-sections.tsx`) ouvre `DatePickerDialog` (feuille en bas sur mobile, fenêtre centrée dès
  `md`) ; Entrée, Espace et la flèche du bas aussi (Entrée n'envoie donc pas le formulaire depuis ce champ).
  Le champ est en **lecture seule** (`readOnly`, `aria-haspopup="dialog"`, icône calendrier décorative) : on ne
  tape plus la date, le sélecteur écrit le champ. Le sélecteur a une **précision** à choisir : Année (liste des
  années), Mois (mois et année) ou Jour
  (calendrier du mois, lundi en premier, flèches de mois), et remplit le champ en `aaaa`, `mm/aaaa` ou
  `jj/mm/aaaa`. Un sélecteur natif `type="date"` n'a pas été retenu : il oblige à choisir un jour, alors que le
  back accepte `mm/aaaa` et `aaaa` (toutes les dates sauf la naissance). La naissance (`allowPartial={false}`)
  n'a pas de choix de précision : jour obligatoire. Bornes 1900 à aujourd'hui comme le back (jours, mois et
  années à venir désactivés). Le sélecteur s'ouvre sur la saisie du champ quand elle se lit (`parseDateInput` de
  `lib/dates.ts` : `12/03/1998`, `05/1998`, `2008`, « Septembre 2019 », « 15 août 2012 »). Une date **facultative** déjà saisie se vide depuis le sélecteur
  (bouton « Effacer la date », `onClear`) : le champ étant en lecture seule, c'est le seul moyen de la retirer.
  Pas de bibliothèque de calendrier ni de composant shadcn `calendar` : aucune dépendance ajoutée (listes
  déroulantes natives, `dark:scheme-dark` pour le thème sombre). Radix ne rend le focus qu'à un `DialogTrigger` :
  `DateField` passe `onCloseFocus` pour le rendre au champ.
  À l'ouverture, les dates de l'API (`1998-03-12`, `1998-05`, `2008`) sont converties en saisie
  (`toDisplayDate`). Un champ facultatif vide part en `null`. La clé `voice` n'est **jamais** envoyée. Le
  matricule est facultatif (le back l'accepte vide : « à laisser vide si vous résidez à l'étranger »), malgré
  l'astérisque de la maquette. Le contact d'urgence se choisit en pastilles (`ChoiceChips`, au moins un lien) :
  Parents, Famille, Tuteur/Tutrice, Ami(e) proche, plus les liens déjà dans la fiche (`getRelationshipOptions`).
  **Pas rendus** : l'email (lecture seule, celui du compte, le back ne l'accepte pas) et la photo (le back renvoie
  `picture_url` mais n'a pas de route de dépôt).
- **Téléphone** : tous les numéros passent par `lib/phone.ts` (bibliothèque `libphonenumber-js`, entrée
  `libphonenumber-js/min`) et sont envoyés **en E.164** (`+261341234567`), avec Madagascar par défaut
  (`DEFAULT_PHONE_COUNTRY`). `PhoneField` (`components/common/`) saisit **un** numéro : un sélecteur de pays (drapeau
  et indicatif, « 🇲🇬 +261 ») et le numéro national. La liste de pays est la liste native de l'appareil (tous les
  pays, avec Madagascar, France, La Réunion, Maurice et Comores en tête). Le drapeau est un **emoji** (`getFlag` :
  deux indicateurs régionaux Unicode, aucune dépendance) ; Windows n'a pas de police de drapeaux et affiche à la
  place les deux lettres du pays (« MG »). Un numéro international saisi ou collé (`+33 6 12 34 56 78`) change le
  pays tout seul ; le numéro national se met en forme à la sortie du champ. Le pays et le texte sont lus **une
  seule fois** à l'ouverture (état local) : la valeur ne change ensuite que par le champ.
- **Plusieurs numéros** : `PhoneListField` (`components/common/`) : une ligne par numéro (un `PhoneField` chacune),
  « Ajouter un numéro » et un bouton pour retirer une ligne dès qu'il y en a plusieurs. Il sert au **numéro du
  membre** (`phone` : carte Coordonnées du formulaire de la fiche et `ProfileForm` de `auth`) et au **contact
  d'urgence** (`emergency_contact.phone`, « Numéro(s) de téléphone à contacter »). La valeur du formulaire est la
  chaîne des numéros E.164 jointe par « / » (`+261341910929 / +33612345678`, `joinPhones`, lignes vides ignorées).
  Les limites suivent les colonnes du back, séparateurs compris : **30 caractères** pour `phone`
  (`user_profiles.phone`, `varchar(30)` : deux numéros malgaches, pas trois, donc `maxCount={2}`) et **50** pour le
  contact d'urgence (trois). `lib/phone-schema.ts` (`phonesSchema`) porte la règle des schémas Zod de `members` et
  `auth` : au moins un numéro, chacun valide pour son pays (`arePhonesValid`, « Numéro de téléphone invalide »),
  longueur maximale (« Trop de numéros »). Pour accepter trois numéros dans `phone`, il faut une migration et la
  règle `max` côté back, puis `PROFILE_PHONES_MAX_LENGTH` et `maxCount` côté front.
- **Anciens numéros et affichage** : les numéros déjà enregistrés (« 034 12 345 67 », « 0345621358 », plusieurs
  séparés par « / », « ; » ou une virgule) sont relus en E.164 à l'ouverture des formulaires (`splitPhones`,
  Madagascar par défaut) ; un numéro illisible reste tel quel, à corriger. L'affichage passe par `formatPhone` et
  `formatPhones` (« +261 34 12 345 67 ») : un numéro par ligne dans le tableau de la liste et dans le contact
  d'urgence de la fiche, une ligne par numéro dans Contacts, une seule ligne (séparée par
  « / ») dans la carte récapitulative de `auth`.
- **Back et téléphone** : le front envoie toujours de l'E.164. Sur sa branche actuelle, le back garde `phone` (30
  caractères) et le numéro du contact d'urgence (50) comme textes libres, sans validation ; une règle E.164
  (`E164PhonesRule`, numéros joints par « / ») a existé dans une version de travail du back : le front est
  compatible avec les deux. Dépendance ajoutée : `libphonenumber-js` (reconstruire le conteneur de dev, voir
  « Docker »).
- **`VoicePicker`** est dans `components/common/` (il servait à `auth`, il sert maintenant à `members`).
  Prop `layout` : `form` (grille de la fiche de recensement) ou `sheet` (une colonne avec pastille radio sous
  `md`, grille 2 x 2 dès `md`, légende en `sr-only`). Prop `compact` : toujours 2 colonnes en `form`, pour la
  carte Chorale du formulaire en deux colonnes (quatre tuiles y débordent).
- **Contacts** : téléphone = `profile.phone`, email = `profile.contact_mail` ou, à défaut, l'email du compte.
  Un membre peut avoir plusieurs numéros (`splitPhones`) : une ligne « Téléphone 1 », « Téléphone 2 ». Une valeur
  absente s'affiche « - ».
  **Copie au clic, aucun lien `tel:` ni `mailto:`** : le clic ne doit jamais ouvrir l'appli de messagerie ni celle
  d'appel (Zoom, par exemple) ; ne pas réintroduire de lien. Cliquer (ou toucher) le téléphone ou l'email copie la
  valeur dans le presse-papiers et ouvre une notification (« Numéro copié », « Adresse email copiée »). Le numéro
  copié est l'E.164 sans espaces, l'email tel quel. Dans `ContactRow` (prop `copy`), la valeur est un vrai
  `<button>` (nom accessible « Copier le numéro +261 34 12 345 67 », « Copier l'adresse {email} ») dont la zone
  couvre toute la ligne (`after:absolute after:inset-0`, ligne `relative`, comme le lien du tableau de la liste) ;
  l'icône du contact (`Phone`, `Mail`, pastille de 44 px, `aria-hidden`, prop `icon`) reste à droite, décorative :
  ce n'est pas un lien, un clic dessus copie aussi. Anneau de focus à l'intérieur de la ligne. L'adresse et le pseudo ne se copient pas (ni icône ni bouton).
  `lib/clipboard.ts` (`copyText`) utilise `navigator.clipboard` et, à défaut (page servie en
  http hors localhost, ancien navigateur), un repli par sélection (`execCommand('copy')`) ; si tout échoue, une
  notification d'erreur s'affiche.
- **Fiche en lecture seule** : `MemberDetail` affiche les mêmes six cartes que le formulaire, dans le même
  ordre et sur deux colonnes dès `lg` (`DetailsCard`, `DetailRows` et `DetailRow` de `member-detail-row.tsx` ;
  `member-record-details.tsx` pour Chorale, Paroisse et sacrements, Mariage et Contact en cas d'urgence).
  Identité (avec la naissance) et Contacts (avec l'adresse et le pseudo) gardent leurs fichiers. Écart avec le
  formulaire : la voix et son lien « Changer » restent dans Identité (ticket KAN-60), pas dans Chorale. Une
  valeur absente s'affiche « - » ; les retours à la ligne de l'adresse et des noms de contacts sont conservés ;
  les dates s'affichent comme dans le formulaire (`toDisplayDate`).
- **Vérifié contre le vrai back** (base de dev, compte admin, membre 28) à 390 px et 1440 px, en clair et en
  sombre : lecture de la fiche complète, formulaire pré-rempli, validation côté client (aucune requête), 422
  réel à clés pointées (`birth_date`, `baptism.date`) sous les bons champs, corps du PUT (sans `voice`, `null`
  pour les champs facultatifs vides). **Non vérifié** : un enregistrement réussi (200), le changement de voix et
  l'affichage de valeurs réelles, car les 27 membres de la base de dev ont une fiche incomplète (seuls nom,
  prénom, voix, téléphone et email sont remplis) : « Changer » y est masqué pour tous, et un enregistrement
  écrirait dans cette base.

## Ajout d'un membre

Route `/members/new` (`paths.memberNew`, `MemberCreatePage`), sous `RequireRole` (`admin`, `secretaire`) ; le
segment statique `new` passe avant `/members/:id`. Pas de maquette dédiée : c'est l'écran « Modifier la fiche »
(maquette 11) en mode création, champs vides. Entrée : bouton « Ajouter un membre » (`AddMemberLink`), seule
action pleine de l'en-tête de la liste : pleine largeur au-dessus d'« Importer » et « Exporter » sous `lg`, à
gauche des deux autres dès `lg` (emplacement non maquetté, choisi par défaut).

- **Back** : `POST /api/members` (`CreateMemberRequest`, 201, réponse au format de `GET /members/{id}`). Corps :
  `mail` et la fiche du PUT (mêmes champs, mêmes validations). Le compte est créé **actif et vérifié** (rôle
  membre) ; le mot de passe est généré (ni saisi ni renvoyé) et part dans un mail d'invitation (adresse et mot de
  passe, sans lien : la réinitialisation n'existe pas). `mail` est écrit en minuscules, unique sans tenir compte
  de la casse (422 sur `mail`) et ne change plus ensuite. 403 pour un autre rôle.
- **Composants partagés avec la modification** : `MemberRecordFields` (rappel « Champ obligatoire », alerte du
  serveur, six cartes) et `MemberFormHeader` (titre, fil de retour et libellés des boutons en props).
  `ContactSection` reçoit le champ email en `emailField` : lecture seule à la modification, saisi à l'ajout (avec
  l'indice « Le mot de passe de connexion est envoyé à cette adresse. Elle ne pourra plus être modifiée. »).
  `createMemberSchema` est `memberRecordSchema` plus `mail` (`trim`, email valide, 255 au plus) ;
  `getNewMemberDefaults()` donne la fiche vide (voix à choisir) et `toCreateMemberInput()` le corps du POST
  (sans `voice`).
- **Typage** : les deux formulaires (`MemberCreateForm`, `MemberProfileForm`) s'enveloppent dans un `FormProvider`
  et les cartes (`member-record-sections.tsx`, `MemberRecordFields`) lisent le formulaire par `useRecordForm()`
  (`hooks/use-record-form.ts`, un `useFormContext<MemberRecordInput>()`) : plus de prop `form`, plus de cast. Un
  `UseFormReturn` passé en prop est invariant (`watch`) et refuse un formulaire qui a un champ en plus, comme
  `mail` à l'ajout. Le type des valeurs est posé une seule fois dans le hook : React Hook Form ne vérifie pas que
  le provider le porte, c'est vrai parce que `createMemberSchema` étend `memberRecordSchema`. Les cartes ne
  lisent que des champs de la fiche ; un champ de compte se lit dans le formulaire parent (comme `mail`).
- **Après l'envoi** : toast « Membre ajouté. Une invitation va être envoyée à {mail}. » (le `mail` de la réponse,
  donc nettoyé et en minuscules), puis fiche du nouveau membre. Le message ne dit pas « envoyée » : le back met
  `MemberInvitationMail` en file d'attente (`ShouldQueue`), le 201 arrive avant l'envoi et le front ne sait pas
  si le mail est parti. `useCreateMember` (`networkMode: 'always'`) invalide `memberKeys.all` :
  la liste et ses effectifs sont rechargés à son retour. Le membre est actif : pas de badge « En attente ».
- **Erreurs** : une 422 est posée sous les champs par `applyServerErrors`, qui donne le **focus au premier champ**
  de la réponse (`shouldFocus` sur le premier `setError` seulement ; la page se cale sous la barre collée grâce à
  `scroll-padding-top`). Sur un long formulaire, une erreur hors de l'écran laisserait croire que le bouton ne fait
  rien : le plus probable est l'email déjà utilisé (« Cette adresse email est déjà utilisée. »), en haut du
  formulaire, mais une date ou un téléphone refusés par le back sont dans le même cas. Cela vaut pour tous les
  formulaires qui passent par `applyServerErrors` (un champ sans référence focalisable, comme les pastilles, ne
  bouge pas). Un 403 ouvre le toast « Vous n'avez pas le droit d'ajouter un membre. » (`isForbiddenError`), toute
  autre erreur le toast « Impossible d'ajouter le membre. Réessayez. ».
- **Vérifié contre le vrai back** (branche `feature/kan-89-add-member`, base de dev, compte secrétaire) à 390 px
  et 1440 px : création réussie (201, compte actif, fiche complète, dates partielles, téléphones E.164, mail
  d'invitation journalisé, aucun job en échec), validation client (18 messages, aucune requête), email en
  doublon avec une autre casse (422 sous le champ, focus), modification du membre créé (PUT sans `mail`), liste
  (effectif et voix à jour, pas de badge), compte `membre` refusé (403 du back, redirection du front). Le membre
  de test `kan90.test@scenarios.kantica.test` est resté dans la base de dev (le seeder
  `MemberReferenceSeeder` purge ce domaine).
- **Revérifié après la revue de la PR** (`FormProvider`, focus du premier champ en erreur, toast 403) à 390 px :
  email en doublon et 422 sur la date de naissance (focus et message visibles sous la barre collée, formulaire
  conservé), 403 d'un compte `membre` (toast dédié, aucune alerte de champ), modification d'une fiche (pré-remplie,
  422 simulée avec le même focus, PUT 200 réussi). Le membre de test `kan90.nonmail@scenarios.kantica.test` est
  resté dans la base de dev (domaine purgé par le seeder).

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

## Import de membres (Excel)

Routes `/members/import` (`paths.membersImport`, `ImportMembersPage`), `/members/import/review`
(`paths.membersImportReview`, `ImportReviewPage`) et `/members/import/:id` (`paths.membersImportReport`,
`ImportReportPage`, `getMembersImportReportPath(id)`), sous `RequireRole` (`admin`, `secretaire`). Le segment
statique `import` passe avant `/members/:id`. Maquettes `01-Lot1-Recensement/{mobile,web}/08-Import-membres-Excel`
et `09-Import-membres-verification`. Entrée : bouton « Importer (Excel) » (`ImportMembersLink`) à côté de
« Exporter » dans l'en-tête de la liste.

- **Back** (`/api/users/import`) : `GET /template` (modèle xlsx), `POST /preview` (multipart `file`, lecture seule,
  renvoie l'aperçu), `POST /` (202, import asynchrone en file d'attente), `GET /?page=` (historique, 20 par page) et
  `GET /{id}` (suivi, puis rapport). 403 pour un autre rôle, et pour l'import d'un autre utilisateur (sauf admin).
  Le champ `file_name` vient d'une migration (`php artisan migrate` avant de tester) ; sans elle, l'historique
  affiche « Import sans nom ».
- **Le fichier traverse deux écrans** : `ImportMembersLayout` (route sans chemin) porte le formulaire RHF
  (`importFileSchema`, champ `file`) et l'aperçu ; les pages les lisent par `useImportFlow()` (contexte de l'`Outlet`),
  car un `File` ne passe pas par l'URL. La vérification sans fichier ni aperçu (rechargement de la page) renvoie à
  `/members/import`. Le rapport est **hors du layout** : l'état du parcours est oublié en y arrivant.
- **Validation** : `.xlsx` et 5 Mo au plus côté client (message sous la zone de dépôt, bouton « Vérifier le
  fichier » désactivé tant que le schéma refuse le fichier). Le 422 du back (extension, taille, fichier illisible,
  colonnes manquantes, plus de 500 lignes) est posé sur `file` par `applyServerErrors` ; toute autre erreur ouvre un
  toast. Les mutations sont en `networkMode: 'always'`.
- **Barre d'actions** (`ImportActionBar`) : fixe au-dessus de la barre d'onglets sous `lg` (les pages ajoutent
  `pb-24` ou `pb-36`), rangée alignée à droite dès `lg`. Ses boutons sont hors du `<form>` et le soumettent par
  l'attribut `form`.
- **Vérification** : tuiles (prêts, à corriger, et « déjà présents » seulement s'il y en a : la maquette n'en montre
  pas), lignes à corriger et lignes ignorées (`ImportIssuesSection`, cartes ou tableau), puis les quatre premiers
  choristes prêts (`IMPORT_ROWS_VISIBLE`) et « et N autres choristes ». « Importer N membres » lance l'import et
  remplace l'écran par le rapport (`navigate` avec `replace`).
- **Suivi** : le rapport interroge `GET /{id}` toutes les 2 s (`IMPORT_POLL_INTERVAL_MS`) tant que le statut est
  `pending` ou `running`, avec une barre de progression (`ImportProgressCard`, écran absent des maquettes). À la fin,
  `memberKeys.all` et `memberImportKeys.lists()` sont invalidés (la liste et l'historique se mettent à jour). Un
  import `failed` affiche le `error` du back tel quel : il rappelle déjà que les membres déjà créés sont conservés
  (une transaction par ligne), le front n'y ajoute rien.
- **Rapport** : même présentation que la vérification, sans le bouton « Importer ». `report.imported[]` (`line`,
  `last_name`, `first_name`, `voice`, `mail`) manque aux rapports enregistrés avant son ajout : la section « Membres
  importés » est alors masquée. Les `warnings` du back ne sont pas affichés (point ouvert, la maquette n'en a pas).
- **Historique** (`ImportHistory`) : tableau dès `lg`, cartes en dessous (`useMediaQuery`), du plus récent au plus
  ancien, avec chargement, erreur, état vide et pagination (`MembersPagination`). Il suit les imports en cours.
  Le statut vient de `getImportOutcome` (`imports.ts`) : En cours (`pending`, `running`), Échec (`failed`, ou terminé
  sans aucun membre créé et avec des erreurs), Partiel (terminé avec des erreurs), sinon Terminé. « Lignes » est
  `summary.total`.
- **Écarts avec les maquettes** : la carte du fichier choisi affiche sa taille (« 5 Ko ») et non « 42 lignes »
  (le nombre de lignes n'est connu qu'après l'aperçu) ; seul `.xlsx` est annoncé ; sous `lg`, la barre d'actions
  est posée au-dessus de la barre d'onglets, que la maquette n'a pas ; l'écran de progression et la tuile « déjà
  présents » sont ajoutés.
- **Vérifié** contre un faux back qui reprend la forme des Resources (390 px et 1440 px, clair et sombre) : choix du
  fichier, aperçu, 422, `.pdf` et 6 Mo refusés, import avec progression, rapport, historique (quatre statuts),
  403 et 404. **Non vérifié contre le vrai back** : un aperçu et un import réels d'un fichier Excel (aucun compte
  admin ou secrétaire connu dans la base de dev, migration `file_name` non jouée).

---

## Profil

Route `/profile` (`paths.profile`, `ProfilePage` de `features/profile`), maquettes
`06-Administration-et-navigation/{mobile,web}/03-Profil`.

- **Carte d'identité** (`ProfileIdentityCard`) : initiales, nom (fiche, sinon compte), badges de voix et de rôle ;
  dès `lg`, email et téléphones à droite (« email · +261 … »).
- **Sections** (`ProfileSection`, titre au-dessus de la carte sous `lg`, dans la carte dès `lg` ; trois colonnes
  dès `lg`) : Présence (« Mon historique de présence », « Saisir les présences ») et Vie de la chorale
  (« Événements », « Paiements ») sont des lignes « Bientôt » sans lien (`ProfileSoonRow`) : leurs écrans
  n'existent pas. Qui verra « Saisir les présences » reste à définir avec le lot 4. Réglages : « Mode sombre »
  (`ThemeSwitch`, `role="switch"`). **« Gestion des rôles » n'est pas dans le Profil** malgré la maquette : c'est
  une fonction d'admin, rangée dans Membres (décision du 26 novembre 2026).
- **Se déconnecter** : en haut à droite dès `lg`, pleine largeur en bas sous `lg` (deux montages, un seul visible).
- Écarts avec les maquettes : pas de flèche de retour sur mobile (Profil est un onglet, faute d'écran Accueil) ;
  pas de lien « Modifier ma fiche » (absent de la maquette, voir KAN-59).

## Gestion des rôles

Route `/members/roles` (`paths.memberRoles`, `RolesPage` de `features/members`), sous `RequireRole` (`admin`) ; le
segment fixe `roles` passe avant `/members/:id`. Maquettes `06-Administration-et-navigation/{mobile,web}/01-Gestion-roles`.
Entrée : bouton « Gestion des rôles » (`MemberRolesLink`) dans l'en-tête de la liste des membres, à côté
d'« Exporter », **affiché pour l'admin seulement** (emplacement non maquetté : la maquette le met dans Profil >
Réglages). Retour : « Membres ». Le code est dans `features/members` (API `getUsers`, `assignUserRole`, clés
`userRoleKeys`) pour que la fiche membre s'en serve sans dépendance entre features.

- **Back** (KAN-35) : `GET /api/users?search=&page=` (admin, 20 par page, recherche par nom, prénom ou email
  sans accents ; `meta.role_counts` hors recherche ; le compte administrateur originel n'y figure pas) et
  `PUT /api/users/{id}/role` avec `{ role }` (un seul rôle ; 422 sur `role` pour le dernier admin et pour le
  compte originel). Types calqués sur `UserRoleResource` (`UserRoleItem`, `role` null pour un compte sans rôle).
- **Deux mises en page**, une seule montée (`useMediaQuery`) : tableau dès `lg` (Utilisateur, Email, Rôle ; le
  rôle se choisit dans la ligne, contrôle segmenté) ; lignes sous `lg` avec badge du rôle, un appui déplie
  « Rôle de {prénom} » et trois boutons (une ligne dépliée à la fois). `RolePicker` : groupe nommé, boutons
  `aria-pressed` ; tous les choix sont désactivés tant qu'un changement est en cours d'envoi. Badges de rôle et
  « Bientôt » en 16 px (`text-base`).
- **Compteur** « 1 admin · 2 secrétaires · 10 membres » (`getRoleCountsLabel`) et recherche « Nom ou email »
  retardée (`useUsersFilters`, même motif que `useMembersFilters` : page remise à 1 à chaque nouvelle recherche,
  même quand elle revient à une valeur déjà vue). Pagination `ListPagination` ; le back refuse une page au-delà de
  100 000 (422). Page devenue trop grande : `usePageInRange` ramène à la dernière page, et `UsersResults` affiche
  « Chargement des comptes… » pendant la correction ; vérifié contre le vrai back à 390 px en sombre (comptes
  supprimés pendant la lecture de la page 1, puis « Suivant » : retour en page 1).
- **Changement de rôle** (`useRoleChange`) : toast « {Nom} : Secrétaire. » ; erreurs par `getRoleErrorMessage`
  (`utils.ts`) : 422 avec la raison du back (`getValidationMessage`), 403 « Seul un admin peut changer les rôles. ».
  `useAssignUserRole` invalide la liste des rôles, `memberKeys.all` (ligne « Rôle » de la fiche) et `me` : un admin
  qui se retire le rôle perd l'accès (le guard le renvoie à l'accueil).
- **Ligne « Rôle » de la fiche membre** (carte Identité, sous la voix) : le rôle (`roles` de `GET /api/members/{id}`)
  est lu par la secrétaire et l'admin ; le lien « Changer » (`ChangeRoleDialog`, feuille « Attribuer le rôle » sur
  le modèle de la voix, `RolePicker` en trois boutons) n'est monté que pour l'admin (`RoleGuard`).
- **Vérifié contre le vrai back** (branches `feature/kan-35-manage-roles` et `feature/kan-63-manage-roles`, jeu
  `MemberReferenceSeeder`) à 1440 px en clair et 375 px en sombre : Profil (admin et compte technique),
  déconnexion web et mobile, liste et compteur, recherche sans accent, changement de rôle aller et retour (web et
  mobile), refus réel du dernier admin (rôle Admin retiré puis rendu au compte technique en base), interrupteur
  « Mode sombre ». Après le déplacement dans Membres : bouton visible pour l'admin (web et mobile), absent pour la
  secrétaire, `/members/roles` la renvoie à l'accueil ; fiche membre : « Rôle : Admin » sans « Changer » pour la
  secrétaire, changement aller et retour depuis la fiche pour l'admin ; plus de lien dans le Profil. Pagination
  vérifiée ensuite (branches `fix/listes-pagination`, 39 comptes dont 25 temporaires, 1440 px en clair et 390 px en
  sombre) : page 2 de « page », recherche effacée puis retapée, retour en page 1 (l'ancien hook rendait la page 2).
  **Non vérifié** à l'écran : le 403.

## Répertoire

Route `/songs` (`paths.songs`, `SongsListPage` de `features/songs`) : premier onglet et page d'accueil après la connexion,
pour tous les rôles. Maquettes `03-Repertoire-et-voix/{mobile,web}/01-Repertoire`, ticket KAN-18 (US-04).

- **Back** (KAN-18) : `GET /api/songs?search=&page=`, 20 cantiques par page triés par titre (sans casse ni accents),
  recherche dans le titre et l'auteur. Lignes au format de `SongListItemResource` (type `SongListItem` : `id`,
  `title`, `author`, `reference`, ce que la liste affiche ; le cantique complet sera lu par la fiche) ;
  `meta.songs_count` (« 13 cantiques ») porte sur tout le répertoire, `meta.total` suit la recherche.
- **En-tête** : « Répertoire », « N cantiques », et le bouton « + Ajouter » sous `lg`, « + Ajouter un cantique » dès `lg`
  (un seul lien, nom accessible « Ajouter un cantique » : la fin du libellé est en `max-lg:sr-only`). Bouton **réservé à
  l'admin** (`RoleGuard`, KAN-13) ; il mène à `/songs/new` (`paths.songNew`, sous `RequireRole` admin), un
  `<ComingSoon />` en attendant l'écran de KAN-13.
- **Recherche** « Titre ou auteur » : `SearchField` de `components/common/` (aussi utilisé par les membres et la gestion
  des rôles), retardée. Chaque nouvelle recherche ramène à la page 1, même quand elle revient à une valeur déjà vue
  (« a » en page 3, effacée, puis « a » de nouveau) : `useSongsFilters` garde la recherche pour laquelle la page a été
  choisie et remet la page à 1 pendant le rendu quand elle change (motif React « ajuster un état quand une valeur
  change », accepté par les règles des hooks), sans effet ni requête pour l'ancienne page. `useMembersFilters` et
  `useUsersFilters` suivent le même motif.
- **Page devenue trop grande** (relevé par la revue de KAN-18) : si des cantiques disparaissent pendant qu'on est en
  page 3, le back répond `data: []` avec `current_page > last_page`. `usePageInRange` (`hooks/`, générique) ramène
  alors la page à la dernière pendant le rendu de `SongsListPage`, et `SongsResults` affiche « Chargement du
  répertoire… » le temps que cette page arrive, au lieu d'un faux « Aucun cantique ». Ce chargement ne s'affiche que
  dans le cas corrigé (`isPageOutOfRange` : dernière page d'au moins 1 et dépassée) ; toute autre liste vide, même
  incohérente, montre le message de liste vide : jamais de chargement sans fin (deuxième revue de KAN-18). Les listes
  des membres et des rôles l'utilisent aussi. Cas typique : des cantiques supprimés pendant qu'on lit la page 1, puis
  « Suivant » vers une page 2 qui n'existe plus. La page 1 réaffichée vient du cache :
  son compteur peut dater de 30 s au plus (`staleTime`), jusqu'à son prochain rechargement. **Vérifié contre le vrai
  back** (28 cantiques dont 15 temporaires, 10 supprimés par l'API avec le compte admin, puis « Suivant ») à 1440 px
  en clair et 390 px en sombre : retour en page 1, ni « Aucun cantique » ni écran bloqué. Le rechargement au retour du
  réseau n'a pas pu être simulé dans le navigateur intégré.
- **Deux mises en page**, une seule montée (`useMediaQuery`) : lignes sous `lg` (titre en Cormorant Garamond, auteur en
  dessous, chevron ; séparateurs d'un bord à l'autre de l'écran par `-mx-4`) ; tableau dès `lg` (Titre, Auteur, Réf.,
  chevron ; le lien du titre couvre la ligne, et son `::after` porte l'anneau de focus clavier, `ring-3` comme les lignes
  mobiles, vérifié à 1440 px ; le tableau des membres n'a encore que le fond grisé). Un auteur ou une référence absents
  s'affichent « - » dans le tableau ;
  sous `lg`, la ligne de l'auteur est omise. Un titre trop long passe à la ligne, même sans espace (`wrap-anywhere`, qui
  laisse aussi la colonne du tableau se resserrer). Une ligne ouvre `/songs/:id` (`getSongPath`), un `<ComingSoon />`
  « Fiche du cantique » en attendant KAN-25 (l'onglet Répertoire reste actif). Pagination `ListPagination`, états
  chargement, liste vide (message différent pendant une recherche) et erreur : « Impossible de charger le répertoire. »
  avec « Réessayer », ou, pour un 403 (compte sans rôle), « Votre compte n'a pas accès au répertoire. » sans bouton.
- `useSongs` est en `networkMode: 'always'` : hors ligne, le mode par défaut met la requête en pause et la page d'accueil
  resterait sur « Chargement du répertoire… » ; ici la requête échoue et l'erreur s'affiche avec « Réessayer ».
- **Mesures relevées sur les PNG des maquettes** (largeur des textes, position des séparateurs) : titre de page de 36 px
  sur les deux maquettes, compteur de 16 px, titres des cantiques de 20 px, lignes de 70 px (mobile) et 53 px (web), bouton
  de 44 px aligné sur le bas du bloc titre. Le tableau web reprend les classes de celui des membres. En-têtes de
  colonnes en `text-xs`, capitales espacées : la maquette web les dessine en capitales de 8,5 px de haut (17 px sur le
  PNG @2x), soit du 12 à 13 px ; la règle des 16 px vise le texte courant, pas ces libellés.
- **Écarts avec les maquettes** : pas encore de thème (pastilles de filtre « Tous, Avent, Noël… », pastille de couleur après
  l'auteur, colonne Thème) : il arrive avec KAN-23, dont le modèle n'est pas tranché ; « Venez, divin Messie » passe avant
  « Veni Creator Spiritus » (ordre alphabétique strict, la maquette les inverse). La recherche n'est pas gardée dans l'URL :
  elle est perdue au retour de la fiche, comme pour la liste des membres.
- **Vérifié contre le vrai back** (branches `feature/kan-18-repertoire`, base de dev, `SongReferenceSeeder`) à 1440 px et
  390 px, en clair et en sombre : liste et compteur, recherche (sans accent, en majuscules, mots du titre et de l'auteur),
  liste vide, une seule requête par recherche, ligne vers la fiche, bouton « + Ajouter » pour l'admin et absent pour un
  membre (`/songs/new` le renvoie au répertoire), pagination (10 cantiques temporaires ajoutés puis supprimés). La
  recherche des Membres et de la Gestion des rôles a été revérifiée après le passage à `SearchField`. Après la revue :
  retour en page 1 quand une recherche revient (« zz » en page 2, effacée puis retapée), titre de 98 caractères sans
  espace (trois lignes à 390 px, deux dans le tableau à 1440 px, sans défilement), vrai 403 d'un compte sans rôle (rôle
  retiré puis rendu au compte `membre@scenarios.kantica.test`), « Membre introuvable » toujours affiché après le passage à
  `lib/api-errors.ts`. **Non vérifié** à l'écran : le hors-ligne (`networkMode: 'always'`).

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

### Préprod Railway

Le service `kantica-front` du projet Railway `kantica` (environnement `preprod`) se construit avec
`Dockerfile.railway`, pas avec le `Dockerfile` racine, et suit la branche `develop`.

- `nginx.railway.conf` reprend `nginx.conf` : **toute modification de l'un est à reporter dans l'autre**. Seul le
  proxy de l'API diffère : le back est résolu à chaque requête (`resolver` + variable), car son adresse privée
  change à chaque déploiement, et les en-têtes `X-Forwarded-Proto` / `X-Real-IP` reçus de Railway sont retransmis.
- `API_UPSTREAM` pointe sur le réseau privé : `http://<domaine privé du back>:8080`.
- Pas de montage de cache npm dans ce Dockerfile : Railway impose un identifiant de cache par service.

Vérifié en local (image construite, SPA servie, connexion à travers le proxy, reprise après redémarrage du back).

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
- **Taille du bundle** : un seul chunk d'environ 560 kB (175 kB gzip) avant `libphonenumber-js/min`, qui y ajoute environ 170 kB
  (33 kB gzip, mesuré isolément). Découper par route (`lazy`) quand les
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
   - [x] KAN-60 : fiche membre (identité, contacts, validation d'un compte en attente, changement de voix,
     modification de la fiche ; voir « Fiche membre »)
   - [x] KAN-62 : import Excel (modèle, envoi, vérification, rapport, historique ; voir « Import de membres
     (Excel) »)
   - [x] KAN-90 : ajout d'un membre (formulaire de la fiche en mode création, invitation par mail ; voir
     « Ajout d'un membre »)
   - [x] KAN-64 (Lot 2, US-10) : attribution de la voix par la route dédiée, même sur une fiche incomplète
     (voir « Fiche membre », « Attribution de la voix »)
4. Lot 2
   - [x] KAN-63 : écran Profil (maquette 06-Profil), « Gestion des rôles » dans Membres et ligne « Rôle » de la
     fiche (voir « Profil », « Gestion des rôles »)
   - [x] KAN-18 : répertoire (liste, recherche « Titre ou auteur », pagination, « + Ajouter » pour l'admin ; voir
     « Répertoire »)
   - [ ] KAN-18 : pastilles de thème (filtres, couleur, colonne Thème), avec KAN-23
   - [ ] KAN-25 : fiche du cantique (`/songs/:id`, « Bientôt » pour l'instant)
