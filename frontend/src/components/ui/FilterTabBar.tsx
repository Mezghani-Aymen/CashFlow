'use client';

/**
 * FilterTabBar — reusable segmented control for filter buttons.
 * Open/Closed: controlled via options prop — no internal logic changes needed for new filters.
 */

import React from 'react';

export interface FilterOption {
  value: string;
  label: React.ReactNode;
  activeClass?: string;
  inactiveClass?: string;
}

export interface FilterTabBarProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function FilterTabBar({ options, value, onChange, className = '' }: FilterTabBarProps) {
  return (
    <div
      className={`flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 ${className}`}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            value === opt.value
              ? (opt.activeClass ?? 'bg-slate-800 text-white shadow-sm')
              : (opt.inactiveClass ?? 'text-slate-400 hover:text-slate-200')
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

