'use client';


import React, { useState } from 'react';
import { TransactionType, CATEGORIES, CreateTransactionInput } from '@/types/transaction';
import {
  PlusCircle,
  MinusCircle,
  DollarSign,
  Calendar,
  Tag,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { FilterTabBar } from './ui/FilterTabBar';

interface TransactionFormProps {
  onTransactionCreated: (data: CreateTransactionInput) => Promise<void>;
}

function getNowFormatted(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

export default function TransactionForm({ onTransactionCreated }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES.income[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [dateTime, setDateTime] = useState(getNowFormatted());
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleTypeChange = (newType: string) => {
    const t = newType as TransactionType;
    setType(t);
    setIsCustomCategory(false);
    setCustomCategory('');
    setCategory(CATEGORIES[t][0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(false);

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setErrorMsg('Please enter a valid amount greater than 0');
      return;
    }

    const finalCategory = isCustomCategory ? customCategory.trim() : category;
    if (!finalCategory) {
      setErrorMsg('Please select or specify a category');
      return;
    }

    if (!description.trim()) {
      setErrorMsg('Please enter a brief description');
      return;
    }

    try {
      setIsSubmitting(true);
      await onTransactionCreated({
        type,
        amount: numericAmount,
        category: finalCategory,
        description: description.trim(),
        date: new Date(dateTime).toISOString(),
      });

      setAmount('');
      setDescription('');
      setDateTime(getNowFormatted());
      setIsCustomCategory(false);
      setCustomCategory('');
      setCategory(CATEGORIES[type][0]);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const typeOptions = [
    {
      value: 'income',
      label: (
        <>
          <PlusCircle className="w-4 h-4" />
          <span>+ Money received</span>
        </>
      ),
      activeClass:
        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm',
      inactiveClass: 'text-slate-400 hover:text-slate-200',
    },
    {
      value: 'expense',
      label: (
        <>
          <MinusCircle className="w-4 h-4" />
          <span>- Money spent</span>
        </>
      ),
      activeClass: 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm',
      inactiveClass: 'text-slate-400 hover:text-slate-200',
    },
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-slate-100">Add Transaction</h2>
        <span className="text-xs text-slate-400">Quick Entry</span>
      </div>

      {/* Type Selector */}
      <FilterTabBar
        options={typeOptions}
        value={type}
        onChange={handleTypeChange}
        className="grid grid-cols-2 gap-2 mb-5"
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Amount</label>
          <div className="relative rounded-xl shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <DollarSign className="w-4 h-4" />
            </div>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full rounded-xl bg-slate-950/70 border border-slate-800 pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-sm transition-all"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex justify-between">
            <span>Category</span>
            <button
              type="button"
              onClick={() => setIsCustomCategory(!isCustomCategory)}
              className="text-xs text-indigo-400 hover:underline"
            >
              {isCustomCategory ? 'Select from list' : '+ Custom category'}
            </button>
          </label>
          <div className="relative rounded-xl">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Tag className="w-4 h-4" />
            </div>
            {isCustomCategory ? (
              <input
                type="text"
                placeholder="e.g. Dividend, Subscriptions, Gas"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="block w-full rounded-xl bg-slate-950/70 border border-slate-800 pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-sm transition-all"
              />
            ) : (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="block w-full rounded-xl bg-slate-950/70 border border-slate-800 pl-10 pr-4 py-2.5 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-sm transition-all appearance-none cursor-pointer"
              >
                {CATEGORIES[type].map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900 text-white">
                    {cat}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Date & Time */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Date & Time</label>
          <div className="relative rounded-xl">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Calendar className="w-4 h-4" />
            </div>
            <input
              type="datetime-local"
              required
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="block w-full rounded-xl bg-slate-950/70 border border-slate-800 pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-sm transition-all"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">Description</label>
          <div className="relative rounded-xl">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 pt-3 text-slate-400">
              <FileText className="w-4 h-4" />
            </div>
            <textarea
              rows={2}
              required
              placeholder="What was this for? (e.g., Weekly grocery haul, Freelance client invoice)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full rounded-xl bg-slate-950/70 border border-slate-800 pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none text-sm transition-all resize-none"
            />
          </div>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Transaction recorded successfully!</span>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-lg ${
            type === 'income'
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
              : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/50'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              {type === 'income' ? (
                <PlusCircle className="w-4 h-4" />
              ) : (
                <MinusCircle className="w-4 h-4" />
              )}
              <span>Record {type === 'income' ? '+ Money Received' : '- Money Spent'}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
