"use client";

import { FC, ReactNode, useEffect } from 'react';
import { CloseOutlined } from '@ant-design/icons';

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export const Modal: FC<ModalProps> = ({ onClose, children, title }) => {
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg m-4 flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {title || 'Modal'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 transition-colors"
            aria-label="Close modal"
          >
            <CloseOutlined style={{ fontSize: '20px' }} />
          </button>
        </div>
        <div className="pt-4 flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
}