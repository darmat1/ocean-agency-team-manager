import { TeamMember } from '@/lib/types';
import { FC } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface TeamMemberCardProps {
  member: TeamMember;
}

export const TeamMemberCard: FC<TeamMemberCardProps> = ({ member }) => {
  return (
    <Link href={`/team/${member.id}`}>
      <div className="flex flex-col items-center gap-2 p-4 border rounded-xl hover:shadow-md transition">
        <Image
          src={member.avatar}
          alt={member.name}
          width={100}
          height={100}
          className="rounded-full object-cover"
        />
        <h3 className="text-lg font-semibold">{member.name}</h3>
        <p className="text-sm text-gray-500">{member.role}</p>
        <p className="text-sm text-gray-400">{member.department}</p>
        <p className="text-sm">
          📞 {member.phone} <br />
          💬 {member.telegram}
        </p>
        <span
          className={`text-xs font-medium px-2 py-1 rounded ${
            member.status === 'active'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-200 text-gray-600'
          }`}
        >
          {member.status}
        </span>
      </div>
    </Link>
  );
};
