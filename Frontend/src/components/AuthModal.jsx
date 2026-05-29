import { useState } from 'react';
import { isSupabaseConfigured } from '../libSupabaseRest';
import { useToast } from '../context/ToastContext.jsx';

export default function AuthModal({ auth }) {
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  if (!auth.authOpen) return null;

  const dismiss = () => {
    if (busy) return;
    setErr('');
    if (auth.cancelAuth) auth.cancelAuth();
    else auth.setAuthOpen(false);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (busy) return;
    setErr('');
    setBusy(true);
    try {
      if (auth.authMode === 'login') await auth.login(email, password);
      else await auth.signup(name, email, password);
    } catch (error) {
      setErr(error.message);
      toast?.showToast?.(error.message || 'Authentication failed.', 'error');
    } finally {
      setBusy(false);
    }
  };

  return <div className="modal"><form className="auth" onSubmit={submit}><button type="button" className="x" onClick={dismiss} disabled={busy}>x</button><p className="eyebrow">{auth.authMode}</p><h2>{auth.authMode === 'login' ? 'Welcome back' : 'Create account'}</h2>{auth.authNote && <p>{auth.authNote}</p>}{err && <p className="err">{err}</p>}{!isSupabaseConfigured && <p className="err">Supabase env keys are not set yet.</p>}{auth.authMode === 'signup' && <input disabled={busy} placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />}<input required disabled={busy} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><input required disabled={busy} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /><button disabled={busy}>{busy ? (auth.authMode === 'login' ? 'Logging you in...' : 'Creating account...') : (auth.authMode === 'login' ? 'Login' : 'Sign up')}</button><button type="button" className="auth-secondary" onClick={dismiss} disabled={busy}>Not now</button><a className={busy ? 'disabled' : ''} onClick={() => !busy && auth.setAuthMode(auth.authMode === 'login' ? 'signup' : 'login')}>{auth.authMode === 'login' ? 'No account? Sign up' : 'Have account? Login'}</a></form></div>;
}
