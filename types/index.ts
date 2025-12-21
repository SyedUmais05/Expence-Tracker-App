export type TransactionType = 'income' | 'expense';

export interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    category: string;
    note?: string;
    date: string; // ISO String
}

export type DebtType = 'borrowed' | 'lent';
export type DebtStatus = 'active' | 'paid';

export interface DebtRepayment {
    id: string;
    date: string;
    amount: number;
    note?: string;
}

export interface Debt {
    id: string;
    type: DebtType;
    personName: string;
    totalAmount: number;
    remainingAmount: number;
    date: string;
    dueDate?: string;
    note?: string;
    status: DebtStatus;
    history: DebtRepayment[];
}

export interface User {
    id: string;
    username: string;
    // Local only, no real auth token needed for now, just persisted session
    hasCompletedOnboarding: boolean;
}
