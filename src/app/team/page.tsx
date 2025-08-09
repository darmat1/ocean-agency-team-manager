'use client';

import { SortIcon, SortIconAsc } from '@/components/icons/Sort';
import { TeamTableRow } from '@/components/Team/TeamTableRow';
import { useTeam } from '@/hooks/useTeam';
import { useMemo, useState } from 'react';

type SortableKeys = 'name' | 'role' | 'department';

export default function TeamPage() {
    const { members, loading, error } = useTeam();
    const [sortConfig, setSortConfig] = useState<{
        key: SortableKeys | null;
        direction: 'ascending' | 'descending';
    }>({ key: null, direction: 'ascending' });

    

    const sortedMembers = useMemo(() => {
        const sortableItems = [...members];
        const { key, direction } = sortConfig;
        if (!key) {
            return sortableItems;
        }
        sortableItems.sort((a, b) => {
            const valueA = a[key];
            const valueB = b[key];

            if (valueA < valueB) {
                return direction === 'ascending' ? -1 : 1;
            }
            if (valueA > valueB) {
                return direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
        return sortableItems;
    }, [members, sortConfig]);

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
            {members.length === 0 ? (
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
                                        Role{getSortIcon('role')}
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
                            {sortedMembers.map((member) => (
                                <TeamTableRow key={member.id} member={member} />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
}