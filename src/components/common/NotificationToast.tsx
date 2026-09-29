import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import React from 'react';
import { Toast, useNotification } from '../../context/NotificationContext';

export const NotificationToast: React.FC = () => {
  const { toasts, removeToast } = useNotification();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: Toast; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />,
    info: <Info className="h-5 w-5 text-blue-500 shrink-0" />,
  };

  const borderStyles = {
    success: 'border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-neutral-900',
    error: 'border-rose-200 dark:border-rose-900/50 bg-white dark:bg-neutral-900',
    warning: 'border-amber-200 dark:border-amber-900/50 bg-white dark:bg-neutral-900',
    info: 'border-blue-200 dark:border-blue-900/50 bg-white dark:bg-neutral-900',
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all animate-in slide-in-from-bottom-2 ${
        borderStyles[toast.type]
      }`}
    >
      {icons[toast.type]}
      <div className="flex-1 text-sm">
        {toast.title && (
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-0.5">
            {toast.title}
          </h4>
        )}
        <p className="text-neutral-600 dark:text-neutral-300 leading-snug">{toast.message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-0.5 rounded-sm"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
