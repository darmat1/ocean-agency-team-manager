import { TeamMember } from './types';
import initialTeamData from '@/../public/data/data.json';
//затримка запиту
const API_DELAY = 700;
const LOCAL_STORAGE_KEY = 'team-members';

export const fetchTeamMembers = (): Promise<TeamMember[]> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData) {
          resolve(JSON.parse(localData));
        } else {
          resolve(initialTeamData as TeamMember[]);
        }
      } catch (error) {
        console.error('API Error: Failed to fetch data.', error);
        reject('Failed to load team data.');
      }
    }, API_DELAY);
  });
};

export const saveTeamData = (members: TeamMember[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // рандомна помилка
      if (Math.random() < 0.2) {
        reject('Failed to save data. Please try again.');
        return;
      }

      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(members));
        resolve();
      } catch (error) {
        console.error('API Error: Failed to save data to localStorage.', error);
        reject('Failed to save team data.');
      }
    }, API_DELAY);
  });
};