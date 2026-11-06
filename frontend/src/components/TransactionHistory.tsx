'use client';

import React, { useState } from 'react';
import { Transaction } from '@/types/transaction';
import { useFilter } from '@/hooks/use-filter';
import { formatCurrency } from '@/lib/currency';
import CategoryBadge from './CategoryBadge';
import { FilterTabBar } from './ui/FilterTabBar';
import {
  Trash2,
  Calendar,
  Search,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Inbox,
} from 'lucide-react';

interface TransactionHistoryProps {
  transactions: Transaction[];
  isLoading: boolean;
  onDeleteTransaction: (id: string) => Promise<void>;
}

export default function TransactionHistory({
  transactions,
  isLoading,
  onDeleteTransaction,
}: TransactionHistoryProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const {
    filterType,
    searchQuery,
    selectedCategory,
    filtered,
    availableCategories,
    setFilterType,
    setSearchQuery,
    setSelectedCategory,
  } = useFilter(transactions);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;
    try {
      setDeletingId(id);
      await onDeleteTransaction(id);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDateTime = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return {
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      };
    } catch {
      return { date: dateStr, time: '' };
    }
  };

  const typeFilterOptions = [
    { value: 'all', label: 'All' },
    {
      value: 'income',
      label: (
        <>
          <ArrowDownLeft className="w-3.5 h-3.5" />
          <span>+ Received</span>
        </>
      ),
      activeClass: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
      inactiveClass: 'text-slate-400 hover:text-emerald-400',
    },
    {
      value: 'expense',
      label: (
        <>
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>- Spent</span>
        </>
      ),
      activeClass: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
      inactiveClass: 'text-slate-400 hover:text-rose-400',
    },
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-100">History</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Detailed ledger of all received and spent funds
          </p>
        </div>
        <FilterTabBar
          options={typeFilterOptions}
          value={filterType}
          onChange={setFilterType}
          className="self-start sm:self-auto"
        />
      </div>

      {/* Search & Category Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search description or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-xl bg-slate-950/70 border border-slate-800 pl-9 pr-4 py-2 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-xs"
          />
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Filter className="w-3.5 h-3.5" />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full rounded-xl bg-slate-950/70 border border-slate-800 pl-9 pr-4 py-2 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-xs cursor-pointer appearance-none"
          >
            <option value="all">All Categories</option>
            {availableCategories.map((c) => (
              <option key={c} value={c} className="bg-slate-900 text-white">
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transaction List */}
      <div className="mt-2 space-y-2.5">
        {isLoading ? (
          <div className="space-y-3 py-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-16 bg-slate-800/40 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center rounded-xl border border-dashed border-slate-800">
            <Inbox className="w-10 h-10 mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-medium text-slate-300">No transactions found</p>
            <p className="text-xs text-slate-500 mt-1">
              Record your first money received or spent using the form.
            </p>
          </div>
        ) : (
          filtered.map((tx) => {
            const isIncome = tx.type === 'income';
            const dt = formatDateTime(tx.date);

            return (
              <div
                key={tx.id}
                className="group relative flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-slate-950/50 hover:bg-slate-850 border border-slate-800/80 hover:border-slate-700 transition-all"
              >
                {/* Left */}
                <div className="flex items-center gap-3.5 min-w-0 pr-3">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base ${
                      isIncome
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    }`}
                    title={isIncome ? '+ Money received' : '- Money spent'}
                  >
                    {isIncome ? '+' : '−'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-semibold text-slate-100 truncate">
                        {tx.description || (isIncome ? 'Money Received' : 'Money Spent')}
                      </h4>
                      <CategoryBadge category={tx.category} />
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {dt.date}
                      </span>
                      {dt.time && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {dt.time}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                  <div className="text-right">
                    <div
                      className={`text-base sm:text-lg font-bold ${
                        isIncome ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isIncome ? '+' : '−'}
                      {formatCurrency(tx.amount)}
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                      {isIncome ? 'Received' : 'Spent'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(tx.id)}
                    disabled={deletingId === tx.id}
                    title="Delete transaction"
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors disabled:opacity-40"
                  >
                    {deletingId === tx.id ? (
                      <div className="w-4 h-4 border-2 border-rose-400/30 border-t-rose-400 rounded-full animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
