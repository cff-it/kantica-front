import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  dateStyle: 'long',
});

export function formatDate(value: string | Date): string {
  return dateFormatter.format(new Date(value));
}

const shortDateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const timeFormatter = new Intl.DateTimeFormat('fr-FR', {
  hour: '2-digit',
  minute: '2-digit',
});

// « 18 nov. 2026 » (historique des imports).
export function formatShortDate(value: string | Date): string {
  return shortDateFormatter.format(new Date(value));
}

// « 09:42 », à l'heure de l'appareil.
export function formatTime(value: string | Date): string {
  return timeFormatter.format(new Date(value));
}
