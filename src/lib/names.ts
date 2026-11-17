// Prénom et nom d'une personne : un profil (`MemberProfile`) ou une ligne de la
// liste des membres (`MemberListItem`) en ont la même forme.
type NameParts = {
  first_name: string | null;
  last_name: string | null;
};

export function getFullName(person: NameParts): string {
  return [person.first_name, person.last_name].filter(Boolean).join(' ');
}

// Initiales d'avatar : première lettre du prénom puis du nom (« HR »).
export function getInitials(person: NameParts): string {
  return [
    person.first_name?.trim().charAt(0),
    person.last_name?.trim().charAt(0),
  ]
    .filter(Boolean)
    .join('')
    .toUpperCase();
}
