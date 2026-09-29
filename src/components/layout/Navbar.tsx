import { Activity, BookOpen, ChevronDown, Laptop, LogIn, LogOut, Moon, ShoppingBag, Sun, UserCheck } from 'lucide-react';
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

export type ActiveView = 'store' | 'course' | 'inspector' | 'admin-products' | 'admin-users' | 'profile' | 'login';

interface NavbarProps {
  currentView: ActiveView;
  onNavigate: (view: ActiveView, params?: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { user, isAuthenticated, isAdmin, logout, quickLogin } = useAuth();
  const { totalItems, setIsCartOpen } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('store')}
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center font-bold text-lg shadow-xs group-hover:scale-105 transition-transform">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-neutral-900 dark:text-white block leading-none">
                Mi Tienda React
              </span>
              <span className="text-2xs text-blue-600 dark:text-blue-400 font-semibold tracking-wide">
                FULL-STACK & CURSO
              </span>
            </div>
          </button>
        </div>

        {/* Central View Switcher */}
        <nav className="hidden md:flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => onNavigate('store')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentView === 'store'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-2xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Tienda en Vivo</span>
          </button>

          <button
            onClick={() => onNavigate('course')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentView === 'course'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-2xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
            <span>Curso (15 Módulos)</span>
          </button>

          <button
            onClick={() => onNavigate('inspector')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              currentView === 'inspector'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-2xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>Inspector HTTP</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => onNavigate('admin-products')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentView === 'admin-products' || currentView === 'admin-users'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-2xs font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>CRUD Admin</span>
            </button>
          )}
        </nav>

        {/* Right Actions: Cart, Theme Toggle, Auth */}
        <div className="flex items-center gap-2.5">
          {/* Quick Demo Switcher if not authenticated */}
          {!isAuthenticated && (
            <div className="hidden lg:flex items-center gap-1 text-2xs">
              <span className="text-neutral-400">Demo:</span>
              <button
                onClick={() => quickLogin('admin')}
                className="px-2 py-1 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 hover:bg-amber-200 transition-colors font-medium cursor-pointer"
                title="Iniciar sesión inmediatamente con rol Admin"
              >
                Admin
              </button>
              <button
                onClick={() => quickLogin('client')}
                className="px-2 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200 hover:bg-blue-200 transition-colors font-medium cursor-pointer"
                title="Iniciar sesión inmediatamente como Cliente"
              >
                Cliente
              </button>
            </div>
          )}

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Cambiar tema claro/oscuro"
            className="p-2 rounded-lg text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-600" />}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            aria-label="Abrir carrito de compras"
            className="relative p-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-full text-2xs font-bold flex items-center justify-center animate-in zoom-in">
                {totalItems}
              </span>
            )}
          </button>

          {/* User Profile or Login */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 pl-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer text-left"
              >
                <div className="w-6 h-6 rounded-full overflow-hidden bg-neutral-200 shrink-0">
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <div className="hidden sm:block text-xs leading-none">
                  <div className="font-semibold text-neutral-900 dark:text-white truncate max-w-24">
                    {user.name.split(' ')[0]}
                  </div>
                  <div className="text-2xs text-neutral-400 uppercase font-mono">{user.role}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-52 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl py-1 z-50 text-xs text-neutral-700 dark:text-neutral-200">
                    <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800">
                      <p className="font-semibold text-neutral-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-2xs text-neutral-500 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onNavigate('profile');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Mi Perfil & Token JWT</span>
                    </button>

                    {isAdmin && (
                      <>
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            onNavigate('admin-products');
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 cursor-pointer font-medium text-amber-700 dark:text-amber-400"
                        >
                          <Laptop className="w-3.5 h-3.5" />
                          <span>Panel CRUD Productos</span>
                        </button>
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            onNavigate('admin-users');
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2 cursor-pointer font-medium text-amber-700 dark:text-amber-400"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Gestión de Usuarios</span>
                        </button>
                      </>
                    )}

                    <div className="border-t border-neutral-100 dark:border-neutral-800 my-1" />

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                        onNavigate('store');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Acceder</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile nav subbar */}
      <div className="flex md:hidden border-t border-neutral-200 dark:border-neutral-800 overflow-x-auto px-4 py-2 gap-2 text-xs">
        <button
          onClick={() => onNavigate('store')}
          className={`px-3 py-1 rounded-md shrink-0 ${
            currentView === 'store' ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold' : 'text-neutral-600 dark:text-neutral-400'
          }`}
        >
          Tienda
        </button>
        <button
          onClick={() => onNavigate('course')}
          className={`px-3 py-1 rounded-md shrink-0 ${
            currentView === 'course' ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold' : 'text-neutral-600 dark:text-neutral-400'
          }`}
        >
          Curso (15)
        </button>
        <button
          onClick={() => onNavigate('inspector')}
          className={`px-3 py-1 rounded-md shrink-0 ${
            currentView === 'inspector' ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-semibold' : 'text-neutral-600 dark:text-neutral-400'
          }`}
        >
          Inspector HTTP
        </button>
        {isAdmin && (
          <button
            onClick={() => onNavigate('admin-products')}
            className={`px-3 py-1 rounded-md shrink-0 ${
              currentView === 'admin-products' ? 'bg-amber-600 text-white font-semibold' : 'text-amber-600 dark:text-amber-400'
            }`}
          >
            Admin CRUD
          </button>
        )}
      </div>
    </header>
  );
};
