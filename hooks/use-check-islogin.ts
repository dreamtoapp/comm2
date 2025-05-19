// lib/auth/client.ts
'use client';

import { useEffect, useState } from 'react';

import { checkIsLogin } from '@/lib/check-is-login';
import { CustomSession } from '@/types/customSesstion';

// Custom type definitions

export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

export const useCheckIsLogin = () => {
  const [session, setSession] = useState<CustomSession | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setStatus('loading');
        const result = await checkIsLogin();

        if (result?.user) {
          // Type assertion with validation
          const validSession = result as CustomSession;
          setSession(validSession);
          setStatus('authenticated');
        } else {
          setSession(null);
          setStatus('unauthenticated');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch session');
        setStatus('unauthenticated');
      }
    };

    fetchSession();
  }, []);

  return {
    session,
    status,
    error,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  };
};
