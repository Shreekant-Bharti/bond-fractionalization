import { useState, useEffect } from 'react';

export interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'yield';
  amount: number;
  tokens: number;
  timestamp: number;
  txHash?: string;
}

const STORAGE_KEY = 'bondfi_transactions';

export function useTransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load transactions from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTransactions(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse transactions:', e);
      }
    }
  }, []);

  // Save transactions to localStorage whenever they change
  const saveTransactions = (txs: Transaction[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(txs));
    setTransactions(txs);
  };

  const addTransaction = (tx: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    const updated = [newTx, ...transactions].slice(0, 50); // Keep last 50 transactions
    saveTransactions(updated);
    return newTx;
  };

  const clearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setTransactions([]);
  };

  const getTotalInvested = () => {
    return transactions
      .filter(tx => tx.type === 'buy')
      .reduce((sum, tx) => sum + tx.amount, 0);
  };

  const getTotalTokens = () => {
    const bought = transactions
      .filter(tx => tx.type === 'buy')
      .reduce((sum, tx) => sum + tx.tokens, 0);
    const sold = transactions
      .filter(tx => tx.type === 'sell')
      .reduce((sum, tx) => sum + tx.tokens, 0);
    return bought - sold;
  };

  return {
    transactions,
    addTransaction,
    clearHistory,
    getTotalInvested,
    getTotalTokens,
  };
}
