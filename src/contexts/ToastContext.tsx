'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import ToastNotification, { Toast } from '../components/ToastNotification';

interface ToastContextType {
  showToast: (toast: Toast) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [currentToast, setCurrentToast] = useState<Toast | null>(null);

  const showToast = (toast: Toast) => {
    setCurrentToast(toast);
  };

  const hideToast = (id: string) => {
    setCurrentToast(null);
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastNotification
        toast={currentToast}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
};
