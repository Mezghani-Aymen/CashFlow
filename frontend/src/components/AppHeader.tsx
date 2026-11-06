'use client';

import { CircleDollarSign, RefreshCw, LogIn, LogOut, User, ShieldCheck } from 'lucide-react';
import { AuthUser } from '@/types/auth';

interface AppHeaderProps {
  currentUser: AuthUser | null;
  isLoading: boolean;
  onRefresh: () => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onLogout: () => void;
}

export function AppHeader({
  currentUser,
  isLoading,
  onRefresh,
  onOpenLogin,
  onOpenRegister,
  onLogout,
}: AppHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-8 mb-8 border-b border-slate-800/80">
      {/* Branding */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20 text-white">
          <CircleDollarSign className="w-7 h-7" />
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Money Tracker
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              <ShieldCheck className="w-3 h-3" /> Supabase
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Manage your income, track expenses, and view cash flow history
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
        {/* User Profile or Auth Buttons */}
        {currentUser ? (
          <div className="flex items-center gap-2.5 bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-2xl shadow-sm">
            <div className="w-7 h-7 rounded-xl bg-indigo-600 flex items-center justify-center text-xs font-bold text-white uppercase shadow-sm">
              {currentUser.fullName
                ? currentUser.fullName.charAt(0)
                : currentUser.email.charAt(0)}
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-slate-200 leading-none">
                {currentUser.fullName || currentUser.email.split('@')[0]}
              </p>
              <p className="text-[10px] text-slate-400 leading-none mt-1 truncate max-w-[140px]">
                {currentUser.email}
              </p>
            </div>
            <button
              onClick={onLogout}
              title="Sign out"
              className="ml-2 p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:text-white rounded-xl transition-all shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
            <button
              onClick={onOpenRegister}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/30"
            >
              <User className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>
          </div>
        )}

        {/* Refresh */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          title="Refresh ledger"
          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-900/80 border border-slate-800 hover:border-slate-700 hover:text-white rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>
    </header>
  );
}

