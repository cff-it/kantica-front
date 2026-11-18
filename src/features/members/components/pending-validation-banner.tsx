import { Clock } from 'lucide-react';
import { toast } from 'sonner';

import { ActionButton } from '@/components/common/action-button';

import { useValidateMember } from '../hooks/use-validate-member';

type PendingValidationBannerProps = {
  memberId: number;
};

// Bandeau « Compte en attente de validation » de la fiche (maquettes
// 06-Fiche-membre). Mobile : bouton blanc « Valider ». Web : bouton plein
// « Valider le compte ». Une fois validé, le back répond que le compte est
// actif : la fiche est rechargée et le bandeau disparaît.
export function PendingValidationBanner({
  memberId,
}: PendingValidationBannerProps) {
  const validateMember = useValidateMember();

  const onValidate = () =>
    validateMember.mutate(memberId, {
      onSuccess: () => toast.success('Compte validé.'),
      onError: () => {
        toast.error('Impossible de valider le compte. Réessayez.');
      },
    });

  return (
    <div className="mt-6 flex items-center justify-between gap-3 rounded-2xl bg-warning p-4 text-warning-foreground lg:mt-8 lg:px-6">
      <p className="flex items-center gap-3 text-base font-medium">
        <Clock aria-hidden className="size-6 shrink-0" />
        Compte en attente de validation
      </p>
      <ActionButton
        type="button"
        aria-label="Valider le compte"
        loading={validateMember.isPending}
        onClick={onValidate}
        className="h-12 w-auto shrink-0 bg-background px-5 font-bold text-warning-foreground hover:bg-background/80 lg:bg-primary lg:text-primary-foreground lg:hover:bg-primary/90"
      >
        <span className="lg:hidden">Valider</span>
        <span className="hidden lg:inline">Valider le compte</span>
      </ActionButton>
    </div>
  );
}
