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
