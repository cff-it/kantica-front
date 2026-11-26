import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router';

import { RoleGuard } from '@/components/common/role-guard';
import { Button } from '@/components/ui/button';
import { paths } from '@/lib/paths';
import { cn } from '@/lib/utils';

// Bouton « Gestion des rôles » de la liste des membres, à côté d'« Importer »
// et « Exporter ». Fonction d'admin : masqué pour la secrétaire (la route et le
// back la refusent aussi). Emplacement non maquetté : la maquette le place
// dans Profil > Réglages.
export function MemberRolesLink({ className }: { className?: string }) {
  return (
    <RoleGuard roles={['admin']}>
      <Button
        asChild
        variant="outline"
        className={cn(
          'h-12 w-full gap-2 rounded-xl px-5 text-base font-semibold text-link sm:w-auto',
          className,
        )}
      >
        <Link to={paths.memberRoles}>
          <ShieldCheck aria-hidden className="size-5" />
          Gestion des rôles
        </Link>
      </Button>
    </RoleGuard>
  );
}
