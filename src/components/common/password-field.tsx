import { Eye, EyeOff } from 'lucide-react';
import { useState, type ComponentProps } from 'react';

import { FormField } from '@/components/common/form-field';
import { Button } from '@/components/ui/button';

type PasswordFieldProps = Omit<
  ComponentProps<typeof FormField>,
  'type' | 'trailing'
>;

// Champ de mot de passe : un œil à droite de la saisie permet d'afficher le
// texte en clair ou de le masquer. L'état est propre à chaque champ et le champ
// est masqué au départ. Le libellé du bouton suit l'état, pour les lecteurs
// d'écran ; la zone tactile fait 44 px. Les autres props viennent de FormField
// (dont `autoComplete` : `new-password` à l'inscription, `current-password` à
// la connexion).
export function PasswordField(props: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <FormField
      autoCapitalize="none"
      spellCheck={false}
      {...props}
      type={visible ? 'text' : 'password'}
      trailing={
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={
            visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
          }
          onClick={() => setVisible((current) => !current)}
          className="absolute top-0.5 right-0.5 size-11 rounded-xl text-muted-foreground"
        >
          {visible ? (
            <EyeOff aria-hidden className="size-5" />
          ) : (
            <Eye aria-hidden className="size-5" />
          )}
        </Button>
      }
    />
  );
}
