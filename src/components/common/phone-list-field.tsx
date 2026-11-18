import { Plus, Trash2 } from 'lucide-react';
import { useId, useState, type Ref } from 'react';

import { Button } from '@/components/ui/button';
import { isValidPhone, joinPhones, splitPhones } from '@/lib/phone';

import { PhoneField } from './phone-field';

type PhoneRow = {
  id: number;
  // Numéro de la ligne : E.164, ou le texte enregistré s'il ne se lit pas.
  value: string;
  // Ligne ajoutée par l'utilisateur : elle prend le focus à l'affichage.
  focus: boolean;
};

type ListState = {
  rows: PhoneRow[];
  nextId: number;
};

type PhoneListFieldProps = {
  legend: string;
  // Numéros joints par « / », chacun en E.164 (voir `joinPhones`).
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  name?: string;
  ref?: Ref<HTMLInputElement>;
  error?: string;
  // Texte d'aide sous la liste.
  hint?: string;
  required?: boolean;
  // Libellé de chaque ligne pour les lecteurs d'écran : « Numéro 1 ».
  rowLabel?: string;
  // Nombre de lignes proposées au plus, selon la colonne du back : deux
  // numéros malgaches pour le numéro du membre (30 caractères), trois pour le
  // contact d'urgence (50).
  maxCount?: number;
};

// Une ligne par numéro enregistré, au moins une ligne (vide au besoin).
function getInitialState(value: string): ListState {
  const phones = splitPhones(value);
  const rows = (phones.length > 0 ? phones : ['']).map((phone, id) => ({
    id,
    value: phone,
    focus: false,
  }));

  return { rows, nextId: rows.length };
}

// Plusieurs numéros de téléphone (contact d'urgence) : une ligne par numéro,
// avec son pays, comme `PhoneField`. La valeur du formulaire est la liste des
// numéros en E.164 jointe par « / » (`joinPhones`), ce que le back exige. Les
// lignes sont lues une fois, à l'ouverture : la valeur ne change ensuite que
// par ce champ. Les lignes vides ne comptent pas dans la valeur.
export function PhoneListField({
  legend,
  value,
  onChange,
  onBlur,
  name,
  ref,
  error,
  hint,
  required,
  rowLabel = 'Numéro',
  maxCount = 3,
}: PhoneListFieldProps) {
  const hintId = useId();
  const errorId = useId();
  const [{ rows, nextId }, setState] = useState(() => getInitialState(value));
  const describedBy =
    [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ') ||
    undefined;
  const hasNumber = joinPhones(rows.map((row) => row.value)) !== '';

  const commit = (next: ListState) => {
    setState(next);
    onChange(joinPhones(next.rows.map((row) => row.value)));
  };

  const changeRow = (id: number, rowValue: string) => {
    commit({
      rows: rows.map((row) =>
        row.id === id ? { ...row, value: rowValue } : row,
      ),
      nextId,
    });
  };

  const addRow = () => {
    commit({
      rows: [...rows, { id: nextId, value: '', focus: true }],
      nextId: nextId + 1,
    });
  };

  const removeRow = (id: number) => {
    commit({ rows: rows.filter((row) => row.id !== id), nextId });
  };

  // Une ligne est en erreur quand son numéro est refusé, ou quand aucune ligne
  // n'a de numéro (« Numéro à contacter requis »).
  const isRowInvalid = (row: PhoneRow) =>
    Boolean(error) &&
    !isValidPhone(row.value) &&
    (row.value.trim() !== '' || !hasNumber);

  return (
    <fieldset aria-describedby={describedBy} className="min-w-0 space-y-2">
      <legend className="mb-2 text-base font-semibold">
        {legend}
        {required ? (
          <span aria-hidden className="text-destructive">
            {' *'}
          </span>
        ) : null}
      </legend>
      <div className="space-y-3">
        {rows.map((row, index) => (
          <div key={row.id} className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <PhoneField
                label={`${rowLabel} ${index + 1}`}
                hideLabel
                name={index === 0 ? name : undefined}
                ref={index === 0 ? ref : undefined}
                value={row.value}
                onChange={(rowValue) => changeRow(row.id, rowValue)}
                onBlur={onBlur}
                invalid={isRowInvalid(row)}
                autoFocus={row.focus}
                autoComplete="off"
              />
            </div>
            {rows.length > 1 ? (
              <Button
                type="button"
                variant="outline"
                aria-label={`Retirer le ${rowLabel.toLowerCase()} ${index + 1}`}
                onClick={() => removeRow(row.id)}
                className="size-12 shrink-0 rounded-xl"
              >
                <Trash2 aria-hidden className="size-5" />
              </Button>
            ) : null}
          </div>
        ))}
      </div>
      {rows.length < maxCount ? (
        <Button
          type="button"
          variant="outline"
          onClick={addRow}
          className="h-12 rounded-xl px-4 text-base font-semibold"
        >
          <Plus aria-hidden className="size-5" />
          Ajouter un numéro
        </Button>
      ) : null}
      {hint ? (
        <p id={hintId} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
