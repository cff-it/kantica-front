import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useId, useState, type ComponentProps } from 'react';

import { ActionButton } from '@/components/common/action-button';
import { SheetDialogContent } from '@/components/common/sheet-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DATE_MIN_YEAR,
  MONTH_NAMES,
  describeDate,
  formatDateInput,
  getDaysInMonth,
  getFirstWeekdayOffset,
  getLastDay,
  getLastMonth,
  getToday,
  parseDateInput,
  type DateParts,
  type DatePrecision,
} from '@/lib/dates';
import { cn } from '@/lib/utils';

const PRECISIONS: { value: DatePrecision; label: string }[] = [
  { value: 'year', label: 'Année' },
  { value: 'month', label: 'Mois' },
  { value: 'day', label: 'Jour' },
];

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

// Liste déroulante native : sur mobile, c'est la roue de l'appareil.
// `scheme-dark` fait suivre le thème sombre à la liste ouverte.
function PickerSelect({ className, ...props }: ComponentProps<'select'>) {
  return (
    <select
      className={cn(
        'h-12 min-w-0 rounded-xl border border-input bg-background px-2.5',
        'text-base outline-none dark:bg-input/30 dark:scheme-dark',
        'focus-visible:border-ring focus-visible:ring-3',
        'focus-visible:ring-ring/50',
        className,
      )}
      {...props}
    />
  );
}

type DayGridProps = {
  year: number;
  month: number;
  selected: number | null;
  onSelect: (day: number) => void;
};

// Calendrier du mois, semaine du lundi au dimanche. Les jours à venir sont
// grisés : le back refuse une date dans le futur.
function DayGrid({ year, month, selected, onSelect }: DayGridProps) {
  const lastDay = getLastDay(year, month);
  const monthName = MONTH_NAMES[month - 1].toLowerCase();
  const blanks = getFirstWeekdayOffset(year, month);

  return (
    <div className="grid grid-cols-7 gap-1">
      {WEEKDAYS.map((weekday, index) => (
        <span
          key={index}
          aria-hidden
          className="py-1 text-center text-sm font-semibold text-muted-foreground"
        >
          {weekday}
        </span>
      ))}
      {Array.from({ length: blanks }, (_, index) => (
        <span key={`blank-${index}`} aria-hidden />
      ))}
      {Array.from({ length: getDaysInMonth(year, month) }, (_, index) => {
        const day = index + 1;
        const isSelected = day === selected;

        return (
          <button
            key={day}
            type="button"
            aria-pressed={isSelected}
            aria-label={`${day} ${monthName} ${year}`}
            disabled={day > lastDay}
            onClick={() => onSelect(day)}
            className={cn(
              'h-11 rounded-full text-base transition-colors outline-none',
              'hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50',
              'disabled:pointer-events-none disabled:opacity-35',
              isSelected &&
                'bg-primary font-semibold text-primary-foreground hover:bg-primary/90',
            )}
          >
            {day}
          </button>
        );
      })}
    </div>
  );
}

type DatePickerBodyProps = {
  value: string;
  allowPartial: boolean;
  onConfirm: (value: string) => void;
  onClear?: () => void;
};

// Contenu du sélecteur. Il vit dans le contenu de la modale, que Radix démonte
// à la fermeture : l'état repart donc de la saisie du champ à chaque ouverture.
function DatePickerBody({
  value,
  allowPartial,
  onConfirm,
  onClear,
}: DatePickerBodyProps) {
  const today = getToday();
  const precisionName = useId();
  const [initial] = useState(() => parseDateInput(value));
  const [precision, setPrecision] = useState<DatePrecision>(
    allowPartial ? (initial?.precision ?? 'day') : 'day',
  );
  const [year, setYear] = useState(initial?.year ?? today.year);
  const [month, setMonth] = useState(
    initial?.month ?? (initial ? 1 : today.month),
  );
  const [day, setDay] = useState<number | null>(initial?.day ?? null);

  // Année ou mois changés : mois et jour restent dans le passé.
  const goTo = (nextYear: number, nextMonth: number) => {
    const safeMonth = Math.min(nextMonth, getLastMonth(nextYear));

    setYear(nextYear);
    setMonth(safeMonth);
    setDay((current) =>
      current !== null && current <= getLastDay(nextYear, safeMonth)
        ? current
        : null,
    );
  };

  const shiftMonth = (step: -1 | 1) => {
    const index = year * 12 + (month - 1) + step;

    goTo(Math.floor(index / 12), (index % 12) + 1);
  };

  const canGoBack = year > DATE_MIN_YEAR || month > 1;
  const canGoForward = year < today.year || month < today.month;

  const years = Array.from(
    { length: today.year - DATE_MIN_YEAR + 1 },
    (_, index) => today.year - index,
  );

  let parts: DateParts | null = null;

  if (precision === 'year') {
    parts = { precision, year, month: null, day: null };
  } else if (precision === 'month') {
    parts = { precision, year, month, day: null };
  } else if (day !== null) {
    parts = { precision, year, month, day };
  }

  return (
    <div className="grid gap-5">
      {allowPartial ? (
        <fieldset className="min-w-0">
          <legend className="mb-2 text-base font-semibold">
            Précision de la date
          </legend>
          <div className="grid grid-cols-3 gap-2">
            {PRECISIONS.map((option) => (
              <label
                key={option.value}
                className={cn(
                  'flex min-h-11 cursor-pointer items-center justify-center',
                  'rounded-full border bg-background px-2 text-center',
                  'text-base font-semibold transition-colors hover:bg-muted',
                  'has-checked:border-primary has-checked:bg-primary',
                  'has-checked:text-primary-foreground',
                  'has-checked:hover:bg-primary/90',
                  'has-focus-visible:ring-3 has-focus-visible:ring-ring/50',
                )}
              >
                <input
                  type="radio"
                  name={precisionName}
                  value={option.value}
                  checked={precision === option.value}
                  onChange={() => setPrecision(option.value)}
                  className="sr-only"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}

      <div className="flex items-center gap-2">
        {precision === 'day' ? (
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={!canGoBack}
            onClick={() => shiftMonth(-1)}
            className="size-11 shrink-0 rounded-full"
          >
            <ChevronLeft aria-hidden className="size-5" />
            <span className="sr-only">Mois précédent</span>
          </Button>
        ) : null}
        {precision !== 'year' ? (
          <PickerSelect
            aria-label="Mois"
            value={month}
            onChange={(event) => goTo(year, Number(event.target.value))}
            className="flex-1"
          >
            {MONTH_NAMES.map((name, index) => (
              <option
                key={name}
                value={index + 1}
                disabled={index + 1 > getLastMonth(year)}
              >
                {name}
              </option>
            ))}
          </PickerSelect>
        ) : null}
        <PickerSelect
          aria-label="Année"
          value={year}
          onChange={(event) => goTo(Number(event.target.value), month)}
          className={precision === 'year' ? 'flex-1' : 'w-28 shrink-0'}
        >
          {years.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </PickerSelect>
        {precision === 'day' ? (
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={!canGoForward}
            onClick={() => shiftMonth(1)}
            className="size-11 shrink-0 rounded-full"
          >
            <ChevronRight aria-hidden className="size-5" />
            <span className="sr-only">Mois suivant</span>
          </Button>
        ) : null}
      </div>

      {precision === 'day' ? (
        <DayGrid
          year={year}
          month={month}
          selected={day}
          onSelect={setDay}
        />
      ) : null}

      <p aria-live="polite" className="text-center text-base">
        {parts ? (
          <>
            <span className="text-muted-foreground">Date choisie : </span>
            <span className="font-semibold">{describeDate(parts)}</span>
          </>
        ) : (
          <span className="text-muted-foreground">
            Choisissez un jour dans le calendrier.
          </span>
        )}
      </p>

      {onClear ? (
        <Button
          type="button"
          variant="ghost"
          onClick={onClear}
          className="mx-auto h-11 px-4 text-base font-semibold text-destructive"
        >
          Effacer la date
        </Button>
      ) : null}

      <DialogFooter className="gap-3 sm:items-center">
        <DialogClose asChild>
          <ActionButton
            type="button"
            variant="ghost"
            className="text-muted-foreground sm:w-auto"
          >
            Annuler
          </ActionButton>
        </DialogClose>
        <ActionButton
          type="button"
          disabled={!parts}
          onClick={() => {
            if (parts) {
              onConfirm(formatDateInput(parts));
            }
          }}
          className="sm:w-auto"
        >
          Valider
        </ActionButton>
      </DialogFooter>
    </div>
  );
}

type DatePickerDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Champ concerné (« Baptême »), repris sous le titre.
  fieldLabel: string;
  // Saisie actuelle du champ : le sélecteur s'ouvre dessus quand elle se lit.
  value: string;
  // Année seule et mois seul acceptés : toutes les dates de la fiche sauf la
  // naissance, qui veut un jour complet.
  allowPartial: boolean;
  onSelect: (value: string) => void;
  // Date facultative déjà saisie : le sélecteur propose « Effacer la date ».
  onClear?: () => void;
  // Rend le focus au bouton qui a ouvert le sélecteur : sans `DialogTrigger`,
  // Radix ne le fait pas et le focus tomberait sur la page.
  onCloseFocus: () => void;
};

// Sélecteur de date à précision : année seule, mois et année, ou jour complet.
// Un calendrier ne sait choisir qu'un jour, alors que le back accepte
// `mm/aaaa` et `aaaa` pour l'adhésion, l'engagement, les sacrements et le
// mariage. Feuille en bas sur mobile, fenêtre centrée dès `md` (comme les
// autres modales). Le choix est rendu en texte (`jj/mm/aaaa`, `mm/aaaa` ou
// `aaaa`), tel que le champ le garde.
export function DatePickerDialog({
  open,
  onOpenChange,
  fieldLabel,
  value,
  allowPartial,
  onSelect,
  onClear,
  onCloseFocus,
}: DatePickerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <SheetDialogContent
        className="max-h-[92dvh] overflow-y-auto"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          onCloseFocus();
        }}
      >
        <DialogHeader className="gap-2">
          <DialogTitle className="text-2xl font-semibold md:text-3xl">
            Choisir la date
          </DialogTitle>
          <DialogDescription className="text-base">
            {fieldLabel}
          </DialogDescription>
        </DialogHeader>
        <DatePickerBody
          value={value}
          allowPartial={allowPartial}
          onConfirm={(picked) => {
            onSelect(picked);
            onOpenChange(false);
          }}
          onClear={
            onClear
              ? () => {
                  onClear();
                  onOpenChange(false);
                }
              : undefined
          }
        />
      </SheetDialogContent>
    </Dialog>
  );
}
