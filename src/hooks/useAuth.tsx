import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabase';
import {
  getCurrentSession,
  getProfile,
  signInWithEmail,
  signOut,
  signUpWithEmail,
} from '@/services/authService';
import type { AuthUser, UserProfile } from '@/types/auth';

type AuthContextValue = {
  user: AuthUser | null;
  profile: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshAuth: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string, displayName?: string) => Promise<string | null>;
  logout: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function mapSessionUser(session: Session | null): AuthUser | null {
  if (!session?.user) {
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email ?? undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadProfile(userId: string) {
    const profileResult = await getProfile(userId);
    setProfile(profileResult.data);
  }

  async function refreshAuth() {
    const sessionResult = await getCurrentSession();
    const nextSession = sessionResult.data;
    const nextUser = mapSessionUser(nextSession);

    setSession(nextSession);
    setUser(nextUser);

    if (nextUser) {
      await loadProfile(nextUser.id);
    } else {
      setProfile(null);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    let isMounted = true;

    getCurrentSession()
      .then(async (sessionResult) => {
        if (!isMounted) {
          return;
        }

        const nextSession = sessionResult.data;
        const nextUser = mapSessionUser(nextSession);

        setSession(nextSession);
        setUser(nextUser);

        if (nextUser) {
          const profileResult = await getProfile(nextUser.id);
          if (isMounted) {
            setProfile(profileResult.data);
          }
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    const subscription = supabase?.auth.onAuthStateChange((_event, nextSession) => {
      const nextUser = mapSessionUser(nextSession);
      setSession(nextSession);
      setUser(nextUser);

      if (nextUser) {
        void loadProfile(nextUser.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      isMounted = false;
      subscription?.data.subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextValue = {
    user,
    profile,
    session,
    isLoading,
    isAuthenticated: Boolean(user),
    refreshAuth,
    signIn: async (email: string, password: string) => {
      setIsLoading(true);
      const result = await signInWithEmail(email, password);
      await refreshAuth();
      return result.errorMessage;
    },
    signUp: async (email: string, password: string, displayName?: string) => {
      setIsLoading(true);
      const result = await signUpWithEmail(email, password, displayName);
      await refreshAuth();
      return result.errorMessage;
    },
    logout: async () => {
      setIsLoading(true);
      const result = await signOut();
      setSession(null);
      setUser(null);
      setProfile(null);
      setIsLoading(false);
      return result.errorMessage;
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
