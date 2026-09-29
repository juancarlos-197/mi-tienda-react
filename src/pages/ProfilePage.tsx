import { Check, Copy, Key, LogOut, ShieldCheck, User as UserIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { formatDate } from '../utils/formatters';

export const ProfilePage: React.FC = () => {
  const { user, token, isAdmin, logout, quickLogin } = useAuth();
  const { success } = useNotification();
  const [copied, setCopied] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 text-center p-8 bg-white dark:bg-neutral-900 border rounded-2xl">
        <p className="text-sm text-neutral-500">No hay una sesión activa.</p>
      </div>
    );
  }

  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      success('Token JWT copiado al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Card */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-neutral-200 shrink-0 shadow-md">
          <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">{user.name}</h1>
            <span
              className={`text-2xs font-semibold px-2 py-0.5 rounded-full ${
                isAdmin
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
              }`}
            >
              {isAdmin ? '👑 Administrador' : '🛍️ Cliente'}
            </span>
          </div>
          <p className="text-xs text-neutral-500 font-mono">{user.email}</p>
          <p className="text-2xs text-neutral-400">
            Miembro desde: {formatDate(user.createdAt)}
          </p>

          <div className="pt-4 flex flex-wrap gap-2 justify-center sm:justify-start">
            <Button
              variant="outline"
              size="sm"
              onClick={() => quickLogin(isAdmin ? 'client' : 'admin')}
            >
              Cambiar a rol {isAdmin ? 'Cliente' : 'Administrador'}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={logout}
              leftIcon={<LogOut className="w-3.5 h-3.5" />}
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* JWT Token Inspector (Demostración Módulo 7 & 8) */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-emerald-500" />
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Token JWT Activo & Cabecera de Autorización
            </h3>
          </div>
          <button
            onClick={handleCopyToken}
            className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copiado' : 'Copiar Token'}</span>
          </button>
        </div>

        <p className="text-xs text-neutral-500 leading-relaxed">
          Este token se almacena en <code>localStorage</code> y el interceptor HTTP lo inyecta automáticamente en cada petición saliente como:
        </p>

        <div className="p-3 bg-neutral-900 text-neutral-100 rounded-xl font-mono text-2xs overflow-x-auto space-y-1">
          <div className="text-emerald-400 font-semibold">// Cabecera HTTP inyectada:</div>
          <div>Authorization: Bearer {token || 'No disponible'}</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <span className="text-neutral-500 text-2xs block">ID de Usuario en Token</span>
            <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200">
              {user.id}
            </span>
          </div>

          <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
            <span className="text-neutral-500 text-2xs block">Permisos Activos (RBAC)</span>
            <span className="font-medium text-neutral-800 dark:text-neutral-200">
              {isAdmin ? 'Acceso total (GET, POST, PUT, DELETE)' : 'Solo lectura catálogo & checkout'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
