import { Plus } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { useFieldArray } from 'react-hook-form';

import { Button } from '@/components/ui/button';

import { useSongForm } from '../hooks/use-song-form';
import {
  SECTION_TYPE_LABELS,
  createEmptySection,
  getSectionCountLabel,
} from '../sections';
import { SongSectionCard } from './song-section-card';

const UP = '[data-action="up"]:not(:disabled)';
const DOWN = '[data-action="down"]:not(:disabled)';
const TEXT = 'textarea';

const ADD_BUTTON_CLASS =
  'h-12 gap-2 rounded-2xl border-dashed border-primary/40 bg-transparent text-base font-semibold text-link hover:bg-secondary dark:bg-transparent dark:hover:bg-secondary';

// Liste des sections d'un cantique (maquette 03-Repertoire-et-voix, « Édition
// cantique ») : une carte par section, flèches haut / bas pour réordonner,
// ajout en bas de liste et suppression avec confirmation. L'ordre affiché est
// l'ordre envoyé à l'API (voir `toSectionsPayload`). À poser dans le
// `FormProvider` du cantique, dont le schéma contient `songSectionsSchema`.
export function SongSectionsEditor() {
  const { control } = useSongForm();
  const { fields, append, move, remove } = useFieldArray({
    control,
    name: 'sections',
  });
  const titleId = useId();
  const listRef = useRef<HTMLOListElement>(null);
  const addButtonRef = useRef<HTMLButtonElement>(null);
  // Élément à focaliser une fois la liste redessinée. Déplacer une carte
  // déplace son bouton dans le DOM, ce qui lui fait perdre le focus ; en
  // supprimer une le laisserait sur le corps de la page.
  const focusAfterRender = useRef<(() => HTMLElement | null) | null>(null);
  // Phrase lue par les lecteurs d'écran après une action sur la liste. `tick`
  // compte les annonces : deux phrases identiques de suite (« Section déplacée
  // en position 3 sur 4 » pour deux cartes différentes) ne changeraient pas le
  // texte de la zone, et la seconde ne serait pas relue.
  const [announcement, setAnnouncement] = useState({ text: '', tick: 0 });

  const announce = (text: string) =>
    setAnnouncement((previous) => ({ text, tick: previous.tick + 1 }));

  // Le focus est rendu quand la liste change (`fields`), une fois la carte
  // cible dans le DOM, et la demande n'est vidée qu'une fois l'élément trouvé :
  // un rendu intermédiaire (annonce, validation) ne la consomme pas trop tôt.
  useEffect(() => {
    const element = focusAfterRender.current?.();

    if (element) {
      focusAfterRender.current = null;
      element.focus();
    }
  }, [fields]);

  // Premier élément trouvé dans la carte, selon l'ordre des sélecteurs.
  const findInCard = (fieldKey: string, selectors: string[]) => {
    const card = listRef.current?.querySelector(
      `[data-section-key="${CSS.escape(fieldKey)}"]`,
    );

    for (const selector of selectors) {
      const element = card?.querySelector<HTMLElement>(selector);

      if (element) {
        return element;
      }
    }

    return null;
  };

  // Ajout : React Hook Form donne le focus au texte de la nouvelle section.
  const addSection = (type: 'couplet' | 'refrain') => {
    append(createEmptySection(type));
    announce(
      `${SECTION_TYPE_LABELS[type]} ajouté en position ${fields.length + 1}.`,
    );
  };

  // Le focus reste sur la flèche utilisée ; au bout de la liste, elle est
  // désactivée et le focus passe à l'autre flèche.
  const moveSection = (from: number, to: number) => {
    const fieldKey = fields[from].id;

    focusAfterRender.current = () =>
      findInCard(fieldKey, to < from ? [UP, DOWN] : [DOWN, UP]);
    move(from, to);
    announce(`Section déplacée en position ${to + 1} sur ${fields.length}.`);
  };

  // Le focus passe au texte de la section voisine, ou à « + Couplet » quand
  // la liste devient vide.
  const removeSection = (index: number) => {
    const neighbor = fields[index + 1] ?? fields[index - 1];

    focusAfterRender.current = neighbor
      ? () => findInCard(neighbor.id, [TEXT])
      : () => addButtonRef.current;
    remove(index);
    announce(
      `Section ${index + 1} supprimée. ${getSectionCountLabel(fields.length - 1)}.`,
    );
  };

  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2
          id={titleId}
          className="text-3xl lg:font-sans lg:text-xs lg:font-bold lg:tracking-wider lg:text-muted-foreground lg:uppercase"
        >
          Sections
        </h2>
        <p className="text-base text-muted-foreground lg:text-sm">
          {getSectionCountLabel(fields.length)}
        </p>
      </div>
      {fields.length > 0 ? (
        <ol ref={listRef} className="flex flex-col gap-3.5">
          {fields.map((field, index) => (
            <SongSectionCard
              key={field.id}
              fieldKey={field.id}
              index={index}
              count={fields.length}
              onMove={moveSection}
              onRemove={removeSection}
            />
          ))}
        </ol>
      ) : (
        <p className="rounded-2xl border border-dashed p-6 text-center text-base text-muted-foreground">
          Aucune section. Ajoutez un couplet ou un refrain.
        </p>
      )}
      <div className="grid grid-cols-2 gap-3">
        <Button
          ref={addButtonRef}
          type="button"
          variant="outline"
          aria-label="Ajouter un couplet"
          onClick={() => addSection('couplet')}
          className={ADD_BUTTON_CLASS}
        >
          <Plus aria-hidden className="size-5" />
          Couplet
        </Button>
        <Button
          type="button"
          variant="outline"
          aria-label="Ajouter un refrain"
          onClick={() => addSection('refrain')}
          className={ADD_BUTTON_CLASS}
        >
          <Plus aria-hidden className="size-5" />
          Refrain
        </Button>
      </div>
      <p role="status" className="sr-only">
        {announcement.text}
        {/* Espace insécable une annonce sur deux : le texte change même quand
            la phrase est la même, la zone est relue. */}
        {announcement.tick % 2 === 0 ? '' : ' '}
      </p>
    </section>
  );
}
