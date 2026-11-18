// Calqués sur UserResource et MemberProfileResource (kantica-back).
// Les champs restent en snake_case, comme renvoyés par l'API.

// Valeurs de l'enum RoleName du back.
export type Role = 'admin' | 'secretaire' | 'membre';

// Valeurs de l'enum UserStatus du back.
export type UserStatus = 'pending' | 'active';

export type Firstname = {
  first_name: string;
  order: number;
  default: boolean;
};

// Sacrement (baptême, première communion, confirmation) : date et lieu. Les
// dates de la fiche sont écrites `1998-03-12`, `1998-05` ou `2008` selon ce
// qui est connu (jour, mois ou année seulement).
export type MemberSacrament = {
  date: string | null;
  place: string | null;
};

export type MemberMarriage = {
  spouse: string | null;
  date: string | null;
  place: string | null;
};

// Un seul bloc de contact en cas d'urgence ; `relationships` : Parents,
// Famille, Tuteur/Tutrice, Ami(e) proche...
export type MemberEmergencyContact = {
  relationships: string[];
  name: string | null;
  phone: string | null;
};

// MemberProfileResource : fiche de recensement. La fiche complète (à partir de
// `birth_date`) n'est renvoyée que par `GET` et `PUT /api/members/{id}` ;
// ailleurs (`GET /api/me`...), seule la fiche courte est présente.
export type MemberProfile = {
  last_name: string;
  first_name: string | null;
  voice_group: string | null;
  voice: string | null;
  phone: string | null;
  contact_mail: string;
  completed: boolean;
  birth_date?: string | null;
  birth_place?: string | null;
  address?: string | null;
  social_pseudo?: string | null;
  region_registration_number?: string | null;
  picture_url?: string | null;
  adhesion_date?: string | null;
  engagement_date?: string | null;
  engagement_place?: string | null;
  baptism?: MemberSacrament;
  first_communion?: MemberSacrament;
  confirmation?: MemberSacrament;
  marriage?: MemberMarriage;
  emergency_contact?: MemberEmergencyContact;
};

// UserResource. Les relations ne sont présentes que si le back les a
// chargées (`whenLoaded`) : c'est le cas pour `GET /api/me`.
export type User = {
  id: number;
  mail: string;
  last_name: string;
  nick_name: string | null;
  status: UserStatus;
  email_verified: boolean;
  firstnames?: Firstname[];
  roles?: Role[];
  profile?: MemberProfile;
  created_at: string;
};
