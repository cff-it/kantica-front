import { Clock } from 'lucide-react';

import { cn } from '@/lib/utils';

export function PendingStatusBadge({ className }: { className?: string }) {
  return (
    <p
      role="status"
      className={cn(
        'inline-flex items-center gap-2 rounded-lg bg-warning px-3 py-2',
        'font-semibold text-warning-foreground',
        className,
      )}
    >
      <Clock aria-hidden className="size-4" />
      En attente de validation
    </p>
  );
}
