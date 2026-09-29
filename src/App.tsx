import React, { useEffect, useState } from 'react';
import { CartDrawer } from './components/cart/CartDrawer';
import { Footer } from './components/layout/Footer';
import { ActiveView, Navbar } from './components/layout/Navbar';
import { NotificationToast } from './components/common/NotificationToast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import { AppRoutes } from './routes/AppRoutes';

function MainApp() {
  const [currentView, setCurrentView] = useState<ActiveView>(() => {
    const hash = window.location.hash.replace('#', '') as ActiveView;
    const validViews: ActiveView[] = [
      'store',
      'course',
      'inspector',
      'admin-products',
      'admin-users',
      'profile',
      'login',
    ];
    return validViews.includes(hash) ? hash : 'store';
  });

  const handleNavigate = (view: ActiveView) => {
    setCurrentView(view);
    window.location.hash = view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as ActiveView;
      if (hash) setCurrentView(hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AppRoutes currentView={currentView} onNavigate={handleNavigate} />
      </main>

      <Footer />
      <CartDrawer />
      <NotificationToast />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <CartProvider>
            <MainApp />
          </CartProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
