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

// MemberProfileResource : fiche de recensement.
export type MemberProfile = {
  last_name: string;
  first_name: string | null;
  voice_group: string | null;
  voice: string | null;
  phone: string | null;
  contact_mail: string;
  completed: boolean;
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
