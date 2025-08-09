'use client';

import {
  createContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { TeamMember } from '@/lib/types';

interface TeamContextValue {
  members: TeamMember[];
  setMembers: (members: TeamMember[]) => void;
  loading: boolean;
  error: string | null;
}

export const TeamContext = createContext<TeamContextValue | undefined>(undefined);

export const TeamProvider = ({ children }: { children: ReactNode }) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const local = localStorage.getItem('team-members');
        if (local) {
          setMembers(JSON.parse(local));
          setLoading(false);
          return;
        }

        const res = await fetch('/data/data.json');
        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status}`);
        }

        const data: TeamMember[] = await res.json();

        setTimeout(() => {
          localStorage.setItem('team-members', JSON.stringify(data));
          setMembers(data);
          setLoading(false);
        }, 1000);
      } catch (error: unknown) {
        setError(error instanceof Error ? error.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    localStorage.setItem('team-members', JSON.stringify(members));
  }, [members]);

  return (
    <TeamContext.Provider
      value={{
        members,
        setMembers,
        loading,
        error,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};
