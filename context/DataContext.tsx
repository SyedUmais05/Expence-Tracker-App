import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, Debt, DebtRepayment } from '../types';
import { StorageKeys, storage } from '../utils/storage';
import { useAuth } from './AuthContext';

interface DataContextType {
  transactions: Transaction[];
  debts: Debt[];
  addTransaction: (t: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addDebt: (d: Omit<Debt, 'id' | 'history' | 'remainingAmount' | 'status'>) => Promise<void>;
  addRepayment: (debtId: string, amount: number, note?: string) => Promise<void>;
  deleteDebt: (id: string) => Promise<void>; 
}

const DataContext = createContext<DataContextType>({} as DataContextType);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);

  useEffect(() => {
    if (user) {
      loadData();
    } else {
      setTransactions([]);
      setDebts([]);
    }
  }, [user]);

  async function loadData() {
    const txData = await storage.get<Transaction[]>(StorageKeys.TRANSACTIONS);
    const debtData = await storage.get<Debt[]>(StorageKeys.DEBTS);
    if (txData) setTransactions(txData);
    if (debtData) setDebts(debtData);
  }

  async function addTransaction(t: Omit<Transaction, 'id'>) {
    const newTx: Transaction = { ...t, id: Date.now().toString() };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    await storage.save(StorageKeys.TRANSACTIONS, updated);
  }

  async function deleteTransaction(id: string) {
    const updated = transactions.filter(t => t.id !== id);
    setTransactions(updated);
    await storage.save(StorageKeys.TRANSACTIONS, updated);
  }

  async function addDebt(d: Omit<Debt, 'id' | 'history' | 'remainingAmount' | 'status'>) {
    const newDebt: Debt = {
      ...d,
      id: Date.now().toString(),
      remainingAmount: d.totalAmount, // Initially full amount
      status: 'active',
      history: [],
    };
    const updated = [newDebt, ...debts];
    setDebts(updated);
    await storage.save(StorageKeys.DEBTS, updated);
  }

  async function addRepayment(debtId: string, amount: number, note?: string) {
    const updatedDebts = debts.map(debt => {
      if (debt.id === debtId) {
        const newHistory: DebtRepayment = {
          id: Date.now().toString(),
          date: new Date().toISOString(),
          amount,
          note
        };
        const newRemaining = debt.remainingAmount - amount;
        return {
          ...debt,
          remainingAmount: newRemaining,
          status: newRemaining <= 0 ? 'paid' : 'active',
          history: [newHistory, ...debt.history]
        } as Debt;
      }
      return debt;
    });
    setDebts(updatedDebts);
    await storage.save(StorageKeys.DEBTS, updatedDebts);
  }

  async function deleteDebt(id: string) {
      const updated = debts.filter(d => d.id !== id);
      setDebts(updated);
      await storage.save(StorageKeys.DEBTS, updated);
  }

  return (
    <DataContext.Provider value={{ 
      transactions, 
      debts, 
      addTransaction, 
      deleteTransaction, 
      addDebt, 
      addRepayment,
      deleteDebt
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
