'use client';
import { NotificationContext } from '@/context/NotificationProvider';
import { useContext } from 'react';

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};