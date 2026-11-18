type MemberNameProps = {
  member: { last_name: string; first_name: string | null };
};

// « NOM Prénom » : le nom en gras et en majuscules, comme sur la maquette.
export function MemberName({ member }: MemberNameProps) {
  return (
    <>
      <span className="font-bold uppercase">{member.last_name}</span>
      {member.first_name ? ` ${member.first_name}` : null}
    </>
  );
}
