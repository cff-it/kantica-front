import watermarkDark from '@/assets/brand/watermark-dark.png';
import watermarkLight from '@/assets/brand/watermark-light.png';
import { cn } from '@/lib/utils';

type WatermarkProps = {
  className?: string;
};

// Filigrane de la chorale, purement décoratif. Les deux fichiers sont déjà à
// leur opacité (encre à environ 6 % pour le thème clair, blanc à environ 5 %
// pour le thème sombre) : aucune opacité à régler en CSS. Les deux images sont
// dans le DOM et la variante `dark:` de Tailwind choisit celle à afficher, pour
// suivre le thème de next-themes. La taille et la position viennent de
// `className`.
export function Watermark({ className }: WatermarkProps) {
  return (
    <div
      aria-hidden
      className={cn('pointer-events-none select-none', className)}
    >
      <img
        src={watermarkLight}
        alt=""
        width={543}
        height={487}
        className="h-auto w-full dark:hidden"
      />
      <img
        src={watermarkDark}
        alt=""
        width={543}
        height={487}
        className="hidden h-auto w-full dark:block"
      />
    </div>
  );
}
