import { VoiceBadge } from '@/components/common/voice-badge';
import { getFullName, getInitials } from '@/lib/names';
import { cn } from '@/lib/utils';
import type { MemberProfile } from '@/types';

type MemberSummaryCardProps = {
  profile: MemberProfile;
  className?: string;
};

// Carte récapitulative de la fiche : initiales, nom, téléphone (et email sur
// grand écran, comme la maquette web) et badge de voix.
export function MemberSummaryCard({
  profile,
  className,
}: MemberSummaryCardProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-2xl border bg-card p-4',
        className,
      )}
    >
      <span
        aria-hidden
        className="flex size-14 shrink-0 items-center justify-center rounded-full bg-muted font-bold text-muted-foreground"
      >
        {getInitials(profile)}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-semibold break-words">{getFullName(profile)}</p>
        <p className="truncate text-muted-foreground">
          {profile.phone}
          <span className="hidden lg:inline"> · {profile.contact_mail}</span>
        </p>
      </div>
      <VoiceBadge voice={profile.voice_group} />
    </div>
  );
}
