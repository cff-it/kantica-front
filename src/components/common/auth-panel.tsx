import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

const SIZES = {
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
} as const;

type AuthPanelProps = {
  size?: keyof typeof SIZES;
  className?: string;
  children: ReactNode;
};

// Colonne de contenu des écrans publics : pleine hauteur sur mobile (le bouton
// principal peut se coller en bas), centrée et bornée sur grand écran.
export function AuthPanel({
  size = 'md',
  className,
  children,
}: AuthPanelProps) {
  return (
    <div
      className={cn(
        'mx-auto flex w-full flex-1 flex-col px-6 py-6',
        'lg:flex-none lg:px-0 lg:py-12',
        SIZES[size],
        className,
      )}
    >
      {children}
    </div>
  );
}
