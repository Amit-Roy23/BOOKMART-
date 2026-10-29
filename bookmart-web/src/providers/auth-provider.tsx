'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { api, AUTH_CHANGE_EVENT, tokenStorage } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import type { Profile, Tokens } from '@/types/api';

type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

interface AuthContextValue {
  status: AuthStatus;
  profile: Profile | undefined;
  /** Store tokens after login / OTP verification. */
  signIn: (tokens: Tokens) => void;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<unknown>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const PROFILE_QUERY_KEY = ['userProfile'] as const;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  useEffect(() => {
    const sync = () => setHasToken(!!tokenStorage.getAccess() || !!tokenStorage.getRefresh());
    sync();
    window.addEventListener(AUTH_CHANGE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const profileQuery = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: async () => (await api.get<Profile>(ENDPOINTS.CORE.PROFILE_ME)).data,
    enabled: hasToken === true,
    retry: false,
    staleTime: 60 * 1000,
  });

  // When tokens disappear (logout or failed refresh) drop every cached query. Only on a real
  // signed-in -> signed-out transition: clearing on first load would cancel public queries in flight.
  const hadToken = useRef(false);
  useEffect(() => {
    if (hasToken) hadToken.current = true;
    else if (hasToken === false && hadToken.current) {
      hadToken.current = false;
      queryClient.clear();
    }
  }, [hasToken, queryClient]);

  let status: AuthStatus = 'loading';
  if (hasToken === false || (hasToken && profileQuery.isError)) status = 'anonymous';
  else if (hasToken && profileQuery.data) status = 'authenticated';

  const signIn = useCallback((tokens: Tokens) => {
    tokenStorage.set(tokens);
  }, []);

  const signOut = useCallback(async () => {
    const refresh = tokenStorage.getRefresh();
    try {
      if (refresh) await api.post(ENDPOINTS.AUTH.LOGOUT, { refresh });
    } catch {
      // Token may already be expired or blacklisted — logging out locally is enough.
    } finally {
      tokenStorage.clear();
    }
  }, []);

  const { refetch } = profileQuery;
  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      profile: profileQuery.data,
      signIn,
      signOut,
      refreshProfile: refetch,
    }),
    [status, profileQuery.data, signIn, signOut, refetch]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
