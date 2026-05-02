import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { signInAsGuest, signInWithGoogle, signOut, subscribeToAuth } from '../services/auth';
import type { UserProfile } from '../types';

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  learnerPreview: boolean;
  isAdminAccount: boolean;
  setLearnerPreview: (enabled: boolean) => void;
  signInGoogle: () => Promise<void>;
  signInGuest: () => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const learnerPreviewKey = 'sports-xray:learner-preview';
const adminPreviewEmails = new Set(['jeremyswisher13@gmail.com']);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [learnerPreviewEnabled, setLearnerPreviewEnabled] = useState(() => {
    try {
      return localStorage.getItem(learnerPreviewKey) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const unsub = subscribeToAuth((profile) => {
      setUser(profile);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const isAdminAccount =
    user?.role === 'admin' ||
    (user?.email ? adminPreviewEmails.has(user.email.toLowerCase()) : false);
  const learnerPreview = Boolean(isAdminAccount && learnerPreviewEnabled);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      error,
      learnerPreview,
      isAdminAccount,
      setLearnerPreview(enabled) {
        setLearnerPreviewEnabled(enabled);
        try {
          localStorage.setItem(learnerPreviewKey, String(enabled));
        } catch {
          // localStorage can be unavailable in private browsing; preview still works in memory.
        }
      },
      async signInGoogle() {
        setError(null);
        try {
          const profile = await signInWithGoogle();
          setUser(profile);
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Sign-in failed';
          setError(msg);
          throw err;
        }
      },
      async signInGuest() {
        setError(null);
        const profile = await signInAsGuest();
        setUser(profile);
      },
      async signOut() {
        await signOut();
        setUser(null);
        setLearnerPreviewEnabled(false);
        try {
          localStorage.removeItem(learnerPreviewKey);
        } catch {
          // Ignore storage cleanup failures on sign out.
        }
      },
    }),
    [user, loading, error, learnerPreview, isAdminAccount],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
