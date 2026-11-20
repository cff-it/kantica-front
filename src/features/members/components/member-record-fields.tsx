import type { ReactNode } from 'react';

import { useRecordForm } from '../hooks/use-record-form';
import { getRelationshipOptions } from '../record';
import {
  ChoirSection,
  ContactSection,
  EmergencySection,
  IdentitySection,
  MarriageSection,
  ParishSection,
} from './member-record-sections';

type MemberRecordFieldsProps = {
  // Champ de l'email du compte (voir `ContactSection`).
  emailField: ReactNode;
  // Liens déjà présents dans la fiche du contact d'urgence, en plus de ceux de
  // la maquette (vide pour un nouveau membre).
  storedRelationships?: string[];
};

// Corps du formulaire de fiche, commun à « Modifier la fiche » et « Ajouter un
// membre » : rappel des champs obligatoires, erreur du serveur, puis les six
// cartes (maquette 11-Modification-fiche-membre). Deux colonnes dès `lg`
// (Identité, Coordonnées et Chorale à gauche ; Paroisse et sacrements, Mariage
// et Contact en cas d'urgence à droite), empilées dans l'ordre de la maquette
// en dessous. Il lit le formulaire du `FormProvider` que chaque écran installe.
// À poser dans le `<form>` (`flex flex-col gap-5`) : le fragment laisse ses
// éléments enfants directs du formulaire, comme l'en-tête collé en haut.
export function MemberRecordFields({
  emailField,
  storedRelationships,
}: MemberRecordFieldsProps) {
  const {
    formState: { errors },
  } = useRecordForm();

  return (
    <>
      <p className="text-sm text-muted-foreground">
        <span aria-hidden className="text-destructive">
          *
        </span>{' '}
        Champ obligatoire
      </p>
      {errors.root?.server ? (
        <p role="alert" className="text-sm text-destructive">
          {errors.root.server.message}
        </p>
      ) : null}
      <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
        <div className="flex flex-col gap-5">
          <IdentitySection />
          <ContactSection emailField={emailField} />
          <ChoirSection />
        </div>
        <div className="flex flex-col gap-5">
          <ParishSection />
          <MarriageSection />
          <EmergencySection
            relationshipOptions={getRelationshipOptions(storedRelationships)}
          />
        </div>
      </div>
    </>
  );
}
