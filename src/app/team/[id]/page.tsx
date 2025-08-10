'use client';

import { useParams, notFound } from 'next/navigation';
import { Tabs, Avatar } from 'antd';
import { UserOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { PersonalInfoTab } from '@/components/Team/PersonalInfoTab';
import { TasksTab } from '@/components/Team/TasksTab';
import { TeamMember } from '@/lib/types';
import { useTeam } from '@/hooks/useTeam';


const TeamMemberPage = () => {
  const params = useParams(); // 👈 Используем хук
  const id = params.id as string; 
  const { members, loading } = useTeam();

  if (loading) {
    return <main className="p-8"><div>Loading member data...</div></main>;
  }

  const member = members.find((m: TeamMember) => m.id === id);

  if (!member) {
    return notFound();
  }

  const tabItems = [
    {
      label: (
        <span className='flex items-center gap-2'>
          <UserOutlined />
          Personal Info
        </span>
      ),
      key: 'personal-info',
      children: <PersonalInfoTab member={member} />,
    },
    {
      label: (
        <span className='flex items-center gap-2'>
          <UnorderedListOutlined />
          Tasks
        </span>
      ),
      key: 'tasks',
      children: <TasksTab member={member} />,
    },
  ];

  return (
    <main className="p-4 md:p-8">
      <div className="flex items-center gap-4 mb-6">
        <Avatar size={64} src={member.avatar} />
        <div>
          <h1 className="text-3xl font-bold">{member.name}</h1>
          <p className="text-lg text-gray-500">{member.role}</p>
        </div>
      </div>
      
      <Tabs defaultActiveKey="personal-info" items={tabItems} />
    </main>
  );
};

export default TeamMemberPage;