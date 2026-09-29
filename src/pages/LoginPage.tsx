import { KeyRound, Lock, LogIn, Mail, ShieldCheck, User as UserIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { useForm } from '../hooks/useForm';
import { validators } from '../utils/validators';

interface LoginPageProps {
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login, register, quickLogin } = useAuth();
  const { success, error: toastError } = useNotification();
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const loginForm = useForm(
    { email: 'admin@mitienda.com', password: 'password123' },
    {
      email: [validators.required('El correo es obligatorio'), validators.email()],
      password: [validators.required('La contraseña es requerida'), validators.minLength(6)],
    },
    async (values) => {
      setAuthError(null);
      try {
        await login(values);
        success('¡Sesión iniciada correctamente!');
        onSuccess();
      } catch (err: any) {
        const msg = err.message || 'Error en las credenciales';
        setAuthError(msg);
        toastError(msg);
      }
    }
  );

  const registerForm = useForm(
    { name: '', email: '', password: '', role: 'client' as 'client' | 'admin' },
    {
      name: [validators.required('El nombre es obligatorio'), validators.minLength(3)],
      email: [validators.required('El correo es obligatorio'), validators.email()],
      password: [validators.required('La contraseña es requerida'), validators.minLength(6)],
    },
    async (values) => {
      setAuthError(null);
      try {
        await register(values);
        success('¡Cuenta registrada exitosamente!');
        onSuccess();
      } catch (err: any) {
        const msg = err.message || 'Error al registrar usuario';
        setAuthError(msg);
        toastError(msg);
      }
    }
  );

  const handleQuick = async (role: 'admin' | 'client') => {
    try {
      await quickLogin(role);
      success(`Sesión iniciada con rol ${role.toUpperCase()}`);
      onSuccess();
    } catch (e: any) {
      toastError(e.message);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="w-12 h-12 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center mx-auto shadow-md">
          <KeyRound className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white pt-2">
          {isRegisterMode ? 'Crear Cuenta Nueva' : 'Iniciar Sesión'}
        </h2>
        <p className="text-xs text-neutral-500">
          Módulos 8 y 10: Autenticación, JWT, roles y persistencia de sesión.
        </p>
      </div>

      {/* 1-Click Demo Login Box */}
      <div className="p-3.5 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700/80 space-y-2">
        <div className="flex items-center justify-between text-2xs font-semibold text-neutral-500 uppercase tracking-wider">
          <span>Acceso Rápido para Pruebas (1 Clic)</span>
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleQuick('admin')}
            className="p-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800/80 rounded-lg font-semibold transition-colors text-left flex flex-col cursor-pointer"
          >
            <span>👑 Administrador</span>
            <span className="text-2xs font-normal opacity-80">admin@mitienda.com</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuick('client')}
            className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800/80 rounded-lg font-semibold transition-colors text-left flex flex-col cursor-pointer"
          >
            <span>🛍️ Cliente</span>
            <span className="text-2xs font-normal opacity-80">ana@mitienda.com</span>
          </button>
        </div>
      </div>

      {/* Error alert */}
      {authError && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 rounded-lg text-xs text-rose-700 dark:text-rose-300">
          {authError}
        </div>
      )}

      {/* Form */}
      {!isRegisterMode ? (
        <form onSubmit={loginForm.handleSubmit} className="space-y-4">
          <Input
            label="Correo Electrónico"
            type="email"
            name="email"
            value={loginForm.values.email}
            onChange={loginForm.handleChange}
            onBlur={loginForm.handleBlur}
            error={loginForm.touched.email ? loginForm.errors.email : undefined}
            leftIcon={<Mail className="w-4 h-4" />}
            placeholder="admin@mitienda.com"
          />

          <Input
            label="Contraseña"
            type="password"
            name="password"
            value={loginForm.values.password}
            onChange={loginForm.handleChange}
            onBlur={loginForm.handleBlur}
            error={loginForm.touched.password ? loginForm.errors.password : undefined}
            leftIcon={<Lock className="w-4 h-4" />}
            placeholder="••••••••"
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={loginForm.isSubmitting}
            leftIcon={<LogIn className="w-4 h-4" />}
          >
            Ingresar a la Plataforma
          </Button>
        </form>
      ) : (
        <form onSubmit={registerForm.handleSubmit} className="space-y-4">
          <Input
            label="Nombre Completo"
            name="name"
            value={registerForm.values.name}
            onChange={registerForm.handleChange}
            onBlur={registerForm.handleBlur}
            error={registerForm.touched.name ? registerForm.errors.name : undefined}
            leftIcon={<UserIcon className="w-4 h-4" />}
            placeholder="Carlos Mendoza"
          />

          <Input
            label="Correo Electrónico"
            type="email"
            name="email"
            value={registerForm.values.email}
            onChange={registerForm.handleChange}
            onBlur={registerForm.handleBlur}
            error={registerForm.touched.email ? registerForm.errors.email : undefined}
            leftIcon={<Mail className="w-4 h-4" />}
            placeholder="carlos@ejemplo.com"
          />

          <Input
            label="Contraseña"
            type="password"
            name="password"
            value={registerForm.values.password}
            onChange={registerForm.handleChange}
            onBlur={registerForm.handleBlur}
            error={registerForm.touched.password ? registerForm.errors.password : undefined}
            leftIcon={<Lock className="w-4 h-4" />}
            placeholder="••••••••"
          />

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Rol deseado
            </label>
            <select
              name="role"
              value={registerForm.values.role}
              onChange={registerForm.handleChange}
              className="w-full px-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200"
            >
              <option value="client">Cliente de la tienda</option>
              <option value="admin">Administrador (Acceso a CRUD)</option>
            </select>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            isLoading={registerForm.isSubmitting}
          >
            Completar Registro
          </Button>
        </form>
      )}

      {/* Toggle mode */}
      <div className="text-center pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
        <button
          type="button"
          onClick={() => {
            setIsRegisterMode(!isRegisterMode);
            setAuthError(null);
          }}
          className="text-blue-600 dark:text-blue-400 hover:underline font-semibold cursor-pointer"
        >
          {isRegisterMode
            ? '¿Ya tienes una cuenta? Inicia sesión aquí'
            : '¿No tienes cuenta aún? Regístrate gratis'}
        </button>
      </div>
    </div>
  );
};
