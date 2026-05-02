import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { signInAsGuest, signInWithGoogle, signOut, subscribeToAuth } from '../services/auth';
import type { UserProfile } from '../types';

interface AuthContextValue {
  user: UserProfile | null;
  loading: boolean;
  signInGoogle: () => Promise<void>;
  signInGuest: () => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeToAuth((profile) => {
      setUser(profile);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      error,
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
      },
    }),
    [user, loading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
