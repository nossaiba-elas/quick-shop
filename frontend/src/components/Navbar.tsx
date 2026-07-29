// frontend/src/components/Navbar.tsx — Barre de navigation avec auth
import React from 'react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  view: string;
  setView: (v: any) => void;
  language: 'fr' | 'en';
  setLanguage: (value: 'fr' | 'en') => void;
}

export function Navbar({ view, setView, language, setLanguage }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const t = language === 'fr'
    ? {
        shop: 'Boutique',
        orders: 'Mes commandes',
        admin: 'Admin',
        login: 'Connexion',
        register: 'Inscription',
        logout: 'Déconnexion',
      }
    : {
        shop: 'Shop',
        orders: 'My orders',
        admin: 'Admin',
        login: 'Login',
        register: 'Register',
        logout: 'Logout',
      };

  return (
    <nav
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #111827 45%, #1d4ed8 100%)',
        padding: '0.95rem 2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.7rem',
        flexWrap: 'wrap',
        boxShadow: '0 10px 30px rgba(15, 23, 42, 0.18)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <button
        onClick={() => setView('shop')}
        style={{ color: 'white', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', marginRight: 'auto', letterSpacing: '0.03em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <span style={{ display: 'inline-flex', width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>⚡</span>
        <span>Quick Shop</span>
      </button>

      {[
        { id: 'shop', label: t.shop },
        { id: 'account', label: t.orders, needsAuth: true },
        { id: 'admin', label: t.admin, adminOnly: true },
      ]
        .filter((b) => (b.adminOnly ? user?.role === 'admin' : true))
        .filter((b) => (b.needsAuth ? isAuthenticated : true))
        .map((b) => (
          <button
            key={b.id}
            onClick={() => setView(b.id)}
            style={navBtn(view === b.id)}
          >
            {b.label}
          </button>
        ))}

      <button onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')} style={{ ...navBtn(false), border: '1px solid rgba(255,255,255,0.28)', background: 'rgba(255,255,255,0.12)' }}>
        {language === 'fr' ? 'EN' : 'FR'}
      </button>

      {isAuthenticated ? (
        <>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
            👤 {user?.name} {user?.role === 'admin' && <span style={{ color: '#f1c40f' }}>(admin)</span>}
          </span>
          <button onClick={logout} style={{ ...navBtn(false), border: '1px solid rgba(255,255,255,0.3)' }}>
            {t.logout}
          </button>
        </>
      ) : (
        <>
          <button onClick={() => setView('login')} style={navBtn(view === 'login')}>{t.login}</button>
          <button onClick={() => setView('register')} style={{ ...navBtn(view === 'register'), background: 'linear-gradient(135deg, #4361ee, #3a0ca3)' }}>
            {t.register}
          </button>
        </>
      )}
    </nav>
  );
}

function navBtn(active: boolean): React.CSSProperties {
  return {
    padding: '0.5rem 0.95rem',
    background: active ? 'rgba(255,255,255,0.2)' : 'transparent',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: '999px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.86rem',
  };
}