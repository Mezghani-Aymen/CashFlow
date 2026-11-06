'use client';

/**
 * useTransactions — encapsulates transaction data fetching and CRUD operations.
 * Open/Closed: add new operations (edit, bulk-delete) without changing consumers.
 */

import { useCallback, useEffect, useState } from 'react';
import { Transaction, TransactionSummary, CreateTransactionInput } from '@/types/transaction';
import { fetchSummary, fetchTransactions, createTransaction, deleteTransaction } from '@/lib/api';

export interface UseTransactionsReturn {
  summary: TransactionSummary | null;
  transactions: Transaction[];
  isLoading: boolean;
  apiError: string | null;
  dismissError: () => void;
  refresh: () => Promise<void>;
  handleCreate: (input: CreateTransactionInput) => Promise<void>;
  handleDelete: (id: string) => Promise<void>;
}

export function useTransactions(currentUserId: string | undefined): UseTransactionsReturn {
  const [summary, setSummary] = useState<TransactionSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setApiError(null);
      const [sum, txs] = await Promise.all([fetchSummary(), fetchTransactions()]);
      setSummary(sum);
      setTransactions(txs);
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'Unable to connect to the backend server');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Re-fetch when user changes (login / logout)
  useEffect(() => {
    refresh();
  }, [refresh, currentUserId]);

  const handleCreate = useCallback(async (input: CreateTransactionInput) => {
    try {
      await createTransaction(input);
      await refresh();
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'Failed to create transaction');
    }
  }, [refresh]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await deleteTransaction(id);
      await refresh();
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'Failed to delete transaction');
    }
  }, [refresh]);

  const dismissError = useCallback(() => setApiError(null), []);

  return {
    summary,
    transactions,
    isLoading,
    apiError,
    dismissError,
    refresh,
    handleCreate,
    handleDelete,
  };
}

