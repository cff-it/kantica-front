import { ActionButton } from '@/components/common/action-button';

type SongSubmitBarProps = {
  pending: boolean;
};

// Bouton « Enregistrer le cantique » fixé en bas de l'écran, sous `lg`
// seulement (maquette mobile 04-Edition-cantique-admin) : au-dessus de la barre
// d'onglets de `AppLayout` (3,5 rem et sa bordure). Dès `lg`, le bouton est
// dans l'en-tête. Le formulaire garde du vide en bas (`pb-*`) pour que la barre
// ne cache pas la fin des sections.
export function SongSubmitBar({ pending }: SongSubmitBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-[calc(3.5rem+1px+env(safe-area-inset-bottom))] z-30 border-t bg-background px-4 py-3 lg:hidden">
      <ActionButton
        type="submit"
        loading={pending}
        className="mx-auto flex max-w-xl"
      >
        Enregistrer le cantique
      </ActionButton>
    </div>
  );
}
