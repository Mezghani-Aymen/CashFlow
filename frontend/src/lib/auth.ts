'use client';

/**
 * Session utilities — stores/retrieves JWT + user in localStorage.
 * Single Responsibility: session persistence only; AuthUser type lives in types/auth.ts.
 */

import { AuthUser } from '@/types/auth';

export type { AuthUser };

const TOKEN_KEY = 'cashflow_auth_token';
const USER_KEY = 'cashflow_auth_user';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setSession(token: string, user: AuthUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event('cashflow-auth-changed'));
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event('cashflow-auth-changed'));
}

export function onAuthChange(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback();
  window.addEventListener('cashflow-auth-changed', handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener('cashflow-auth-changed', handler);
    window.removeEventListener('storage', handler);
  };
}
