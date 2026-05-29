import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, hasFirebaseConfig } from '../firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(hasFirebaseConfig));
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMessage, setAuthMessage] = useState('');

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return undefined;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // 🔐 LOGIN
  const login = useCallback(async (email, password) => {
    if (!auth) throw new Error('Firebase is not configured yet.');

    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        throw new Error("No account with this email");
      }
      if (error.code === "auth/wrong-password") {
        throw new Error("Incorrect password");
      }
      if (error.code === "auth/invalid-email") {
        throw new Error("Invalid email address");
      }
      throw new Error("Login failed");
    }
  }, []);

  // 🆕 SIGNUP
  const signup = useCallback(async (name, email, password) => {
    if (!auth) throw new Error('Firebase is not configured yet.');

    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);

      if (name) {
        await updateProfile(credential.user, { displayName: name });
      }

      return credential;

    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        throw new Error("Email already in use");
      }
      if (error.code === "auth/invalid-email") {
        throw new Error("Invalid email address");
      }
      if (error.code === "auth/weak-password") {
        throw new Error("Password must be at least 6 characters");
      }
      if (error.code === "auth/configuration-not-found") {
        throw new Error("Enable Email/Password in Firebase Authentication");
      }

      throw new Error("Signup failed. Try again.");
    }
  }, []);

  // 🚪 LOGOUT
  const logout = useCallback(() => {
    if (!auth) return Promise.resolve();
    return signOut(auth);
  }, []);

  // 🔒 REQUIRE LOGIN (for checkout)
  const requireLogin = useCallback((message = 'Please login before proceeding to payment.') => {
    if (user) return true;
    setAuthMessage(
      hasFirebaseConfig
        ? message
        : 'Login is ready, but Firebase is not configured yet.'
    );
    setAuthModalOpen(true);
    return false;
  }, [user]);

  const value = useMemo(() => ({
    user,
    loading,
    authModalOpen,
    authMessage,
    firebaseReady: hasFirebaseConfig,
    setAuthModalOpen,
    setAuthMessage,
    login,
    signup,
    logout,
    requireLogin,
  }), [user, loading, authModalOpen, authMessage, login, signup, logout, requireLogin]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}