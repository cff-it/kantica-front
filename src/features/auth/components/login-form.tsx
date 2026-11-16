import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';
import { toast } from 'sonner';

import { ActionButton } from '@/components/common/action-button';
import { FormField } from '@/components/common/form-field';
import { PasswordField } from '@/components/common/password-field';
import { applyServerErrors } from '@/lib/form-errors';
import { paths } from '@/lib/paths';

import { useLogin } from '../hooks/use-login';
import { loginSchema, type LoginInput } from '../schemas';
import { isInvalidCredentialsError } from '../utils';

// Message unique : identique pour un email inconnu et un mauvais mot de passe.
const INVALID_CREDENTIALS_MESSAGE = 'Adresse email ou mot de passe incorrect.';

// Formulaire de connexion (maquette 01-Connexion). Une fois connecté, les
// guards renvoient l'utilisateur vers sa destination selon son statut : accueil,
// page demandée avant la connexion, ou parcours d'un compte en attente.
export function LoginForm() {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { mail: '', password: '' },
  });
  const login = useLogin();
  const { errors } = form.formState;

  const onSubmit = form.handleSubmit((values) =>
    login.mutate(values, {
      onError: (error) => {
        if (isInvalidCredentialsError(error)) {
          form.setError('root.server', {
            type: 'server',
            message: INVALID_CREDENTIALS_MESSAGE,
          });
        } else if (!applyServerErrors(error, form.setError)) {
          toast.error('Connexion impossible. Réessayez dans un instant.');
        }
      },
    }),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <FormField
        label="Adresse email"
        type="email"
        inputMode="email"
        autoComplete="email"
        autoCapitalize="none"
        spellCheck={false}
        placeholder="prenom.nom@exemple.com"
        error={errors.mail?.message}
        {...form.register('mail')}
      />
      <div className="space-y-1">
        <PasswordField
          label="Mot de passe"
          autoComplete="current-password"
          error={errors.password?.message}
          {...form.register('password')}
        />
        <div className="flex justify-end">
          <Link
            to={paths.forgotPassword}
            className="inline-flex min-h-11 items-center font-semibold text-link"
          >
            Mot de passe oublié ?
          </Link>
        </div>
      </div>
      {errors.root?.server ? (
        <p role="alert" className="text-destructive">
          {errors.root.server.message}
        </p>
      ) : null}
      <ActionButton type="submit" loading={login.isPending}>
        Se connecter
      </ActionButton>
    </form>
  );
}
