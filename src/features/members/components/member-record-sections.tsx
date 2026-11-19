import { useId, type ComponentProps, type ReactNode } from 'react';
import { Controller, type UseFormReturn } from 'react-hook-form';

import { ChoiceChips } from '@/components/common/choice-chips';
import { DateField } from '@/components/common/date-field';
import { FormField } from '@/components/common/form-field';
import { FormTextarea } from '@/components/common/form-textarea';
import { PhoneListField } from '@/components/common/phone-list-field';
import { VoicePicker } from '@/components/common/voice-picker';

import type { MemberRecordInput } from '../schemas';
import { MemberFormSection } from './member-form-section';

// Cartes du formulaire « Modifier la fiche » (maquette
// 11-Modification-fiche-membre), dans l'ordre de la maquette mobile. Sur web,
// `MemberRecordFields` les range en deux colonnes. Chaque carte lit et écrit
// le formulaire reçu : les noms de champs suivent le corps du PUT. Elles
// servent aussi à « Ajouter un membre ».

type SectionProps = {
  form: UseFormReturn<MemberRecordInput>;
};

const DATE_PLACEHOLDER = 'jj/mm/aaaa';

function Hint({ children }: { children: ReactNode }) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

function PlaceHint() {
  return <Hint>Nom de l'Ecar, quartier ou ville</Hint>;
}

type RecordDateName =
  | 'birth_date'
  | 'adhesion_date'
  | 'engagement_date'
  | 'baptism.date'
  | 'first_communion.date'
  | 'confirmation.date'
  | 'marriage.date';

type RecordDateFieldProps = SectionProps &
  Omit<
    ComponentProps<typeof DateField>,
    'form' | 'name' | 'value' | 'onChange' | 'onBlur' | 'error'
  > & {
    name: RecordDateName;
  };

// Champ de date de la fiche : saisie libre et sélecteur de date (`DateField`),
// relié au formulaire par un `Controller` pour que le choix du sélecteur mette
// à jour la valeur.
function RecordDateField({ form, name, ...props }: RecordDateFieldProps) {
  return (
    <Controller
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <DateField
          {...props}
          name={field.name}
          ref={field.ref}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

export function IdentitySection({ form }: SectionProps) {
  const { register } = form;
  const { errors } = form.formState;

  return (
    <MemberFormSection title="Identité">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Nom"
          required
          autoComplete="off"
          error={errors.last_name?.message}
          {...register('last_name')}
        />
        <FormField
          label="Prénom(s)"
          required
          autoComplete="off"
          error={errors.first_name?.message}
          {...register('first_name')}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <RecordDateField
          form={form}
          name="birth_date"
          label="Date de naissance"
          allowPartial={false}
          required
          autoComplete="off"
          placeholder={DATE_PLACEHOLDER}
        />
        <FormField
          label="Lieu de naissance"
          required
          autoComplete="off"
          error={errors.birth_place?.message}
          {...register('birth_place')}
        />
      </div>
    </MemberFormSection>
  );
}

type ContactSectionProps = SectionProps & {
  // Champ de l'email du compte, posé en tête de la carte : en lecture seule à
  // la modification (le back ne l'accepte pas), saisi à l'ajout d'un membre.
  emailField: ReactNode;
};

export function ContactSection({ form, emailField }: ContactSectionProps) {
  const { register } = form;
  const { errors } = form.formState;

  return (
    <MemberFormSection title="Coordonnées">
      {emailField}
      <Controller
        control={form.control}
        name="phone"
        render={({ field, fieldState }) => (
          <PhoneListField
            legend="Numéro(s) de téléphone"
            required
            maxCount={2}
            name={field.name}
            ref={field.ref}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
          />
        )}
      />
      <FormTextarea
        label="Adresse"
        required
        autoComplete="off"
        error={errors.address?.message}
        {...register('address')}
      />
      <FormField
        label="Pseudo sur Facebook ou Messenger"
        optional
        autoComplete="off"
        placeholder="Ex. Hanta Rasoa"
        error={errors.social_pseudo?.message}
        {...register('social_pseudo')}
      />
    </MemberFormSection>
  );
}

export function ChoirSection({ form }: SectionProps) {
  const { register } = form;
  const { errors } = form.formState;

  return (
    <MemberFormSection title="Chorale">
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
            required
            compact
          />
        )}
      />
      <RecordDateField
        form={form}
        name="adhesion_date"
        label="Date d'adhésion à la chorale"
        required
        autoComplete="off"
        placeholder={DATE_PLACEHOLDER}
      />
      <div className="grid grid-cols-2 gap-4">
        <RecordDateField
          form={form}
          name="engagement_date"
          label="Date d'engagement"
          optional
          autoComplete="off"
          placeholder={DATE_PLACEHOLDER}
        />
        <FormField
          label="Lieu de l'engagement"
          optional
          autoComplete="off"
          error={errors.engagement_place?.message}
          {...register('engagement_place')}
        />
      </div>
    </MemberFormSection>
  );
}

type SacramentName = 'baptism' | 'first_communion' | 'confirmation';

type SacramentFieldsProps = SectionProps & {
  name: SacramentName;
  title: string;
};

// Un sacrement : titre en police de titre, date et lieu obligatoires. Le groupe
// est nommé par son titre, car les trois blocs ont les mêmes libellés.
function SacramentFields({ form, name, title }: SacramentFieldsProps) {
  const titleId = useId();
  const { register } = form;
  const sacramentErrors = form.formState.errors[name];

  return (
    <div
      role="group"
      aria-labelledby={titleId}
      className="space-y-4 border-t pt-5"
    >
      <h3 id={titleId} className="text-xl">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <RecordDateField
          form={form}
          name={`${name}.date`}
          label="Date"
          pickerLabel={title}
          required
          autoComplete="off"
          placeholder={DATE_PLACEHOLDER}
        />
        <FormField
          label="Lieu"
          required
          autoComplete="off"
          hint={<PlaceHint />}
          error={sacramentErrors?.place?.message}
          {...register(`${name}.place`)}
        />
      </div>
    </div>
  );
}

export function ParishSection({ form }: SectionProps) {
  const { register } = form;
  const { errors } = form.formState;

  return (
    <MemberFormSection title="Paroisse et sacrements">
      <Hint>
        Pour les dates, l'année seule suffit si vous ne connaissez pas la date
        exacte.
      </Hint>
      <FormField
        label="N° Matricule et Quartier (dans l'Ecar Faravohitra)"
        autoComplete="off"
        hint={<Hint>À laisser vide si vous résidez à l'étranger.</Hint>}
        error={errors.region_registration_number?.message}
        {...register('region_registration_number')}
      />
      <SacramentFields form={form} name="baptism" title="Baptême" />
      <SacramentFields
        form={form}
        name="first_communion"
        title="Première Communion"
      />
      <SacramentFields form={form} name="confirmation" title="Confirmation" />
    </MemberFormSection>
  );
}

export function MarriageSection({ form }: SectionProps) {
  const { register } = form;
  const marriageErrors = form.formState.errors.marriage;

  return (
    <MemberFormSection title="Mariage" note="facultatif">
      <FormTextarea
        label="Marié(e) à…"
        optional
        autoComplete="off"
        placeholder="Nom du conjoint, et s'il est membre de la CFF"
        error={marriageErrors?.spouse?.message}
        {...register('marriage.spouse')}
      />
      <div className="grid grid-cols-2 gap-4">
        <RecordDateField
          form={form}
          name="marriage.date"
          label="Date du mariage"
          optional
          autoComplete="off"
          placeholder={DATE_PLACEHOLDER}
        />
        <FormField
          label="Lieu du mariage"
          optional
          autoComplete="off"
          hint={<PlaceHint />}
          error={marriageErrors?.place?.message}
          {...register('marriage.place')}
        />
      </div>
    </MemberFormSection>
  );
}

type EmergencySectionProps = SectionProps & {
  // Liens proposés : ceux de la maquette, plus ceux déjà dans la fiche.
  relationshipOptions: string[];
};

export function EmergencySection({
  form,
  relationshipOptions,
}: EmergencySectionProps) {
  const { register } = form;
  const contactErrors = form.formState.errors.emergency_contact;

  return (
    <MemberFormSection title="Contact en cas d'urgence">
      <Controller
        control={form.control}
        name="emergency_contact.relationships"
        render={({ field, fieldState }) => (
          <ChoiceChips
            name={field.name}
            legend="À contacter en cas d'urgence"
            required
            options={relationshipOptions}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            hint="Plusieurs choix possibles"
            error={fieldState.error?.message}
          />
        )}
      />
      <FormTextarea
        label="Nom de la (ou des) personne(s) à contacter"
        required
        autoComplete="off"
        error={contactErrors?.name?.message}
        {...register('emergency_contact.name')}
      />
      <Controller
        control={form.control}
        name="emergency_contact.phone"
        render={({ field, fieldState }) => (
          <PhoneListField
            legend="Numéro(s) de téléphone à contacter"
            required
            name={field.name}
            ref={field.ref}
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={fieldState.error?.message}
          />
        )}
      />
    </MemberFormSection>
  );
}
