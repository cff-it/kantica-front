import { useParams } from 'react-router';

import { MemberEdit } from '../components/member-edit';
import { MemberLoader } from '../components/member-loader';
import { MemberNotFound } from '../components/member-not-found';
import { parseMemberId } from '../utils';

// « Modifier la fiche » d'un membre (secrétaire, admin). `key` repart d'un
// formulaire neuf quand on passe d'un membre à un autre.
export function MemberEditPage() {
  const memberId = parseMemberId(useParams().id);

  if (memberId === undefined) {
    return <MemberNotFound />;
  }

  return (
    <MemberLoader key={memberId} id={memberId}>
      {(member) => <MemberEdit member={member} />}
    </MemberLoader>
  );
}
