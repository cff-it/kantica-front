import { useId } from 'react';

import { FormField } from '@/components/common/form-field';

import { useSongForm } from '../hooks/use-song-form';

// Champs Titre, Auteur et Référence (maquette 03-Repertoire-et-voix, « Édition
// cantique »). Deux mises en page, une seule bascule (`lg`) :
// - mobile : champs à plat, Auteur et Référence sur une même ligne ;
// - web : carte « Informations » à gauche des sections, champs empilés.
// Le thème liturgique de la maquette n'est pas saisi : le back ne l'accepte pas
// encore (KAN-23).
export function SongInfoCard() {
  const titleId = useId();
  const {
    register,
    formState: { errors },
  } = useSongForm();

  return (
    <section
      aria-labelledby={titleId}
      className="lg:rounded-2xl lg:border lg:bg-card lg:p-6"
    >
      <h2
        id={titleId}
        className="sr-only font-sans text-xs font-bold tracking-wider text-muted-foreground uppercase lg:not-sr-only lg:mb-4"
      >
        Informations
      </h2>
      <div className="flex flex-col gap-4 lg:gap-5">
        <FormField
          label="Titre"
          required
          autoComplete="off"
          error={errors.title?.message}
          {...register('title')}
        />
        <div className="flex gap-3 lg:flex-col lg:gap-5">
          <div className="min-w-0 flex-1 lg:flex-none">
            <FormField
              label="Auteur"
              autoComplete="off"
              error={errors.author?.message}
              {...register('author')}
            />
          </div>
          <div className="w-28 shrink-0 lg:w-auto">
            <FormField
              label="Référence"
              autoComplete="off"
              error={errors.reference?.message}
              {...register('reference')}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
