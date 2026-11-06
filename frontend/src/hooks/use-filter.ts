'use client';

/**
 * useFilter — encapsulates client-side filter and search state for transactions.
 * Interface Segregation: components only receive the slice they need.
 */

import { useMemo, useState } from 'react';
import { Transaction } from '@/types/transaction';

export interface FilterState {
  filterType: string;
  searchQuery: string;
  selectedCategory: string;
}

export interface UseFilterReturn extends FilterState {
  filtered: Transaction[];
  availableCategories: string[];
  setFilterType: (v: string) => void;
  setSearchQuery: (v: string) => void;
  setSelectedCategory: (v: string) => void;
}

export function useFilter(transactions: Transaction[]): UseFilterReturn {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const availableCategories = useMemo(
    () => Array.from(new Set(transactions.map((t) => t.category))).filter(Boolean),
    [transactions],
  );

  const filtered = useMemo(
    () =>
      transactions.filter((tx) => {
        if (filterType !== 'all' && tx.type !== filterType) return false;
        if (selectedCategory !== 'all' && tx.category !== selectedCategory) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchDesc = tx.description?.toLowerCase().includes(q);
          const matchCat = tx.category?.toLowerCase().includes(q);
          if (!matchDesc && !matchCat) return false;
        }
        return true;
      }),
    [transactions, filterType, selectedCategory, searchQuery],
  );

  return {
    filterType,
    searchQuery,
    selectedCategory,
    filtered,
    availableCategories,
    setFilterType,
    setSearchQuery,
    setSelectedCategory,
  };
}

