import { ShieldAlert } from 'lucide-react';
import React from 'react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../models/user.model';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  onNavigateToLogin: () => void;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  onNavigateToLogin,
}) => {
  const { user, isAuthenticated, loading, quickLogin } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
          Ruta Protegida por Autenticación
        </h3>
        <p className="text-xs text-neutral-500">
          Debes iniciar sesión para acceder a esta vista.
        </p>
        <div className="pt-2">
          <Button variant="primary" onClick={onNavigateToLogin}>
            Iniciar Sesión
          </Button>
        </div>
      </div>
    );
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-center space-y-4 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
          Permisos Insuficientes (HTTP 403 Forbidden)
        </h3>
        <p className="text-xs text-neutral-500">
          Esta vista requiere rol <strong>{requiredRole}</strong>. Tu rol actual es <strong>{user?.role}</strong>.
        </p>
        <div className="pt-2">
          <Button variant="primary" onClick={() => quickLogin(requiredRole)}>
            Conectarse como {requiredRole} (1 Clic)
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
