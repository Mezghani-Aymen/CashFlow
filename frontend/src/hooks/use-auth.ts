'use client';

/**
 * useAuth — encapsulates authentication state and handlers.
 * Components depend on this hook's interface, not on lib/auth or lib/api directly.
 */

import { useCallback, useEffect, useState } from 'react';
import { AuthUser } from '@/types/auth';
import { getUser, clearSession, onAuthChange } from '@/lib/auth';
import { logoutApi } from '@/lib/api';

export interface UseAuthReturn {
  currentUser: AuthUser | null;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  openAuth: (mode: 'login' | 'register') => void;
  closeAuth: () => void;
  handleLogout: () => Promise<void>;
}

export function useAuth(onLogout?: () => void): UseAuthReturn {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    setCurrentUser(getUser());
    const unsubscribe = onAuthChange(() => setCurrentUser(getUser()));
    return () => unsubscribe();
  }, []);

  const openAuth = useCallback((mode: 'login' | 'register') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const handleLogout = useCallback(async () => {
    await logoutApi();
    clearSession();
    setCurrentUser(null);
    onLogout?.();
  }, [onLogout]);

  return {
    currentUser,
    isAuthModalOpen,
    authModalMode,
    openAuth,
    closeAuth,
    handleLogout,
  };
}

