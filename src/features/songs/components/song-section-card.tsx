import { ChevronDown, ChevronUp } from 'lucide-react';
import { useFormState, useWatch } from 'react-hook-form';

import { FormTextarea } from '@/components/common/form-textarea';
import { SegmentedControl } from '@/components/common/segmented-control';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { useSongForm } from '../hooks/use-song-form';
import { SECTION_TYPE_OPTIONS, parseSectionNumber } from '../sections';
import { DeleteSectionDialog } from './delete-section-dialog';

type SongSectionCardProps = {
  // Clé de la section dans la liste (`useFieldArray`) : elle suit la carte
  // quand on la déplace, l'éditeur s'en sert pour lui rendre le focus.
  fieldKey: string;
  index: number;
  count: number;
  onMove: (from: number, to: number) => void;
  onRemove: (index: number) => void;
};

// Carte d'une section (maquette 03-Repertoire-et-voix, « Édition cantique ») :
// numéro d'ordre, sélecteur Couplet / Refrain, flèches pour réordonner et
// texte multiligne redimensionnable. Le refrain est mis en valeur (fond bleu
// clair, texte en gras). « Supprimer » n'est pas sur la maquette : trois
// boutons de 44 px ne tiennent pas dans l'en-tête à 390 px, il est donc sous
// le texte, avec sa confirmation. Le champ « Numéro » (facultatif, 1 à 999)
// n'y est pas non plus : le back garde le numéro saisi sans jamais le calculer,
// il doit donc être visible pour que l'admin le corrige après un déplacement.
export function SongSectionCard({
  fieldKey,
  index,
  count,
  onMove,
  onRemove,
}: SongSectionCardProps) {
  const { control, register, setValue } = useSongForm();
  const type = useWatch({ control, name: `sections.${index}.type` });
  const { errors } = useFormState({
    control,
    name: [`sections.${index}.text`, `sections.${index}.number`],
  });
  const position = index + 1;
  const isChorus = type === 'refrain';
  const numberError = errors.sections?.[index]?.number?.message;
  const numberErrorId = `${fieldKey}-number-error`;

  return (
    <li
      data-section-key={fieldKey}
      className="rounded-2xl border bg-card p-3.5 lg:p-4"
    >
      <div className="flex items-center gap-2">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-muted text-sm font-bold text-muted-foreground dark:bg-secondary">
          <span className="sr-only">Section </span>
          {position}
        </span>
        <SegmentedControl
          name={`${fieldKey}-type`}
          legend={`Type de la section ${position}`}
          options={SECTION_TYPE_OPTIONS}
          value={type}
          onChange={(value) =>
            setValue(`sections.${index}.type`, value, {
              shouldDirty: true,
              shouldTouch: true,
            })
          }
        />
        <div className="ml-auto flex shrink-0">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            data-action="up"
            aria-label={`Monter la section ${position}`}
            disabled={index === 0}
            onClick={() => onMove(index, index - 1)}
            className="size-11 rounded-full text-muted-foreground"
          >
            <ChevronUp aria-hidden className="size-5" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            data-action="down"
            aria-label={`Descendre la section ${position}`}
            disabled={index === count - 1}
            onClick={() => onMove(index, index + 1)}
            className="size-11 rounded-full text-muted-foreground"
          >
            <ChevronDown aria-hidden className="size-5" />
          </Button>
        </div>
      </div>
      <div className="mt-3">
        <FormTextarea
          label={`Texte de la section ${position}`}
          hideLabel
          rows={5}
          error={errors.sections?.[index]?.text?.message}
          className={cn(
            'min-h-32',
            isChorus &&
              'border-primary/30 bg-secondary font-semibold dark:bg-secondary',
          )}
          {...register(`sections.${index}.text`)}
        />
      </div>
      <div className="mt-1 flex items-start justify-between gap-3">
        <div>
          <label className="flex items-center gap-2 text-base text-muted-foreground">
            <span>Numéro</span>
            <Input
              inputMode="numeric"
              autoComplete="off"
              aria-label={`Numéro de la section ${position} (facultatif)`}
              aria-invalid={numberError ? true : undefined}
              aria-describedby={numberError ? numberErrorId : undefined}
              className="h-11 w-20 rounded-xl px-3 text-center text-base md:text-base"
              {...register(`sections.${index}.number`, {
                setValueAs: parseSectionNumber,
              })}
            />
          </label>
          {numberError ? (
            <p
              id={numberErrorId}
              role="alert"
              className="mt-1 text-sm text-destructive"
            >
              {numberError}
            </p>
          ) : null}
        </div>
        <DeleteSectionDialog
          position={position}
          onConfirm={() => onRemove(index)}
        />
      </div>
    </li>
  );
}
