'use client';

/**
 * StatCard — generic financial summary card primitive.
 * Open/Closed: extend via props, never modify this component for new variants.
 */

import React from 'react';

export interface StatCardProps {
  label: string;
  value: React.ReactNode;
  subtext?: React.ReactNode;
  icon: React.ReactNode;
  accentClass: string; // Tailwind gradient class e.g. 'from-indigo-900/40'
  iconBgClass: string; // e.g. 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
  isLoading?: boolean;
}

export function StatCard({
  label,
  value,
  subtext,
  icon,
  accentClass,
  iconBgClass,
  isLoading = false,
}: StatCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${accentClass} via-slate-900/60 to-slate-900/90 border shadow-xl backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-400">{label}</span>
        <div className={`p-2.5 rounded-xl border ${iconBgClass}`}>{icon}</div>
      </div>
      <div className="mt-4">
        <div className="text-3xl font-bold tracking-tight">
          {isLoading ? (
            <span className="inline-block w-28 h-8 bg-slate-800 rounded animate-pulse" />
          ) : (
            value
          )}
        </div>
        {subtext && <p className="mt-1.5 text-xs text-slate-400 flex items-center gap-1.5">{subtext}</p>}
      </div>
    </div>
  );
}

