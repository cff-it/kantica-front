import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { FormField } from '@/components/common/form-field';
import { applyServerErrors } from '@/lib/form-errors';
import { getMemberPath, paths } from '@/lib/paths';

import { useCreateMember } from '../hooks/use-create-member';
import { getNewMemberDefaults, toCreateMemberInput } from '../record';
import {
  createMemberSchema,
  type CreateMemberFormInput,
  type MemberRecordInput,
} from '../schemas';
import { MemberFormHeader } from './member-form-header';
import { MemberRecordFields } from './member-record-fields';

// Formulaire « Ajouter un membre » : le même écran que « Modifier la fiche »
// (maquette 11-Modification-fiche-membre), champs vides, avec l'email du compte
// à saisir. Pas de mot de passe : le back le génère, crée le compte actif et
// l'envoie au membre dans un mail d'invitation. Enregistré d'un bloc par
// `POST /members`.
export function MemberCreateForm() {
  const navigate = useNavigate();
  const createMember = useCreateMember();
  const form = useForm<CreateMemberFormInput>({
    resolver: zodResolver(createMemberSchema),
    defaultValues: getNewMemberDefaults(),
  });
  const { errors } = form.formState;
  // Les cartes ne lisent que les champs de la fiche, tous présents ici : `mail`
  // est saisi à part (`emailField`). TypeScript refuse pourtant de passer un
  // formulaire qui a un champ en plus (`watch` de React Hook Form est invariant),
  // d'où cet élargissement, valable parce que `CreateMemberFormInput` étend
  // `MemberRecordInput`.
  const recordForm = form as unknown as UseFormReturn<MemberRecordInput>;

  const onSubmit = form.handleSubmit((values) => {
    createMember.mutate(toCreateMemberInput(values), {
      onSuccess: (member) => {
        toast.success(`Invitation envoyée à ${member.mail}.`);
        void navigate(getMemberPath(member.id));
      },
      onError: (error) => {
        if (!applyServerErrors(error, form.setError)) {
          toast.error('Impossible d\'ajouter le membre. Réessayez.');

          return;
        }

        // Email déjà utilisé : l'erreur la plus probable, sur un champ en haut
        // du formulaire, hors de l'écran si la page a défilé. Le focus l'amène
        // sous la barre collée (`scroll-padding-top` de `index.css`).
        if (form.getFieldState('mail').error) {
          form.setFocus('mail');
        }
      },
    });
  });

  return (
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
        form={recordForm}
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
                Le mot de passe de connexion est envoyé à cette adresse. Elle ne
                pourra plus être modifiée.
              </p>
            }
            error={errors.mail?.message}
            {...form.register('mail')}
          />
        }
      />
    </form>
  );
}
