import { useEffect, useState } from 'react';
import { TeamMember } from '@/lib/types';

export const useTeamMembers = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
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
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Unknown error');
        }
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { members, setMembers, loading, error };
};
