import { z } from 'zod';

import { PROFILE_PHONES_MAX_LENGTH } from '@/lib/phone';
import { phonesSchema } from '@/lib/phone-schema';

// Le back attend le champ `mail` (LoginRequest), pas `email`. L'email est
// nettoyé avant validation : l'autocomplétion des claviers mobiles ajoute
// souvent une espace finale. Le mot de passe, lui, n'est jamais modifié.
export const loginSchema = z.object({
  mail: z
    .string()
    .trim()
    .min(1, 'Adresse email requise')
    .pipe(z.email('Adresse email invalide')),
  password: z.string().min(1, 'Mot de passe requis'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const PASSWORD_MIN_LENGTH = 8;

// RegisterRequest : `mail`, `password` et `password_confirmation`. Le back
// impose en plus majuscule, minuscule, chiffre et symbole : ces règles ne sont
// pas dans la maquette, leurs erreurs 422 s'affichent sous le champ.
export const registerSchema = z
  .object({
    mail: z
      .email('Adresse email invalide')
      .max(255, 'Adresse email trop longue'),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, `Au moins ${PASSWORD_MIN_LENGTH} caractères`),
    password_confirmation: z.string().min(1, 'Confirmez votre mot de passe'),
  })
  .refine((values) => values.password === values.password_confirmation, {
    path: ['password_confirmation'],
    message: 'Les mots de passe ne correspondent pas',
  });

export type RegisterInput = z.infer<typeof registerSchema>;

// Valeurs de l'enum VoicePart du back.
const voiceGroupSchema = z.enum(['S', 'A', 'T', 'B'], {
  error: 'Choisissez votre voix',
});

// UpdateOwnProfileRequest. La voix précise (S1, S2...) est facultative côté
// back et absente de la maquette : seul le groupe de voix est saisi.
// Le groupe de voix n'est obligatoire que si le membre peut encore le modifier
// (`canUpdateOwnVoice`) : une fois la voix réservée, le formulaire ne la saisit
// plus et la requête ne l'envoie pas.
export function createProfileSchema(voiceEditable: boolean) {
  return z.object({
    last_name: z.string().trim().min(1, 'Nom requis').max(100, 'Nom trop long'),
    first_name: z
      .string()
      .trim()
      .min(1, 'Prénom requis')
      .max(100, 'Prénom trop long'),
    voice_group: voiceEditable ? voiceGroupSchema : voiceGroupSchema.optional(),
    // Un ou plusieurs numéros E.164 joints par « / » (`PhoneListField`).
    phone: phonesSchema('Téléphone requis', PROFILE_PHONES_MAX_LENGTH),
  });
}

export type ProfileInput = z.infer<ReturnType<typeof createProfileSchema>>;
