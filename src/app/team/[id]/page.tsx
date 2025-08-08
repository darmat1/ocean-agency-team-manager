import { notFound } from 'next/navigation';
import { TeamMember } from '@/lib/types';
import teamData from '@/../public/data/data.json';

type Props = {
  params: { id: string };
};

const TeamMemberPage = async ({ params }: Props) => {
  const { id } = params;

  const members = teamData as TeamMember[];
  const member = members.find((m) => String(m.id) === id);

  if (!member) return notFound();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">{member.name}</h1>
      <p className="text-gray-600">Role: {member.role}</p>
      <p>Phone: {member.phone}</p>
      <p>Telegram: {member.telegram}</p>
    </main>
  );
}

export default TeamMemberPage;