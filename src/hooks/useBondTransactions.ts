import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export interface BondTransaction {
  id: string;
  user_id: string;
  type: 'buy' | 'sell' | 'yield';
  amount: number;
  tokens: number;
  tx_hash: string | null;
  created_at: string;
}

export function useBondTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<BondTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch transactions from database
  const fetchTransactions = async () => {
    if (!user) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('bond_transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error loading transactions",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTransactions(data as BondTransaction[]);
    }
    setIsLoading(false);
  };

  // Set up realtime subscription
  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    fetchTransactions();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('bond_transactions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bond_transactions',
          filter: `user_id=eq.${user.id}`,
        },
        (payload: RealtimePostgresChangesPayload<BondTransaction>) => {
          if (payload.eventType === 'INSERT') {
            setTransactions((prev) => [payload.new as BondTransaction, ...prev].slice(0, 50));
          } else if (payload.eventType === 'DELETE') {
            setTransactions((prev) => prev.filter((t) => t.id !== (payload.old as BondTransaction).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const addTransaction = async (tx: {
    type: 'buy' | 'sell' | 'yield';
    amount: number;
    tokens: number;
    txHash?: string;
  }) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to make transactions",
        variant: "destructive",
      });
      return null;
    }

    const { data, error } = await supabase
      .from('bond_transactions')
      .insert({
        user_id: user.id,
        type: tx.type,
        amount: tx.amount,
        tokens: tx.tokens,
        tx_hash: tx.txHash || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding transaction:', error);
      toast({
        title: "Transaction failed",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    return data as BondTransaction;
  };

  const clearHistory = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('bond_transactions')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error('Error clearing history:', error);
      toast({
        title: "Error clearing history",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTransactions([]);
      toast({
        title: "History cleared",
        description: "All transactions have been removed",
      });
    }
  };

  const getTotalInvested = () => {
    return transactions
      .filter((tx) => tx.type === 'buy')
      .reduce((sum, tx) => sum + Number(tx.amount), 0);
  };

  const getTotalTokens = () => {
    const bought = transactions
      .filter((tx) => tx.type === 'buy')
      .reduce((sum, tx) => sum + Number(tx.tokens), 0);
    const sold = transactions
      .filter((tx) => tx.type === 'sell')
      .reduce((sum, tx) => sum + Number(tx.tokens), 0);
    return bought - sold;
  };

  return {
    transactions,
    isLoading,
    addTransaction,
    clearHistory,
    getTotalInvested,
    getTotalTokens,
    refetch: fetchTransactions,
  };
}
