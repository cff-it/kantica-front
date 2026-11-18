import { Mail, Phone, type LucideIcon } from 'lucide-react';
import { useId } from 'react';
import { toast } from 'sonner';

import { copyText } from '@/lib/clipboard';
import { formatPhone, splitPhones } from '@/lib/phone';
import { cn } from '@/lib/utils';
import type { User } from '@/types';

// Valeur affichée quand une coordonnée n'est pas renseignée.
const EMPTY_VALUE = '-';

type ContactCopy = {
  // Texte copié : l'E.164 pour un numéro (sans espaces, collable partout).
  value: string;
  // Nom accessible du bouton : il reprend la valeur affichée.
  label: string;
  // Notification de réussite.
  message: string;
};

// Copie le texte puis prévient l'utilisateur : le presse-papiers n'a aucun
// retour visible par lui-même.
async function copyWithToast(copy: ContactCopy) {
  if (await copyText(copy.value)) {
    toast.success(copy.message);
  } else {
    toast.error('Copie impossible sur cet appareil.');
  }
}

type ContactRowProps = {
  label: string;
  value: string | null;
  // Copie au clic, avec une notification : la ligne entière est cliquable.
  // Absent pour une valeur qui ne se copie pas (adresse, pseudo).
  copy?: ContactCopy;
  // Icône du contact (téléphone, enveloppe), décorative : pas un lien.
  icon?: LucideIcon;
};

function ContactRow({ label, value, copy, icon: Icon }: ContactRowProps) {
  const copyable = Boolean(copy && value);

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 px-5 py-3',
        copyable && 'relative transition-colors hover:bg-muted/50',
      )}
    >
      <div className="min-w-0">
        <dt className="text-sm text-muted-foreground">{label}</dt>
        <dd className="text-base font-medium break-words whitespace-pre-line">
          {copy && value ? (
            <button
              type="button"
              aria-label={copy.label}
              onClick={() => void copyWithToast(copy)}
              className="cursor-pointer text-left break-words whitespace-pre-line outline-none after:absolute after:inset-0 focus-visible:after:ring-3 focus-visible:after:ring-inset focus-visible:after:ring-ring/50"
            >
              {value}
            </button>
          ) : (
            value || EMPTY_VALUE
          )}
        </dd>
      </div>
      {copyable && Icon ? (
        // Décoratif : le bouton de la valeur couvre toute la ligne.
        <span
          aria-hidden
          className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-link"
        >
          <Icon className="size-5" />
        </span>
      ) : null}
    </div>
  );
}

type MemberContactsCardProps = {
  member: User;
};

// Bloc « Contacts » de la fiche : le téléphone et l'email se copient au clic
// (notification « copié »). Aucun lien `tel:` ni `mailto:` : ils ouvriraient
// l'appli d'appel (Zoom, par exemple) ou la messagerie. L'email de contact est
// celui du compte.
export function MemberContactsCard({ member }: MemberContactsCardProps) {
  const headingId = useId();
  // Un membre peut avoir plusieurs numéros : une ligne chacun.
  const phones = splitPhones(member.profile?.phone);
  const mail = member.profile?.contact_mail ?? member.mail;

  return (
    <section aria-labelledby={headingId}>
      <h2
        id={headingId}
        className="mb-3 font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase"
      >
        Contacts
      </h2>
      <dl className="divide-y overflow-hidden rounded-2xl border bg-card">
        {phones.length > 0 ? (
          phones.map((phone, index) => (
            <ContactRow
              key={`${index}-${phone}`}
              label={phones.length > 1 ? `Téléphone ${index + 1}` : 'Téléphone'}
              value={formatPhone(phone)}
              icon={Phone}
              copy={{
                value: phone,
                label: `Copier le numéro ${formatPhone(phone)}`,
                message: 'Numéro copié',
              }}
            />
          ))
        ) : (
          <ContactRow label="Téléphone" value={null} />
        )}
        <ContactRow
          label="Email"
          value={mail}
          icon={Mail}
          copy={
            mail
              ? {
                  value: mail,
                  label: `Copier l'adresse ${mail}`,
                  message: 'Adresse email copiée',
                }
              : undefined
          }
        />
        <ContactRow label="Adresse" value={member.profile?.address ?? null} />
        <ContactRow
          label="Pseudo sur Facebook ou Messenger"
          value={member.profile?.social_pseudo ?? null}
        />
      </dl>
    </section>
  );
}
