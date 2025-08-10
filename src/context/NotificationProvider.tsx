'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { CheckCircleOutlined, InfoCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';


type NotificationType = 'success' | 'info' | 'error';

interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  addNotification: (message: string, type: NotificationType) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NotificationContainer = ({ notifications, removeNotification }: { notifications: Notification[], removeNotification: (id: number) => void }) => {
  const icons = {
    success: <span className="text-green-500"><CheckCircleOutlined /></span>,
    info: <span className="text-blue-500"><InfoCircleOutlined /></span>,
    error: <span className="text-red-500"><CloseCircleOutlined /></span>,
  };

  return (
    <div className="fixed top-5 right-5 z-50 space-y-3">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className="flex items-center gap-3 bg-white shadow-lg rounded-lg p-4 max-w-sm animate-fade-in-right"
          onClick={() => removeNotification(notification.id)}
        >
          <span className="text-xl">{icons[notification.type]}</span>
          <p className="text-gray-800">{notification.message}</p>
        </div>
      ))}
    </div>
  );
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const removeNotification = useCallback((id: number) => {
    setNotifications(currentNotifications =>
      currentNotifications.filter(n => n.id !== id)
    );
  }, []);

  const addNotification = useCallback((message: string, type: NotificationType) => {
    const id = Date.now();
    setNotifications(currentNotifications => [
      ...currentNotifications,
      { id, message, type },
    ]);

    setTimeout(() => {
      removeNotification(id);
    }, 3000);
  }, [removeNotification]);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <NotificationContainer notifications={notifications} removeNotification={removeNotification} />
    </NotificationContext.Provider>
  );
};