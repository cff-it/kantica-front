import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { ActionButton } from '@/components/common/action-button';
import { FormField } from '@/components/common/form-field';
import { applyServerErrors } from '@/lib/form-errors';
import { toVoice } from '@/lib/voices';
import type { User } from '@/types';

import { useUpdateOwnProfile } from '../hooks/use-update-own-profile';
import { createProfileSchema, type ProfileInput } from '../schemas';
import { canUpdateOwnVoice, getVoiceToKeep } from '../utils';
import { VoicePicker } from './voice-picker';

type ProfileFormProps = {
  user: User;
  // Écran d'origine : on y revient une fois la fiche enregistrée.
  returnTo: string;
};

const VOICE_LOCKED_HINT =
  'Votre voix ne peut être modifiée que par la secrétaire ou un administrateur.';

// Étape 2 de l'inscription : fiche de recensement. Le même formulaire sert à
// « Modifier ma fiche » : il est pré-rempli avec la fiche déjà enregistrée.
// Une fois la voix réservée (compte validé, voir `canUpdateOwnVoice`), les
// tuiles passent en lecture seule et la requête n'envoie plus le groupe de voix.
export function ProfileForm({ user, returnTo }: ProfileFormProps) {
  const navigate = useNavigate();
  const updateProfile = useUpdateOwnProfile();
  const { profile } = user;
  const voiceEditable = canUpdateOwnVoice(user);
  const schema = useMemo(
    () => createProfileSchema(voiceEditable),
    [voiceEditable],
  );
  const form = useForm<ProfileInput>({
    resolver: zodResolver(schema),
    defaultValues: {
      last_name: profile?.last_name ?? '',
      first_name: profile?.first_name ?? '',
      voice_group: voiceEditable ? toVoice(profile?.voice_group) : undefined,
      phone: profile?.phone ?? '',
    },
  });
  const { errors } = form.formState;

  const onSubmit = form.handleSubmit((values) =>
    updateProfile.mutate(
      { ...values, voice: getVoiceToKeep(profile, values.voice_group) },
      {
        onSuccess: () => void navigate(returnTo),
        onError: (error) => {
          if (!applyServerErrors(error, form.setError)) {
            toast.error('Impossible d\'enregistrer votre fiche. Réessayez.');
          }
        },
      },
    ),
  );

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-1 flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Nom"
          autoComplete="family-name"
          error={errors.last_name?.message}
          {...form.register('last_name')}
        />
        <FormField
          label="Prénom"
          autoComplete="given-name"
          error={errors.first_name?.message}
          {...form.register('first_name')}
        />
      </div>
      {voiceEditable ? (
        <Controller
          control={form.control}
          name="voice_group"
          render={({ field, fieldState }) => (
            <VoicePicker
              name={field.name}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
            />
          )}
        />
      ) : (
        <VoicePicker
          name="voice_group"
          value={toVoice(profile?.voice_group)}
          disabled
          hint={VOICE_LOCKED_HINT}
        />
      )}
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-4">
        <FormField
          label="Téléphone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          error={errors.phone?.message}
          {...form.register('phone')}
        />
        {/* L'email de contact est l'email du compte : le back ne l'accepte pas
            en saisie (UpdateOwnProfileRequest), il est donc en lecture seule. */}
        <FormField
          label="Email de contact"
          type="email"
          value={user.mail}
          readOnly
          className="bg-muted text-muted-foreground"
        />
      </div>
      <div className="mt-auto pt-6 lg:mt-0">
        <ActionButton type="submit" loading={updateProfile.isPending}>
          Enregistrer ma fiche
        </ActionButton>
      </div>
    </form>
  );
}
