'use client';

import { createContext, useState, ReactNode, useCallback } from 'react';
import { CheckCircleOutlined, InfoCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { ModalState } from '@/lib/types';
import { Modal } from '@/components/Modal';


type NotificationType = 'success' | 'info' | 'error';

interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}



interface OverlayContextType {
  addNotification: (message: string, type: NotificationType) => void;
  showModal: (content: ReactNode, title?: string) => void;
  hideModal: () => void;
}

export const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

const NotificationContainer = ({ notifications, removeNotification }: { notifications: Notification[], removeNotification: (id: number) => void }) => {
  const icons = {
    success: <span className="text-green-500"><CheckCircleOutlined /></span>,
    info: <span className="text-blue-500"><InfoCircleOutlined /></span>,
    error: <span className="text-red-500"><CloseCircleOutlined /></span>,
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 space-y-3">
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

export const OverlayProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [modalState, setModalState] = useState<ModalState | null>(null);

  const removeNotification = useCallback((id: number) => {
    setNotifications(currentNotifications =>
      currentNotifications.filter(n => n.id !== id)
    );
  }, []);

  const showModal = useCallback((content: ReactNode, title?: string) => {
    setModalState({ content, title });
  }, []);

  const hideModal = useCallback(() => {
    setModalState(null);
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


  const contextValue = { addNotification, showModal, hideModal };
  return (
    <OverlayContext.Provider value={contextValue}>
      {children}
      <NotificationContainer notifications={notifications} removeNotification={removeNotification} />
      {modalState && (
        <Modal
          onClose={hideModal}
          title={modalState.title}
        >
          {modalState.content}
        </Modal>
      )}
    </OverlayContext.Provider>
  );
};