import { useId } from 'react';

import { cn } from '@/lib/utils';

import type { ExportFormat } from '../types';

type FormatOption = {
  value: ExportFormat;
  badge: string;
  title: string;
  description: string;
};

const FORMATS: readonly FormatOption[] = [
  {
    value: 'pdf',
    badge: 'PDF',
    title: 'Document PDF',
    description: 'Pour imprimer ou partager',
  },
  {
    value: 'csv',
    badge: 'CSV',
    title: 'Fichier CSV',
    description: 'Pour un tableur (Excel, Sheets)',
  },
];

type ExportFormatPickerProps = {
  value: ExportFormat;
  onChange: (value: ExportFormat) => void;
  disabled?: boolean;
};

// Choix du format en deux cartes radio (maquette 07-Export-PDF-CSV). Comme
// `VoicePicker` : boutons radio natifs masqués visuellement, le clavier et les
// lecteurs d'écran fonctionnent sans code en plus. Le libellé « Format » n'est
// visible que sur mobile, comme sur la maquette.
export function ExportFormatPicker({
  value,
  onChange,
  disabled = false,
}: ExportFormatPickerProps) {
  const name = useId();

  return (
    <fieldset disabled={disabled} className="min-w-0 space-y-3">
      <legend className="mb-3 text-base font-semibold md:sr-only">
        Format
      </legend>
      {FORMATS.map((format) => (
        <label
          key={format.value}
          className={cn(
            'group flex min-h-18 cursor-pointer items-center gap-4 rounded-2xl',
            'border bg-background p-4 transition-colors hover:bg-muted',
            'has-checked:border-primary has-checked:bg-secondary',
            'has-checked:ring-1 has-checked:ring-primary',
            'has-focus-visible:ring-3 has-focus-visible:ring-ring/50',
            'has-disabled:cursor-not-allowed has-disabled:opacity-60',
          )}
        >
          <input
            type="radio"
            name={name}
            value={format.value}
            checked={value === format.value}
            onChange={() => onChange(format.value)}
            className="sr-only"
          />
          <span
            aria-hidden
            className={cn(
              'flex size-12 shrink-0 items-center justify-center rounded-xl',
              'bg-muted text-sm font-bold tracking-wide text-muted-foreground',
              'group-has-checked:bg-primary group-has-checked:text-primary-foreground',
            )}
          >
            {format.badge}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-base font-semibold">
              {format.title}
            </span>
            <span className="block text-base text-muted-foreground">
              {format.description}
            </span>
          </span>
          <span
            aria-hidden
            className={cn(
              'flex size-6 shrink-0 items-center justify-center rounded-full',
              'border-2 border-input',
              'group-has-checked:border-primary group-has-checked:bg-primary',
            )}
          >
            <span className="hidden size-2 rounded-full bg-primary-foreground group-has-checked:block" />
          </span>
        </label>
      ))}
    </fieldset>
  );
}
