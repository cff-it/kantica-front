import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { applyServerErrors } from '@/lib/form-errors';
import { getFullName } from '@/lib/names';
import { getMemberPath } from '@/lib/paths';
import type { User } from '@/types';

import { useUpdateMember } from '../hooks/use-update-member';
import {
  getMemberRecordDefaults,
  getRelationshipOptions,
  toUpdateMemberInput,
} from '../record';
import { memberRecordSchema, type MemberRecordInput } from '../schemas';
import { getMemberName } from '../utils';
import { MemberEditHeader } from './member-edit-header';
import {
  ChoirSection,
  ContactSection,
  EmergencySection,
  IdentitySection,
  MarriageSection,
  ParishSection,
} from './member-record-sections';

type MemberProfileFormProps = {
  member: User;
};

// Formulaire « Modifier la fiche » d'un membre (maquette
// 11-Modification-fiche-membre) : la fiche de recensement complète, pré-remplie,
// enregistrée d'un bloc par `PUT /members/{id}`. Six cartes, rangées en deux
// colonnes dès `lg` (Identité, Coordonnées et Chorale à gauche ; Paroisse et
// sacrements, Mariage et Contact en cas d'urgence à droite), empilées dans
// l'ordre de la maquette en dessous. Ne sont pas saisis : l'email (celui du
// compte, en lecture seule) et la photo (le back ne la modifie pas ici).
export function MemberProfileForm({ member }: MemberProfileFormProps) {
  const navigate = useNavigate();
  const updateMember = useUpdateMember();
  const { profile } = member;
  const returnTo = getMemberPath(member.id);
  const form = useForm<MemberRecordInput>({
    resolver: zodResolver(memberRecordSchema),
    defaultValues: getMemberRecordDefaults(member),
  });
  const { errors } = form.formState;

  const onSubmit = form.handleSubmit((values) => {
    updateMember.mutate(
      { id: member.id, input: toUpdateMemberInput(values) },
      {
        onSuccess: () => {
          toast.success('Fiche enregistrée.');
          void navigate(returnTo);
        },
        onError: (error) => {
          if (!applyServerErrors(error, form.setError)) {
            toast.error('Impossible d\'enregistrer la fiche. Réessayez.');
          }
        },
      },
    );
  });

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <MemberEditHeader
        memberId={member.id}
        fullName={getFullName(getMemberName(member))}
        pending={updateMember.isPending}
        onCancel={() => void navigate(returnTo)}
      />
      <p className="text-sm text-muted-foreground">
        <span aria-hidden className="text-destructive">
          *
        </span>{' '}
        Champ obligatoire
      </p>
      {errors.root?.server ? (
        <p role="alert" className="text-sm text-destructive">
          {errors.root.server.message}
        </p>
      ) : null}
      <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-5">
          <IdentitySection form={form} />
          <ContactSection
            form={form}
            email={profile?.contact_mail ?? member.mail}
          />
          <ChoirSection form={form} />
        </div>
        <div className="flex flex-col gap-5">
          <ParishSection form={form} />
          <MarriageSection form={form} />
          <EmergencySection
            form={form}
            relationshipOptions={getRelationshipOptions(
              profile?.emergency_contact?.relationships,
            )}
          />
        </div>
      </div>
    </form>
  );
}
