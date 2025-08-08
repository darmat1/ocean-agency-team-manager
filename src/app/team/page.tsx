import { TeamMemberCard } from '@/components/Team/TeamMemberCard';
import { TeamMember } from '@/lib/types';
import teamData from '@/../public/data/data.json'; // 👈 так можно импортировать локально

const TeamPage = () => {
  const members = teamData as TeamMember[];

  return (
    <main className="p-4 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => (
        <TeamMemberCard key={member.id} member={member} />
      ))}
    </main>
  );
}

export default TeamPage;
