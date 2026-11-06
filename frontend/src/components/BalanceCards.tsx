'use client';

/**
 * BalanceCards — composes StatCard primitives to display financial summary.
 * Single Responsibility: layout of summary cards only.
 * formatCurrency lives in lib/currency.ts (not exported from here anymore).
 */

import React from 'react';
import { TransactionSummary } from '@/types/transaction';
import { formatCurrency } from '@/lib/currency';
import { StatCard } from '@/components/ui/StatCard';
import { ArrowUpRight, ArrowDownLeft, Wallet, PieChart } from 'lucide-react';

interface BalanceCardsProps {
  summary: TransactionSummary | null;
  isLoading: boolean;
}

export default function BalanceCards({ summary, isLoading }: BalanceCardsProps) {
  const currentBalance = summary?.currentBalance ?? 0;
  const totalReceived = summary?.totalReceived ?? 0;
  const totalSpent = summary?.totalSpent ?? 0;
  const transactionCount = summary?.transactionCount ?? 0;

  const isPositive = currentBalance >= 0;
  const savingsRate =
    totalReceived > 0
      ? `${Math.max(0, Math.round(((totalReceived - totalSpent) / totalReceived) * 100))}% savings rate`
      : 'All-time activity';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        label="Current Balance"
        value={
          <span className={isPositive ? 'text-white' : 'text-rose-400'}>
            {formatCurrency(currentBalance)}
          </span>
        }
        subtext={
          <>
            <span
              className={`inline-block w-2 h-2 rounded-full ${isPositive ? 'bg-emerald-400' : 'bg-rose-400'}`}
            />
            {isPositive ? 'Net positive cash flow' : 'Negative cash flow'}
          </>
        }
        icon={<Wallet className="w-5 h-5" />}
        accentClass="from-indigo-900/40"
        iconBgClass="bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
        isLoading={isLoading}
      />

      <StatCard
        label="Money Received"
        value={<span className="text-emerald-400">{`+${formatCurrency(totalReceived)}`}</span>}
        subtext="Total credited income"
        icon={<ArrowDownLeft className="w-5 h-5" />}
        accentClass="from-emerald-950/30"
        iconBgClass="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
        isLoading={isLoading}
      />

      <StatCard
        label="Money Spent"
        value={<span className="text-rose-400">{`-${formatCurrency(totalSpent)}`}</span>}
        subtext="Total debited expenses"
        icon={<ArrowUpRight className="w-5 h-5" />}
        accentClass="from-rose-950/30"
        iconBgClass="bg-rose-500/10 text-rose-400 border-rose-500/20"
        isLoading={isLoading}
      />

      <StatCard
        label="Total"
        value={<span className="text-slate-100">{`${transactionCount} txns`}</span>}
        subtext={savingsRate}
        icon={<PieChart className="w-5 h-5" />}
        accentClass="from-slate-800/40"
        iconBgClass="bg-slate-700/30 text-slate-300 border-slate-600/30"
        isLoading={isLoading}
      />
    </div>
  );
}
