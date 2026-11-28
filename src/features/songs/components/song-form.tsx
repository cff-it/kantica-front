import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { UnsavedChangesDialog } from '@/components/common/unsaved-changes-dialog';
import { useUnsavedChangesGuard } from '@/hooks/use-unsaved-changes-guard';
import { isForbiddenError } from '@/lib/api-errors';
import { applyServerErrors } from '@/lib/form-errors';
import { getSongPath, paths } from '@/lib/paths';

import { useCreateSong } from '../hooks/use-create-song';
import { useUpdateSong } from '../hooks/use-update-song';
import { songFormSchema, type SongFormInput } from '../schemas';
import { getSongDefaults, toSongInput } from '../song-input';
import type { Song } from '../types';
import { getHiddenValidationMessage } from '../utils';
import { SongFormHeader } from './song-form-header';
import { SongInfoCard } from './song-info-card';
import { SongSectionsEditor } from './song-sections-editor';
import { SongSubmitBar } from './song-submit-bar';

type SongFormProps = {
  // Cantique à modifier ; absent, le formulaire ajoute un cantique.
  song?: Song;
};

// Formulaire d'un cantique (maquettes 03-Repertoire-et-voix, « Édition
// cantique », KAN-13 et KAN-4) : titre, auteur, référence et sections, enregistrés
// d'un seul appel (`POST /songs` ou `PUT /songs/{id}`). L'ordre des cartes de
// sections est l'ordre envoyé à l'API. Le thème liturgique attend KAN-23. Les
// champs et les cartes lisent le formulaire par le `FormProvider`.
export function SongForm({ song }: SongFormProps) {
  const navigate = useNavigate();
  const createSong = useCreateSong();
  const updateSong = useUpdateSong();
  const form = useForm<SongFormInput>({
    resolver: zodResolver(songFormSchema),
    defaultValues: getSongDefaults(song),
  });
  const { errors, isDirty } = form.formState;
  // Un cantique peut compter beaucoup de paroles : « Annuler », un lien, un
  // onglet ou le geste « retour » demandent confirmation tant que la saisie
  // n'est pas enregistrée.
  const { blocker, allowLeaving } = useUnsavedChangesGuard(isDirty);
  const pending = createSong.isPending || updateSong.isPending;
  // « Annuler » et la fin d'un enregistrement ramènent à l'écran d'origine : la
  // fiche du cantique (KAN-25) à la modification, le répertoire à l'ajout.
  const exitPath = song ? getSongPath(song.id) : paths.songs;

  const onError = (error: unknown) => {
    // Une 422 est posée sous les champs, le premier prend le focus.
    if (applyServerErrors(error, form.setError)) {
      const hidden = getHiddenValidationMessage(error);

      if (hidden) {
        toast.error(hidden);
      }

      return;
    }

    toast.error(
      isForbiddenError(error)
        ? 'Seul un admin peut enregistrer un cantique.'
        : 'Impossible d\'enregistrer le cantique. Réessayez.',
    );
  };

  const onSubmit = form.handleSubmit((values) => {
    // Les notes ne sont pas saisies : le PUT est complet, elles repartent telles
    // qu'enregistrées (voir `toSongInput`).
    const input = toSongInput(values, song?.notes ?? null);

    if (song) {
      updateSong.mutate(
        { id: song.id, input },
        {
          onSuccess: () => {
            toast.success('Cantique modifié.');
            allowLeaving();
            void navigate(exitPath);
          },
          onError,
        },
      );

      return;
    }

    createSong.mutate(input, {
      onSuccess: () => {
        toast.success('Cantique ajouté.');
        allowLeaving();
        void navigate(exitPath);
      },
      onError,
    });
  });

  return (
    <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-none">
      <FormProvider {...form}>
        <form
          onSubmit={onSubmit}
          noValidate
          className="flex flex-col gap-5 pb-20 lg:pb-0"
        >
          <SongFormHeader
            title={song ? 'Modifier le cantique' : 'Nouveau cantique'}
            backTo={exitPath}
            backLabel={song ? song.title : 'Répertoire'}
            pending={pending}
            onCancel={() => void navigate(exitPath)}
          />
          {errors.root?.server ? (
            <p role="alert" className="text-sm text-destructive">
              {errors.root.server.message}
            </p>
          ) : null}
          <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[5fr_8fr] lg:items-start lg:gap-8">
            <SongInfoCard />
            <SongSectionsEditor />
          </div>
          <SongSubmitBar pending={pending} />
        </form>
      </FormProvider>
      <UnsavedChangesDialog blocker={blocker} />
    </div>
  );
}
