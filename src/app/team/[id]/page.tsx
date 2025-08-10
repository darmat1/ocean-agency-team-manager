'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, notFound } from 'next/navigation';
import { Tabs, Avatar, Tag } from 'antd';
import { UserOutlined, UnorderedListOutlined} from '@ant-design/icons';
import { PersonalInfoTab } from '@/components/Team/PersonalInfoTab';
import { TasksTab } from '@/components/Team/TasksTab';
import { Task, TeamMember } from '@/lib/types';
import { useTeam } from '@/hooks/useTeam';
import { useNotification } from '@/hooks/useNotification';
import { PhoneIcon } from '@/components/icons/Phone';
import { TelegramIcon } from '@/components/icons/Telegram';

const TeamMemberPage = () => {
    const params = useParams();
    const id = params.id as string;
    const { members, setMembers, loading: teamLoading } = useTeam();
    const { addNotification } = useNotification();

    // локальний стан поточного користувача (Opitmistic UI)
    const [member, setMember] = useState<TeamMember | null>(null);

    // тут зробив стан для перевірки чи користувач знайдений, для запобігання 404
    const [isMemberSearchDone, setIsMemberSearchDone] = useState(false);

    const taskStats = useMemo(() => {
        // якщо member ще не завантажений, повертаємо нульові значення
        if (!member) return { todo: 0, inProgress: 0, done: 0 };

        return member.tasks.reduce((acc, task) => {
            if (task.status === 'To Do') acc.todo++;
            if (task.status === 'In Progress') acc.inProgress++;
            if (task.status === 'Done') acc.done++;
            return acc;
        }, { todo: 0, inProgress: 0, done: 0 });
    }, [member]);

    useEffect(() => {
        if (!teamLoading) {
            const foundMember = members.find((m: TeamMember) => m.id === id);
            setMember(foundMember || null);
            setIsMemberSearchDone(true);
        }
    }, [id, members, teamLoading]);

    const handleOptimisticUpdate = (updatedData: Partial<TeamMember>) => {
        if (!member) return;
        const originalMember = { ...member };
        const updatedMember = { ...member, ...updatedData };
        setMember(updatedMember);
        try {
            const updatedMembers = members.map(m => (m.id === id ? updatedMember : m));
            setMembers(updatedMembers);
        } catch (error: unknown) {
            addNotification('Failed to save changes. Reverting.', 'error');
            setMember(originalMember);
        }
    };

    if (teamLoading) {
        return <main className="p-8"><div>Loading member data...</div></main>;
    }

    if (!isMemberSearchDone) {
        return <main className="p-8"><div>Finding member...</div></main>
    }

    if (!member) {
        return notFound();
    }

    const tabItems = [
        {
            label: <span className='flex items-center gap-2'><UserOutlined /> Personal Info</span>,
            key: 'personal-info',
            children: <PersonalInfoTab member={member} onUpdate={handleOptimisticUpdate} />,
        },
        {
            label: <span className='flex items-center gap-2'><UnorderedListOutlined /> Tasks</span>,
            key: 'tasks',
            children: <TasksTab member={member} onUpdateTasks={(tasks: Task[]) => handleOptimisticUpdate({ tasks })} />,
        },
    ];

    return (
        <main className="p-4 md:p-8">
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                <div className="flex flex-col sm:flex-row items-start gap-6">
                    {/* Аватар */}
                    <Avatar size={80} src={member.avatar} />
                    
                    {/* Основна інформація */}
                    <div className="flex-grow">
                        <h1 className="text-3xl font-bold">{member.name}</h1>
                        <p className="text-lg text-gray-500">{member.role}</p>
                        <p className="text-md text-gray-400 mt-1">{member.department} Department</p>

                        {/* Контакти */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-gray-600">
                            <div className="flex items-center gap-2">
                                <PhoneIcon />
                                <span>{member.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <TelegramIcon />
                                <span>{member.telegram}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
                        <h3 className="font-semibold text-gray-700 mb-1">Task Summary</h3>
                        <div className="flex gap-2">
                            <Tag color="orange">To Do: {taskStats.todo}</Tag>
                            <Tag color="blue">In Progress: {taskStats.inProgress}</Tag>
                            <Tag color="green">Done: {taskStats.done}</Tag>
                        </div>
                    </div>
                </div>
            </div>
            
            <Tabs defaultActiveKey="personal-info" items={tabItems} />
        </main>
    );
};

export default TeamMemberPage;