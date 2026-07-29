// frontend/src/App.tsx — Application avec auth + navigation par rôles
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdminDashboard } from './components/AdminDashboard';
import { UserDashboard } from './components/UserDashboard';

type View = 'shop' | 'account' | 'admin' | 'login' | 'register';
type Language = 'fr' | 'en';

function AppInner() {
  const { user, isAuthenticated } = useAuth();
  const [view, setView] = useState<View>('shop');
  const [language, setLanguage] = useState<Language>('fr');

  function renderView() {
    // Gardes d'accès
    if (view === 'account' && !isAuthenticated) {
      return <Login language={language} onSuccess={() => setView('account')} switchToRegister={() => setView('register')} />;
    }
    if (view === 'admin' && user?.role !== 'admin') {
      return <Login language={language} onSuccess={() => setView('admin')} switchToRegister={() => setView('register')} />;
    }

    switch (view) {
      case 'shop':
        return <Home language={language} />;
      case 'account':
        return <UserDashboard />;
      case 'admin':
        return <AdminDashboard language={language} />;
      case 'login':
        return <Login language={language} onSuccess={() => setView('account')} switchToRegister={() => setView('register')} />;
      case 'register':
        return <Register language={language} onSuccess={() => setView('shop')} switchToLogin={() => setView('login')} />;
      default:
        return <Home language={language} onRequireLogin={() => setView('login')} />;
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fb', fontFamily: 'Inter, -apple-system, sans-serif' }}>
      <Navbar view={view} setView={setView} language={language} setLanguage={setLanguage} />
      {renderView()}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

export default App;