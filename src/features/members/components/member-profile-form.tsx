import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { FormField } from '@/components/common/form-field';
import { applyServerErrors } from '@/lib/form-errors';
import { getFullName } from '@/lib/names';
import { getMemberPath } from '@/lib/paths';
import type { User } from '@/types';

import { useUpdateMember } from '../hooks/use-update-member';
import { getMemberRecordDefaults, toUpdateMemberInput } from '../record';
import { memberRecordSchema, type MemberRecordInput } from '../schemas';
import { getMemberName } from '../utils';
import { MemberFormHeader } from './member-form-header';
import { MemberRecordFields } from './member-record-fields';

type MemberProfileFormProps = {
  member: User;
};

// Formulaire « Modifier la fiche » d'un membre (maquette
// 11-Modification-fiche-membre) : la fiche de recensement complète, pré-remplie,
// enregistrée d'un bloc par `PUT /members/{id}`. Les six cartes sont celles de
// `MemberRecordFields`, partagées avec « Ajouter un membre », qui lisent le
// formulaire par le `FormProvider`. Ne sont pas saisis : l'email (celui du
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
    <FormProvider {...form}>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <MemberFormHeader
          title="Modifier la fiche"
          backTo={returnTo}
          backLabel={getFullName(getMemberName(member))}
          submitLabel="Enregistrer les modifications"
          submitShortLabel="Enregistrer"
          pending={updateMember.isPending}
          onCancel={() => void navigate(returnTo)}
        />
        <MemberRecordFields
          emailField={
            <FormField
              label="Adresse e-mail"
              type="email"
              required
              value={profile?.contact_mail ?? member.mail}
              readOnly
              className="bg-muted text-muted-foreground"
            />
          }
          storedRelationships={profile?.emergency_contact?.relationships}
        />
      </form>
    </FormProvider>
  );
}
