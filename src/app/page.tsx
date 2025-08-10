'use client';

import { useMemo } from 'react';
import { Card, Statistic, List, Avatar, Spin } from 'antd';
import { UserOutlined, TeamOutlined, SyncOutlined } from '@ant-design/icons';
import { DepartmentChart, TaskStatusChart } from '@/components/Dashboard';
import Link from 'next/link';
import { useTeam } from '@/hooks/useTeam';

export default function HomePage() {
  const { members, loading } = useTeam();

  const stats = useMemo(() => {
    if (!members.length) return { total: 0, active: 0, inProgress: 0 };

    const allTasks = members.flatMap(m => m.tasks);
    return {
      total: members.length,
      active: members.filter(m => m.status === 'active').length,
      inProgress: allTasks.filter(t => t.status === 'In Progress').length,
    };
  }, [members]);

  const departmentData = useMemo(() => {
    const counts = members.reduce((acc, member) => {
      acc[member.department] = (acc[member.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([type, value]) => ({ type, value }));
  }, [members]);

  const taskStatusData = useMemo(() => {
    const allTasks = members.flatMap(m => m.tasks);
    const counts = allTasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([status, count]) => ({ status, count }));
  }, [members]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <main className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Link href="/team" className="block">
          <Card hoverable>
            <Statistic title="Total Members" value={stats.total} prefix={<TeamOutlined />} />
          </Card>
        </Link>
        <Link href="/team" className="block">
          <Card hoverable>
            <Statistic title="Active Members" value={stats.active} prefix={<UserOutlined />} />
          </Card>
        </Link>
        <Link href="/team" className="block">
          <Card hoverable>
            <Statistic title="Tasks In Progress" value={stats.inProgress} prefix={<SyncOutlined spin />} />
          </Card>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          title={
            <Link href="/team" className="hover:underline">
              Team Composition
            </Link>
          }
          className="lg:col-span-1">
          <DepartmentChart data={departmentData} />
        </Card>
        <Card title="Tasks Overview" className="lg:col-span-2">
          <TaskStatusChart data={taskStatusData} />
        </Card>
        <Card
          title={
            <Link href="/team" className="hover:underline">
              Team Overview
            </Link>
          }
          className="lg:col-span-3">
          <List
            itemLayout="horizontal"
            dataSource={members}
            renderItem={(member) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={member.avatar} />}
                  title={<Link href={`/team/${member.id}`} className="font-semibold hover:underline">{member.name}</Link>}
                  description={`${member.role} - ${member.department}`}
                />
              </List.Item>
            )}
          />
        </Card>
      </div>
    </main>
  );
}