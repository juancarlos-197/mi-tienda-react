import React from 'react';
import { ActiveView } from '../components/layout/Navbar';
import { AdminProductsPage } from '../pages/AdminProductsPage';
import { AdminUsersPage } from '../pages/AdminUsersPage';
import { CourseCurriculumPage } from '../pages/CourseCurriculumPage';
import { LoginPage } from '../pages/LoginPage';
import { ProfilePage } from '../pages/ProfilePage';
import { StorePage } from '../pages/StorePage';
import { HttpNetworkInspector } from '../components/inspector/HttpNetworkInspector';
import { ProtectedRoute } from './ProtectedRoute';

interface AppRoutesProps {
  currentView: ActiveView;
  onNavigate: (view: ActiveView, params?: any) => void;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({ currentView, onNavigate }) => {
  switch (currentView) {
    case 'store':
      return (
        <StorePage
          onNavigateToCourse={() => onNavigate('course')}
          onNavigateToAdmin={() => onNavigate('admin-products')}
        />
      );

    case 'course':
      return (
        <CourseCurriculumPage
          onNavigateToStore={() => onNavigate('store')}
          onNavigateToAdmin={() => onNavigate('admin-products')}
          onNavigateToInspector={() => onNavigate('inspector')}
        />
      );

    case 'inspector':
      return (
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Inspector de Red HTTP & Interceptores
            </h1>
            <p className="text-xs text-neutral-500">
              Módulo 7 y 15: Monitoreo en vivo de peticiones salientes, cabeceras Bearer, latencia y simulación de fallos 401/403/500.
            </p>
          </div>
          <HttpNetworkInspector />
        </div>
      );

    case 'admin-products':
      return (
        <ProtectedRoute requiredRole="admin" onNavigateToLogin={() => onNavigate('login')}>
          <AdminProductsPage />
        </ProtectedRoute>
      );

    case 'admin-users':
      return (
        <ProtectedRoute requiredRole="admin" onNavigateToLogin={() => onNavigate('login')}>
          <AdminUsersPage />
        </ProtectedRoute>
      );

    case 'profile':
      return (
        <ProtectedRoute onNavigateToLogin={() => onNavigate('login')}>
          <ProfilePage />
        </ProtectedRoute>
      );

    case 'login':
      return <LoginPage onSuccess={() => onNavigate('store')} />;

    default:
      return (
        <StorePage
          onNavigateToCourse={() => onNavigate('course')}
          onNavigateToAdmin={() => onNavigate('admin-products')}
        />
      );
  }
};
