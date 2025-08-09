'use client';

import { SortIcon, SortIconAsc } from '@/components/icons/Sort';
import { TeamTableRow } from '@/components/Team/TeamTableRow';
import { useTeam } from '@/hooks/useTeam';
import { TeamMember } from '@/lib/types';
import { Input, Select } from 'antd';
import { useMemo, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

type SortableKeys = 'name' | 'role' | 'department';

export default function TeamPage() {
    const { members, loading, error } = useTeam();
    const [sortConfig, setSortConfig] = useState<{
        key: SortableKeys | null;
        direction: 'ascending' | 'descending';
    }>({ key: null, direction: 'ascending' });

    const [searchTerm, setSearchTerm] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
    const isDesktop = useMediaQuery({ query: '(min-width: 768px)' });

    const uniqueDepartments = useMemo(() => {
        if (!members) return [];
        const departments = new Set(members.map(member => member.department));
        return Array.from(departments); 
    }, [members]);

    const filteredAndSortedMembers = useMemo(() => {
        let filteredItems: TeamMember[] = [...members];
        if (searchTerm) {
            filteredItems = filteredItems.filter(member =>
                member.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (departmentFilter) {
            filteredItems = filteredItems.filter(member =>
                member.department === departmentFilter
            );
        }
        const { key, direction } = sortConfig;
        if (key) {
            filteredItems.sort((a, b) => {
                const valueA = a[key];
                const valueB = b[key];
                if (valueA < valueB) return direction === 'ascending' ? -1 : 1;
                if (valueA > valueB) return direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }

        return filteredItems;
    }, [members, searchTerm, departmentFilter, sortConfig]);

    const requestSort = (key: SortableKeys) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIcon = (key: SortableKeys) => {
        if (sortConfig.key !== key) {
            return <SortIcon />;
        }
        return sortConfig.direction === 'ascending' ? <SortIconAsc /> : <SortIcon />;
    };

    if (loading) {
        return (
            <main className="p-4 md:p-8">
                <h1 className="text-2xl font-bold mb-6">Team Members</h1>
                <p>Loading data...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="p-4 md:p-8">
                <h1 className="text-2xl font-bold mb-6">Team Members</h1>
                <p className="text-red-500">Error loading data: {error}</p>
            </main>
        );
    }

    return (
        <main className="p-4 md:p-8">
            <h1 className="text-2xl font-bold mb-6">Team Members</h1>
            <div className="flex items-center gap-2 md:gap-4 flex-wrap mb-3 w-full md:w-auto">
                <Input.Search
                    placeholder="Search by name"
                    className='w-full md:w-auto'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: isDesktop ? 240 : '100%' }}
                    allowClear
                />
                <Select
                    className='w-full md:w-auto'
                    placeholder="Filter by Department"
                    value={departmentFilter}
                    onChange={(value) => setDepartmentFilter(value)}
                    style={{ width: isDesktop ? 200 : '100%' }}
                    allowClear
                >
                    {uniqueDepartments.map(dept => (
                        <Select.Option key={dept} value={dept}>
                            {dept}
                        </Select.Option>
                    ))}
                </Select>
            </div>
            {filteredAndSortedMembers.length === 0 ? (
                <p>No team members found.</p>
            ) : (
                <div className="md:border md:border-gray-200 md:rounded-lg md:overflow-hidden md:shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="hidden md:table-header-group bg-gray-100 border-b border-b-gray-200 text-gray-600">
                            <tr>
                                <th className="p-4 font-semibold">
                                    <button onClick={() => requestSort('name')} className="sort-button cursor-pointer flex items-center gap-1">
                                        Employee {getSortIcon('name')}
                                    </button></th>
                                <th className="p-4">
                                    <button onClick={() => requestSort('role')} className="sort-button cursor-pointer flex items-center gap-1">
                                        Role {getSortIcon('role')}
                                    </button>
                                </th>
                                <th className="p-4">
                                    <button onClick={() => requestSort('department')} className="sort-button cursor-pointer flex items-center gap-1">
                                        Department {getSortIcon('department')}
                                    </button>
                                </th>
                                <th className="p-4 font-semibold">Contact</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredAndSortedMembers.map((member: TeamMember) => (
                                <TeamTableRow key={member.id} member={member} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
}