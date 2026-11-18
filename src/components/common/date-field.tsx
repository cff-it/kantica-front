import { CalendarDays } from 'lucide-react';
import {
  useId,
  useState,
  type ComponentProps,
  type KeyboardEvent,
} from 'react';

import { cn } from '@/lib/utils';

import { DatePickerDialog } from './date-picker-dialog';
import { FormField } from './form-field';

type DateFieldProps = Omit<
  ComponentProps<typeof FormField>,
  'trailing' | 'value' | 'onChange' | 'readOnly'
> & {
  value: string;
  onChange: (value: string) => void;
  // Nom du champ pour le titre du sélecteur. Par défaut, le libellé ; à
  // préciser quand plusieurs champs ont le même libellé (« Date » du baptême,
  // de la communion, de la confirmation).
  pickerLabel?: string;
  // Année seule et mois seul acceptés par le sélecteur. Faux pour une date qui
  // veut un jour complet (la naissance).
  allowPartial?: boolean;
};

// Champ de date : le champ lui-même ouvre un sélecteur à précision (année,
// mois ou jour complet, `DatePickerDialog`) au clic, à Entrée, à Espace ou à la
// flèche du bas. Il est en lecture seule : le sélecteur couvre les trois
// précisions que le back lit (`aaaa`, `mm/aaaa`, `jj/mm/aaaa`) et écrit le
// champ dans ce format. Une date facultative se vide depuis le sélecteur.
export function DateField({
  value,
  onChange,
  label,
  pickerLabel,
  allowPartial = true,
  optional,
  id,
  className,
  ...fieldProps
}: DateFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [pickerOpen, setPickerOpen] = useState(false);
  const fieldName = pickerLabel ?? label;

  const openPicker = () => {
    if (!fieldProps.disabled) {
      setPickerOpen(true);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (['Enter', ' ', 'ArrowDown'].includes(event.key)) {
      // Entrée enverrait le formulaire : ici elle ouvre le sélecteur.
      event.preventDefault();
      openPicker();
    }
  };

  return (
    <FormField
      {...fieldProps}
      id={inputId}
      label={label}
      optional={optional}
      value={value}
      readOnly
      aria-haspopup="dialog"
      onClick={openPicker}
      onKeyDown={onKeyDown}
      className={cn('cursor-pointer', className)}
      trailing={
        <>
          <CalendarDays
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-muted-foreground"
          />
          <DatePickerDialog
            open={pickerOpen}
            onOpenChange={setPickerOpen}
            fieldLabel={fieldName}
            value={value}
            allowPartial={allowPartial}
            onSelect={onChange}
            onClear={optional && value ? () => onChange('') : undefined}
            onCloseFocus={() => document.getElementById(inputId)?.focus()}
          />
        </>
      }
    />
  );
}
