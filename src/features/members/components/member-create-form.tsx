import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { FormField } from '@/components/common/form-field';
import { applyServerErrors } from '@/lib/form-errors';
import { getMemberPath, paths } from '@/lib/paths';

import { useCreateMember } from '../hooks/use-create-member';
import { getNewMemberDefaults, toCreateMemberInput } from '../record';
import { createMemberSchema, type CreateMemberFormInput } from '../schemas';
import { isForbiddenError } from '../utils';
import { MemberFormHeader } from './member-form-header';
import { MemberRecordFields } from './member-record-fields';

// Formulaire « Ajouter un membre » : le même écran que « Modifier la fiche »
// (maquette 11-Modification-fiche-membre), champs vides, avec l'email du compte
// à saisir. Pas de mot de passe : le back le génère, crée le compte actif et
// l'envoie au membre dans un mail d'invitation. Enregistré d'un bloc par
// `POST /members`. Les cartes lisent le formulaire par le `FormProvider`.
export function MemberCreateForm() {
  const navigate = useNavigate();
  const createMember = useCreateMember();
  const form = useForm<CreateMemberFormInput>({
    resolver: zodResolver(createMemberSchema),
    defaultValues: getNewMemberDefaults(),
  });
  const { errors } = form.formState;

  const onSubmit = form.handleSubmit((values) => {
    createMember.mutate(toCreateMemberInput(values), {
      onSuccess: (member) => {
        toast.success(`Invitation envoyée à ${member.mail}.`);
        void navigate(getMemberPath(member.id));
      },
      onError: (error) => {
        // Une 422 est posée sous les champs, le premier prend le focus.
        if (applyServerErrors(error, form.setError)) {
          return;
        }

        toast.error(
          isForbiddenError(error)
            ? 'Vous n\'avez pas le droit d\'ajouter un membre.'
            : 'Impossible d\'ajouter le membre. Réessayez.',
        );
      },
    });
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <MemberFormHeader
          title="Ajouter un membre"
          backTo={paths.members}
          backLabel="Membres"
          submitLabel="Ajouter le membre"
          submitShortLabel="Ajouter"
          pending={createMember.isPending}
          onCancel={() => void navigate(paths.members)}
        />
        <MemberRecordFields
          emailField={
            <FormField
              label="Adresse e-mail"
              type="email"
              inputMode="email"
              autoCapitalize="none"
              autoComplete="off"
              spellCheck={false}
              required
              hint={
                <p className="text-sm text-muted-foreground">
                  Le mot de passe de connexion est envoyé à cette adresse.
                  Elle ne pourra plus être modifiée.
                </p>
              }
              error={errors.mail?.message}
              {...form.register('mail')}
            />
          }
        />
      </form>
    </FormProvider>
  );
}
