import React from 'react';

const CATEGORY_COLORS: { [key: string]: { bg: string; text: string; border: string } } = {
  Salary: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  Freelance: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20' },
  Investment: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20' },
  Gift: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  Bonus: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  Groceries: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
  Dining: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
  'Housing & Rent': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  Utilities: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
  Transport: { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20' },
  Shopping: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20' },
  Entertainment: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
  Healthcare: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
};

export default function CategoryBadge({ category }: { category: string }) {
  const style = CATEGORY_COLORS[category] || {
    bg: 'bg-slate-700/20',
    text: 'text-slate-300',
    border: 'border-slate-600/30',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}
    >
      {category}
    </span>
  );
}

