import { zodResolver } from '@hookform/resolvers/zod';
import { Check } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { ActionButton } from '@/components/common/action-button';
import { FormField } from '@/components/common/form-field';
import { PasswordField } from '@/components/common/password-field';
import { applyServerErrors } from '@/lib/form-errors';
import { cn } from '@/lib/utils';

import { useRegister } from '../hooks/use-register';
import {
  PASSWORD_MIN_LENGTH,
  registerSchema,
  type RegisterInput,
} from '../schemas';

// Indicateur de la maquette : vert avec une coche une fois la longueur
// atteinte, gris avant.
function PasswordHint({ satisfied }: { satisfied: boolean }) {
  return (
    <p
      className={cn(
        'flex items-center gap-2 text-sm',
        satisfied ? 'text-success' : 'text-muted-foreground',
      )}
    >
      {satisfied ? <Check aria-hidden className="size-4" /> : null}
      Au moins {PASSWORD_MIN_LENGTH} caractères
    </p>
  );
}

// Étape 1 de l'inscription : email et mot de passe. Une fois le compte créé,
// l'utilisateur est connecté et les guards le renvoient vers l'étape 2.
export function RegisterForm() {
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { mail: '', password: '', password_confirmation: '' },
  });
  const register = useRegister();
  const password = useWatch({ control: form.control, name: 'password' });
  const { errors } = form.formState;

  const onSubmit = form.handleSubmit((values) =>
    register.mutate(values, {
      onError: (error) => {
        if (!applyServerErrors(error, form.setError)) {
          toast.error('Impossible de créer le compte. Réessayez dans un instant.');
        }
      },
    }),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-1 flex-col gap-6">
      <FormField
        label="Adresse email"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="prenom.nom@exemple.com"
        error={errors.mail?.message}
        {...form.register('mail')}
      />
      <PasswordField
        label="Mot de passe"
        autoComplete="new-password"
        error={errors.password?.message}
        hint={<PasswordHint satisfied={password.length >= PASSWORD_MIN_LENGTH} />}
        {...form.register('password')}
      />
      <PasswordField
        label="Confirmer le mot de passe"
        autoComplete="new-password"
        placeholder="Retapez le mot de passe"
        error={errors.password_confirmation?.message}
        {...form.register('password_confirmation')}
      />
      <div className="mt-auto pt-6 lg:mt-0">
        <ActionButton type="submit" loading={register.isPending}>
          Continuer
        </ActionButton>
      </div>
    </form>
  );
}
