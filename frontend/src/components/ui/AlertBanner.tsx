'use client';

/**
 * AlertBanner — reusable dismissible notice banner.
 * Single Responsibility: display contextual alerts only.
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface AlertBannerProps {
  message: string;
  children?: React.ReactNode;
  onDismiss: () => void;
}

export function AlertBanner({ message, children, onDismiss }: AlertBannerProps) {
  return (
    <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start justify-between gap-3 shadow-sm">
      <div className="flex items-start gap-3 text-xs leading-relaxed">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-200">Notice</p>
          <p className="mt-1">{message}</p>
          {children}
        </div>
      </div>
      <button
        onClick={onDismiss}
        className="text-amber-400 hover:text-amber-200 text-xs px-2 py-1"
        aria-label="Dismiss alert"
      >
        Dismiss
      </button>
    </div>
  );
}

