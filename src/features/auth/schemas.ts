import { z } from 'zod';

// Le back attend le champ `mail` (LoginRequest), pas `email`.
export const loginSchema = z.object({
  mail: z.email('Adresse email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

export type LoginInput = z.infer<typeof loginSchema>;
