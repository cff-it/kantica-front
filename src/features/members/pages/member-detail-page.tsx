import { useParams } from 'react-router';

import { MemberDetail } from '../components/member-detail';
import { MemberLoader } from '../components/member-loader';
import { MemberNotFound } from '../components/member-not-found';
import { parseMemberId } from '../utils';

// Fiche membre (secrétaire, admin), maquettes 06-Fiche-membre. `key` repart
// d'un état neuf quand on passe d'un membre à un autre.
export function MemberDetailPage() {
  const memberId = parseMemberId(useParams().id);

  if (memberId === undefined) {
    return <MemberNotFound />;
  }

  return (
    <MemberLoader key={memberId} id={memberId}>
      {(member) => <MemberDetail member={member} />}
    </MemberLoader>
  );
}
