'use client';

import {
  createContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { TeamMember } from '@/lib/types';

import initialTeamData from '@/../public/data/data.json';

interface TeamContextValue {
  members: TeamMember[];
  setMembers: (members: TeamMember[]) => void;
  loading: boolean;
  error: string | null;
  isDataModified: boolean; 
  resetToDefault: () => void; 
}

export const TeamContext = createContext<TeamContextValue | undefined>(undefined);

export const TeamProvider = ({ children }: { children: ReactNode }) => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDataModified, setIsDataModified] = useState(false);

  useEffect(() => {
    try {
      const localDataString = localStorage.getItem('team-members');
      const defaultDataString = JSON.stringify(initialTeamData);

      if (localDataString) {
        const parsedData = JSON.parse(localDataString);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          setMembers(parsedData);
          setIsDataModified(localDataString !== defaultDataString);
        } else {
          setMembers(initialTeamData as TeamMember[]);
          localStorage.setItem('team-members', defaultDataString);
          setIsDataModified(false); 
        }
      } else {
        setMembers(initialTeamData as TeamMember[]);
        localStorage.setItem('team-members', defaultDataString);
        setIsDataModified(false); 
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred');
      setMembers(initialTeamData as TeamMember[]);
      setIsDataModified(false);
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {

    if (loading) {
      return;
    }
    
    const currentDataString = JSON.stringify(members);
    localStorage.setItem('team-members', currentDataString);
    const defaultDataString = JSON.stringify(initialTeamData);
    setIsDataModified(currentDataString !== defaultDataString);
  }, [members, loading]);

  const resetToDefault = () => {
    setMembers(initialTeamData as TeamMember[]);
  };

  return (
    <TeamContext.Provider
      value={{
        members,
        setMembers,
        loading,
        error,
        isDataModified,
        resetToDefault,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};