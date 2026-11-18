import { ChevronDown } from 'lucide-react';
import { useId, useState, type ReactNode, type Ref } from 'react';

import { Input } from '@/components/ui/input';
import {
  formatNationalPhone,
  getCallingCode,
  getFlag,
  getPhoneCountries,
  parseInternationalPhone,
  toE164,
  toPhoneInput,
  type PhoneCountryCode,
} from '@/lib/phone';

import { FieldLabel } from './field-label';

type PhoneFieldProps = {
  label: string;
  // Numéro en E.164 (+261341234567). Un numéro enregistré qui ne se lit pas
  // est affiché tel quel, à corriger.
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  ref?: Ref<HTMLInputElement>;
  error?: string;
  hint?: ReactNode;
  // Mention « (facultatif) » après le libellé.
  optional?: boolean;
  required?: boolean;
  disabled?: boolean;
  // Libellé réservé aux lecteurs d'écran : lignes d'une liste de numéros, dont
  // le titre est porté par le groupe.
  hideLabel?: boolean;
  // Champ en erreur sans message propre : le parent affiche le message.
  invalid?: boolean;
  // Focus à l'affichage (ligne qu'on vient d'ajouter à une liste).
  autoFocus?: boolean;
  // « tel-national » par défaut ; « off » pour le numéro d'une autre personne.
  autoComplete?: string;
};

// Champ de téléphone : pays (indicatif) et numéro national. La valeur du
// formulaire est toujours en E.164, ce que le back garde tel quel. Le pays
// vient du sélecteur ; un numéro international saisi ou collé (+33 6 12...)
// change le pays tout seul. La liste est la liste native de l'appareil : le
// sélecteur n'en montre que l'indicatif (« 🇲🇬 +261 »). Le numéro national
// garde la saisie de l'utilisateur et se met en forme à la sortie du champ.
// Le pays et le texte sont lus une fois, à l'ouverture : la valeur ne change
// ensuite que par ce champ.
export function PhoneField({
  label,
  value,
  onChange,
  onBlur,
  name,
  ref,
  error,
  hint,
  optional,
  required,
  disabled,
  hideLabel,
  invalid,
  autoFocus,
  autoComplete = 'tel-national',
}: PhoneFieldProps) {
  const id = useId();
  const inputId = `${id}-number`;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const [{ country, text }, setInput] = useState(() => toPhoneInput(value));
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') ||
    undefined;

  const update = (nextCountry: PhoneCountryCode, nextText: string) => {
    setInput({ country: nextCountry, text: nextText });
    onChange(toE164(nextText, nextCountry));
  };

  const onTextChange = (next: string) => {
    const international = parseInternationalPhone(next);

    if (international) {
      update(international.country, international.text);

      return;
    }

    update(country, next);
  };

  return (
    <div className="space-y-2">
      <div className={hideLabel ? 'sr-only' : undefined}>
        <FieldLabel htmlFor={inputId} required={required} optional={optional}>
          {label}
        </FieldLabel>
      </div>
      <div className="flex gap-2">
        <div className="relative flex h-12 w-28 shrink-0 items-center justify-between gap-1 rounded-xl border border-input px-3 text-base transition-[color,box-shadow] focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 has-disabled:opacity-50 dark:bg-input/30">
          <span aria-hidden>
            {getFlag(country)} +{getCallingCode(country)}
          </span>
          <ChevronDown
            aria-hidden
            className="size-4 shrink-0 text-muted-foreground"
          />
          <select
            aria-label="Indicatif du pays"
            value={country}
            disabled={disabled}
            onChange={(event) =>
              update(event.target.value as PhoneCountryCode, text)
            }
            className="absolute inset-0 size-full cursor-pointer opacity-0 dark:scheme-dark"
          >
            {getPhoneCountries().map((option) => (
              <option key={option.code} value={option.code}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <Input
          id={inputId}
          ref={ref}
          name={name}
          type="tel"
          inputMode="tel"
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          required={required}
          disabled={disabled}
          value={text}
          aria-invalid={error || invalid ? true : undefined}
          aria-describedby={describedBy}
          onChange={(event) => onTextChange(event.target.value)}
          onBlur={() => {
            setInput((current) => ({
              ...current,
              text: formatNationalPhone(current.text, current.country),
            }));
            onBlur?.();
          }}
          className="h-12 min-w-0 flex-1 rounded-xl px-4 text-base md:text-base"
        />
      </div>
      {hint ? <div id={hintId}>{hint}</div> : null}
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
