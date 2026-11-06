import { Transaction, TransactionSummary, CreateTransactionInput } from '@/types/transaction';
import { getToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

function getAuthHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// -----------------------------------------------------------------------------
// Transactions API
// -----------------------------------------------------------------------------

export async function fetchSummary(): Promise<TransactionSummary> {
  const res = await fetch(`${API_BASE_URL}/transactions/summary`, {
    headers: getAuthHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Please sign in to view your balance and summary');
    }
    throw new Error(`Failed to fetch summary: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchTransactions(filters?: {
  type?: string;
  category?: string;
  search?: string;
}): Promise<Transaction[]> {
  const params = new URLSearchParams();
  if (filters?.type && filters.type !== 'all') {
    params.set('type', filters.type);
  }
  if (filters?.category && filters.category !== 'all') {
    params.set('category', filters.category);
  }
  if (filters?.search) {
    params.set('search', filters.search);
  }

  const queryString = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${API_BASE_URL}/transactions${queryString}`, {
    headers: getAuthHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('Please sign in to view your transaction ledger');
    }
    throw new Error(`Failed to fetch transactions: ${res.statusText}`);
  }
  return res.json();
}

export async function createTransaction(
  payload: CreateTransactionInput,
): Promise<Transaction> {
  const res = await fetch(`${API_BASE_URL}/transactions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to create transaction');
  }

  return res.json();
}

export async function deleteTransaction(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/transactions/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to delete transaction');
  }
}

// -----------------------------------------------------------------------------
// Authentication API
// -----------------------------------------------------------------------------

export async function registerApi(data: {
  email: string;
  password: string;
  fullName?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || 'Registration failed');
  }
  return body;
}

export async function loginApi(data: { email: string; password: string }) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.message || 'Invalid email or password');
  }
  return body;
}

export async function fetchMeApi() {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: getAuthHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch user session');
  }
  return res.json();
}

export async function logoutApi() {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
  } catch {
    // Ignore network error on logout
  }
}
