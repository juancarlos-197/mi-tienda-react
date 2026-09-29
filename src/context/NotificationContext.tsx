import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { http } from '../interceptors/httpInterceptor';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface NotificationContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, message, duration = 4000 }: Omit<Toast, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const newToast: Toast = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback((message: string, title?: string) => showToast({ type: 'success', message, title }), [showToast]);
  const error = useCallback((message: string, title?: string) => showToast({ type: 'error', message, title }), [showToast]);
  const warning = useCallback((message: string, title?: string) => showToast({ type: 'warning', message, title }), [showToast]);
  const info = useCallback((message: string, title?: string) => showToast({ type: 'info', message, title }), [showToast]);

  // Conectar con el interceptor HTTP para mostrar automáticamente errores 401, 403, 500
  useEffect(() => {
    const unsubscribe = http.onError(({ status, message }) => {
      if (status === 401) {
        showToast({
          type: 'warning',
          title: 'Interceptor HTTP (401)',
          message: message || 'Sesión expirada o no autenticado',
        });
      } else if (status === 403) {
        showToast({
          type: 'error',
          title: 'Interceptor HTTP (403)',
          message: message || 'Acceso restringido a administradores',
        });
      } else if (status >= 500) {
        showToast({
          type: 'error',
          title: 'Error de Servidor (500)',
          message: message || 'Fallo interno en el servidor',
        });
      }
    });

    return unsubscribe;
  }, [showToast]);

  return (
    <NotificationContext.Provider
      value={{ toasts, showToast, removeToast, success, error, warning, info }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe utilizarse dentro de un NotificationProvider');
  }
  return context;
};
