import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

import { cn } from '@/lib/utils';

type StepHeaderProps = {
  step: number;
  total: number;
  // Destination de la flèche de retour (mobile). Absente : pas de flèche.
  backTo?: string;
};

// En-tête d'un parcours en étapes : retour, « Étape x sur y » et barre de
// progression à segments. Sur grand écran, la maquette n'a pas de flèche.
// Sur mobile, `pr-12` laisse la place au bouton de thème du layout, posé en
// haut à droite.
export function StepHeader({ step, total, backTo }: StepHeaderProps) {
  return (
    <div className="space-y-3">
      <div className="flex min-h-11 items-center justify-between pr-12 lg:justify-start lg:pr-0">
        {backTo ? (
          <Link
            to={backTo}
            aria-label="Retour"
            className="-ml-3 flex size-11 items-center justify-center rounded-full lg:hidden"
          >
            <ArrowLeft aria-hidden className="size-6" />
          </Link>
        ) : (
          <span />
        )}
        <p className="font-semibold text-muted-foreground">
          Étape {step} sur {total}
        </p>
      </div>
      <div
        role="progressbar"
        aria-label="Progression de l'inscription"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={step}
        aria-valuetext={`Étape ${step} sur ${total}`}
        className="flex gap-2"
      >
        {Array.from({ length: total }, (_, index) => (
          <span
            key={index}
            className={cn(
              'h-1 flex-1 rounded-full',
              index < step ? 'bg-primary' : 'bg-border',
            )}
          />
        ))}
      </div>
    </div>
  );
}
