'use client';

import { useEffect, useRef } from 'react';

/**
 * Dashboard page — thin orchestrator only.
 * Wires hooks to components. Contains zero business logic.
 * Dependency Inversion: depends on hook abstractions, not concrete API calls.
 */

import { useAuth } from '@/hooks/use-auth';
import { useTransactions } from '@/hooks/use-transactions';
import { AppHeader } from '@/components/AppHeader';
import { AlertBanner } from '@/components/ui/AlertBanner';
import BalanceCards from '@/components/BalanceCards';
import TransactionForm from '@/components/TransactionForm';
import TransactionHistory from '@/components/TransactionHistory';
import AuthModal from '@/components/AuthModal';

export default function DashboardPage() {
  const refreshRef = useRef<() => void>(() => {});

  const {
    currentUser,
    isAuthModalOpen,
    authModalMode,
    openAuth,
    closeAuth,
    handleLogout,
  } = useAuth(() => refreshRef.current());

  const {
    summary,
    transactions,
    isLoading,
    apiError,
    dismissError,
    refresh,
    handleCreate,
    handleDelete,
  } = useTransactions(currentUser?.id);

  useEffect(() => {
    refreshRef.current = refresh;
  }, [refresh]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Background decorative glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <AppHeader
          currentUser={currentUser}
          isLoading={isLoading}
          onRefresh={refresh}
          onOpenLogin={() => openAuth('login')}
          onOpenRegister={() => openAuth('register')}
          onLogout={handleLogout}
        />

        {/* Error Banner */}
        {apiError && (
          <AlertBanner message={apiError} onDismiss={dismissError}>
            {!currentUser && apiError.includes('sign in') && (
              <button
                onClick={() => openAuth('login')}
                className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-indigo-300 hover:text-indigo-200 underline underline-offset-2"
              >
                Click here to Sign In or Create an Account &rarr;
              </button>
            )}
          </AlertBanner>
        )}

        {/* Financial Summary */}
        <section aria-label="Financial Summary">
          <BalanceCards summary={summary} isLoading={isLoading} />
        </section>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-8">
          {/* Transaction Form */}
          <div className="lg:col-span-4 lg:sticky lg:top-6">
            <TransactionForm onTransactionCreated={handleCreate} />
          </div>

          {/* Transaction History */}
          <div className="lg:col-span-8">
            <TransactionHistory
              transactions={transactions}
              isLoading={isLoading}
              onDeleteTransaction={handleDelete}
            />
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={closeAuth}
        onSuccess={refresh}
      />
    </main>
  );
}
