'use client';

import { createContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { Task, TeamMember } from '@/lib/types';
import * as api from '@/lib/api';
import initialTeamData from '@/../public/data/data.json';
import { useOverlay } from '@/hooks/useOverlay';

interface TeamContextValue {
    members: TeamMember[];
    loading: boolean;
    error: string | null;
    isDataModified: boolean;
    updateMemberInfo: (memberId: string, data: { phone: string; telegram: string }) => Promise<void>;
    updateMemberTasks: (memberId: string, tasks: Task[]) => Promise<void>;
    resetToDefault: () => Promise<void>;
}

export const TeamContext = createContext<TeamContextValue | undefined>(undefined);

export const TeamProvider = ({ children }: { children: ReactNode }) => {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDataModified, setIsDataModified] = useState(false);
    const { addNotification } = useOverlay();

    useEffect(() => {
        setLoading(true);
        api.fetchTeamMembers()
            .then(data => {
                setMembers(data);
                const defaultDataString = JSON.stringify(initialTeamData);
                setIsDataModified(JSON.stringify(data) !== defaultDataString);
            })
            .catch(setError)
            .finally(() => setLoading(false));
    }, []);

    const updateMemberInfo = useCallback(async (memberId: string, data: { phone: string; telegram: string }) => {
        const originalMembers = [...members];

        const updatedMembers = members.map(m =>
            m.id === memberId ? { ...m, ...data } : m
        );
        setMembers(updatedMembers);

        try {
            await api.saveTeamData(updatedMembers);
            const defaultDataString = JSON.stringify(initialTeamData);
            setIsDataModified(JSON.stringify(updatedMembers) !== defaultDataString);
        } catch (err) {
            addNotification(typeof err === 'string' ? err : 'Update failed', 'error');
            setMembers(originalMembers);
        }
    }, [members, addNotification]);

    const resetToDefault = useCallback(async () => {
        const defaultData = initialTeamData as TeamMember[];
        setMembers(defaultData);
        try {
            await api.saveTeamData(defaultData);
            setIsDataModified(false);
            addNotification('Data has been reset to default.', 'success');
        } catch (err) {
            addNotification(typeof err === 'string' ? err : 'Reset failed', 'error');
            //тут в випадку помилки тултіп виводиться, але дані всеодно перезаписуються на дефолтні
            api.fetchTeamMembers().then(setMembers);
        }
    }, [addNotification]);

    const updateMemberTasks = useCallback(async (memberId: string, tasks: Task[]) => {
        const originalMembers = [...members];
        //Optimistic UI - оновлення стану до запиту на сервер
        const updatedMembers = members.map(m =>
            m.id === memberId ? { ...m, tasks } : m
        );
        setMembers(updatedMembers);

        try {
            await api.saveTeamData(updatedMembers);
        } catch (err) {
            //відкат до попереднього стану
            setMembers(originalMembers);
            addNotification(typeof err === 'string' ? err : 'Failed to update tasks', 'error');
        }
    }, [members, addNotification]);


    return (
        <TeamContext.Provider
            value={{
                members,
                loading,
                error,
                isDataModified,
                updateMemberInfo,
                updateMemberTasks,
                resetToDefault,
            }}
        >
            {children}
        </TeamContext.Provider>
    );
};