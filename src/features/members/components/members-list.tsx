import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

import { VoiceBadge } from '@/components/common/voice-badge';
import { LG_MEDIA_QUERY, useMediaQuery } from '@/hooks/use-media-query';
import { getInitials } from '@/lib/names';
import { getMemberPath } from '@/lib/paths';
import { cn } from '@/lib/utils';

import { useMemberContact } from '../hooks/use-member-contact';
import type { MemberListItem } from '../types';

// Valeur affichée quand une coordonnée n'est pas renseignée (ou illisible).
const EMPTY_VALUE = '-';

type MemberProps = {
  member: MemberListItem;
};

// 44 px sur mobile, 36 px dans le tableau web (`className`), comme les maquettes.
function Avatar({ member, className }: MemberProps & { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'flex size-11 shrink-0 items-center justify-center rounded-full',
        'bg-muted text-sm font-bold text-muted-foreground ring-1 ring-border',
        className,
      )}
    >
      {getInitials(member)}
    </span>
  );
}

// « NOM Prénom » : le nom en gras et en majuscules, comme sur la maquette.
function MemberName({ member }: MemberProps) {
  return (
    <>
      <span className="font-bold uppercase">{member.last_name}</span>
      {member.first_name ? ` ${member.first_name}` : null}
    </>
  );
}

function PendingBadge() {
  return (
    <span className="inline-flex shrink-0 items-center rounded-lg bg-warning px-3 py-1 text-sm font-semibold text-warning-foreground">
      En attente
    </span>
  );
}

// Chevron de fin de ligne (maquettes mobile et web) : décoratif, le lien porte
// le nom accessible.
function RowChevron({ className }: { className?: string }) {
  return (
    <ChevronRight
      aria-hidden
      className={cn('size-5 shrink-0 text-muted-foreground', className)}
    />
  );
}

// Mise en page mobile (sous `lg`) : lignes empilées, sans coordonnées. Toute
// la ligne est un lien vers la fiche du membre.
function MembersRows({ members }: MembersListProps) {
  return (
    <ul className="divide-y">
      {members.map((member) => (
        <li key={member.id}>
          <Link
            to={getMemberPath(member.id)}
            className="flex items-center gap-4 rounded-lg py-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Avatar member={member} />
            <div className="min-w-0 flex-1 space-y-1.5">
              <p className="text-base">
                <MemberName member={member} />
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <VoiceBadge voice={member.voice_group} />
                {member.status === 'pending' ? <PendingBadge /> : null}
              </div>
            </div>
            <RowChevron />
          </Link>
        </li>
      ))}
    </ul>
  );
}

function ContactSkeleton({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={cn('block h-4 animate-pulse rounded bg-muted', className)}
    />
  );
}

// Cellules Téléphone et Email d'une ligne. La liste du back ne renvoie pas
// ces champs : ils viennent de la fiche du membre (`useMemberContact`).
function ContactCells({ id }: { id: number }) {
  const { data, isPending } = useMemberContact(id);

  if (isPending) {
    return (
      <>
        <td className="px-5 py-3">
          <ContactSkeleton className="w-28" />
        </td>
        <td className="px-5 py-3">
          <ContactSkeleton className="w-44" />
        </td>
      </>
    );
  }

  return (
    <>
      <td className="px-5 py-3 whitespace-nowrap">
        {data?.phone ?? EMPTY_VALUE}
      </td>
      <td className="px-5 py-3 whitespace-nowrap">
        {data?.mail ?? EMPTY_VALUE}
      </td>
    </>
  );
}

// Mise en page web (dès `lg`, maquette web 05-Liste-membres) : colonnes Nom,
// Voix, Téléphone, Email et Statut, puis le chevron. Téléphone et Email ne se
// coupent jamais : quand la largeur manque (autour de 1024 px), le tableau
// défile dans sa carte. Le lien est sur le nom et couvre toute la ligne
// (`after:absolute after:inset-0`, la ligne est `relative`).
function MembersTable({ members }: MembersListProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-card">
      <table className="w-full text-left text-base">
        <thead>
          <tr className="border-b text-xs font-bold tracking-wider text-muted-foreground uppercase">
            <th scope="col" className="px-5 py-4">
              Nom
            </th>
            <th scope="col" className="px-5 py-4">
              Voix
            </th>
            <th scope="col" className="px-5 py-4">
              Téléphone
            </th>
            <th scope="col" className="px-5 py-4">
              Email
            </th>
            <th scope="col" className="px-5 py-4">
              Statut
            </th>
            <th scope="col" className="w-14 px-5 py-4">
              <span className="sr-only">Fiche</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {members.map((member) => (
            <tr
              key={member.id}
              className="relative transition-colors hover:bg-muted/50 has-focus-visible:bg-muted/50"
            >
              <td className="px-5 py-3">
                <div className="flex items-center gap-4">
                  <Avatar member={member} className="size-9 text-xs" />
                  <Link
                    to={getMemberPath(member.id)}
                    className="outline-none after:absolute after:inset-0"
                  >
                    <MemberName member={member} />
                  </Link>
                </div>
              </td>
              <td className="px-5 py-3">
                <VoiceBadge voice={member.voice_group} />
              </td>
              <ContactCells id={member.id} />
              <td className="px-5 py-3">
                {member.status === 'pending' ? (
                  <PendingBadge />
                ) : (
                  <span className="text-muted-foreground">Actif</span>
                )}
              </td>
              <td className="px-5 py-3">
                <RowChevron className="ml-auto" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type MembersListProps = {
  members: MemberListItem[];
};

// Liste des membres : une seule des deux mises en page est montée, selon la
// bascule `lg` du layout (barre latérale ou barre d'onglets). Le tableau web
// charge les coordonnées de chaque membre : le monter sous `lg` enverrait ces
// requêtes pour rien.
export function MembersList({ members }: MembersListProps) {
  const isWeb = useMediaQuery(LG_MEDIA_QUERY);

  return isWeb ? (
    <MembersTable members={members} />
  ) : (
    <MembersRows members={members} />
  );
}
