import { z } from 'zod';

import { arePhonesValid } from '@/lib/phone';

// Un ou plusieurs numéros E.164 joints par « / » (voir `PhoneListField` et
// `joinPhones`). `max` est la longueur de la colonne côté back, séparateurs
// compris (`PROFILE_PHONES_MAX_LENGTH`, `EMERGENCY_PHONES_MAX_LENGTH`). Un
// numéro incomplet ou invalide pour son pays est refusé.
export function phonesSchema(requiredMessage: string, max: number) {
  return z
    .string()
    .trim()
    .min(1, requiredMessage)
    .max(max, `Trop de numéros (${max} caractères au plus)`)
    .refine(arePhonesValid, 'Numéro de téléphone invalide');
}
