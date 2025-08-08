import { TeamMember } from '@/lib/types';
import { FC } from 'react';
import Image from 'next/image';

interface TeamMemberCardProps {
  member: TeamMember;
}

export const TeamMemberCard: FC<TeamMemberCardProps> = ({ member }) => {
  return (
    <div>
      <Image src={member.avatar} alt={member.name} width={150} height={150} />
      <h3>{member.name}</h3>
      <p>{member.role}</p>
      <p>{member.department}</p>
      <p>{member.status}</p>
      <p>{member.phone}</p>
      <p>{member.telegram}</p>
    </div>
  );
};