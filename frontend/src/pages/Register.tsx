// frontend/src/pages/Register.tsx — Page d'inscription
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface RegisterProps {
  onSuccess: () => void;
  switchToLogin: () => void;
}

export function Register({ onSuccess, switchToLogin, language }: RegisterProps & { language: 'fr' | 'en' }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const t = language === 'fr'
    ? {
        title: 'Inscription',
        name: 'Nom complet',
        email: 'Email',
        password: 'Mot de passe',
        submit: 'Créer mon compte',
        loading: 'Inscription…',
        switchText: 'Déjà inscrit ?',
        switchButton: 'Se connecter',
      }
    : {
        title: 'Register',
        name: 'Full name',
        email: 'Email',
        password: 'Password',
        submit: 'Create account',
        loading: 'Registering…',
        switchText: 'Already registered?',
        switchButton: 'Log in',
      };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(name, email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Échec de l\'inscription');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '3rem auto', padding: '0 1rem' }}>
      <div style={{ background: 'white', border: '1px solid #eaeaea', borderRadius: '14px', padding: '2rem' }}>
        <h2 style={{ marginTop: 0, textAlign: 'center', color: '#1a1a2e' }}>{t.title}</h2>
        {error && <div style={{ background: '#fde8e8', color: '#c0392b', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input placeholder={t.name} value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} required style={inputStyle} />
          <input type="email" placeholder={t.email} value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} required style={inputStyle} />
          <input type="password" placeholder={t.password} value={password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} required minLength={6} style={inputStyle} />
          <button type="submit" disabled={loading} style={primaryBtn}>{loading ? t.loading : t.submit}</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: '#666' }}>
          {t.switchText} <button type="button" onClick={(e) => { e.preventDefault(); switchToLogin(); }} style={{ background: 'none', border: 'none', color: '#4361ee', cursor: 'pointer', fontWeight: 600 }}>{t.switchButton}</button>
        </p>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = { padding: '0.7rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem' };
const primaryBtn: React.CSSProperties = { padding: '0.75rem', background: 'linear-gradient(135deg, #4361ee, #3a0ca3)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' };