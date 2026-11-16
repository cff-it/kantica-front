import logo from '@/assets/brand/logo-cff.png';
import { cn } from '@/lib/utils';

type BrandMarkProps = {
  size?: 'md' | 'lg';
  className?: string;
};

// Marque de la chorale : le logo officiel, puis le nom. Le logo est décoratif
// (`alt` vide) : le nom qui le suit suffit aux lecteurs d'écran.
export function BrandMark({ size = 'md', className }: BrandMarkProps) {
  const large = size === 'lg';

  return (
    <div
      className={cn('flex flex-col items-center gap-4 text-center', className)}
    >
      <img
        src={logo}
        alt=""
        width={543}
        height={487}
        className={cn('h-auto', large ? 'w-72' : 'w-48')}
      />
      <p
        className={cn(
          'font-heading font-semibold tracking-wide text-link',
          large ? 'text-3xl' : 'text-xl',
        )}
      >
        Chorale Francophone Faravohitra
      </p>
    </div>
  );
}
