export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType; // 'income' = + Money received, 'expense' = - Money spent
  amount: number;
  category: string;
  description: string;
  date: string; // ISO date-time string
  createdAt: string;
}

export interface TransactionSummary {
  currentBalance: number;
  totalReceived: number;
  totalSpent: number;
  transactionCount: number;
}

export interface CreateTransactionInput {
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export const CATEGORIES: { [key in TransactionType]: string[] } = {
  income: [
    'Salary',
    'Freelance',
    'Investment',
    'Gift',
    'Refund',
    'Bonus',
    'Other Income',
  ],
  expense: [
    'Groceries',
    'Dining',
    'Housing & Rent',
    'Utilities',
    'Transport',
    'Shopping',
    'Entertainment',
    'Healthcare',
    'Education',
    'Other Expense',
  ],
};

