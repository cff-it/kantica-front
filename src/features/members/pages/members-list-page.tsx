import { PageHeader } from '@/components/common/page-header';

import { AddMemberLink } from '../components/add-member-link';
import { ExportMembersDialog } from '../components/export-members-dialog';
import { ImportMembersLink } from '../components/import-members-link';
import { MemberRolesLink } from '../components/member-roles-link';
import { MembersResults } from '../components/members-results';
import { MembersSearchField } from '../components/members-search-field';
import { VoiceFilter } from '../components/voice-filter';
import { useMembers } from '../hooks/use-members';
import { useMembersFilters } from '../hooks/use-members-filters';
import { getExportCount, getRegisteredLabel } from '../utils';

// Liste des membres (secrétaire, admin), maquette 05-Liste-membres. L'export
// reprend le filtre de voix actif, mais pas la recherche (le back n'exporte
// que par voix).
export function MembersListPage() {
  const filters = useMembersFilters();
  const members = useMembers(filters.query);
  const meta = members.data?.meta;

  return (
    <>
      <PageHeader
        title="Membres"
        description={meta ? getRegisteredLabel(meta.registered_count) : undefined}
        actions={
          <div className="grid w-full grid-cols-2 gap-3 sm:flex sm:w-auto">
            <AddMemberLink className="col-span-2 sm:col-span-1" />
            <ImportMembersLink />
            <ExportMembersDialog
              count={getExportCount(meta, filters.voice)}
              voice={filters.voice}
            />
            <MemberRolesLink className="col-span-2 sm:col-span-1" />
          </div>
        }
      />
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <MembersSearchField
          value={filters.search}
          onChange={filters.setSearch}
        />
        <VoiceFilter
          value={filters.voice}
          onChange={filters.setVoice}
          counts={meta?.voice_counts}
        />
      </div>
      <MembersResults
        query={members}
        filtered={filters.filtered}
        onPageChange={filters.setPage}
      />
    </>
  );
}
