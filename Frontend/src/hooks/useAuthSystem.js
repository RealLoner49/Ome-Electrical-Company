import { useState } from 'react';
import { ADMIN_EMAIL, supaAuth } from '../libSupabaseRest';

export function useAuthSystem(toast) {
  const [user, setUser] = useState(() => supaAuth.user());
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authNote, setAuthNote] = useState('');
  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL;

  const requireLogin = (message = 'Please login first to continue.') => {
    if (user) return true;
    toast?.showToast?.(message, 'info');
    setAuthNote(message);
    setAuthMode('login');
    setAuthOpen(true);
    return false;
  };

  const cancelAuth = () => {
    setAuthOpen(false);
    setAuthNote('');
  };

  const login = async (email, password) => {
    const data = await supaAuth.login(email, password);
    setUser(data.user);
    setAuthOpen(false);
    setAuthNote('');
    toast?.showToast?.('Welcome back. You are signed in.', 'success');
  };

  const signup = async (name, email, password) => {
    const data = await supaAuth.signup(name, email, password);
    setUser(data.user || { email, user_metadata: { full_name: name } });
    setAuthOpen(false);
    setAuthNote('');
    toast?.showToast?.('Account created. You are ready to shop.', 'success');
  };

  const logout = () => {
    supaAuth.logout();
    setUser(null);
    location.hash = '#/';
    toast?.showToast?.('Logged out successfully.', 'info');
  };

  return { user, isAdmin, authOpen, setAuthOpen, authMode, setAuthMode, authNote, requireLogin, login, signup, logout, cancelAuth };
}
