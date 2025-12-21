import { Transaction } from '@/hooks/useTransactionHistory';
import { ArrowUpRight, ArrowDownLeft, Gift, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onClear: () => void;
}

export function TransactionHistory({ transactions, onClear }: TransactionHistoryProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'buy': return <ArrowDownLeft className="w-4 h-4 text-primary" />;
      case 'sell': return <ArrowUpRight className="w-4 h-4 text-destructive" />;
      case 'yield': return <Gift className="w-4 h-4 text-accent" />;
    }
  };

  const getLabel = (type: Transaction['type']) => {
    switch (type) {
      case 'buy': return 'Purchased';
      case 'sell': return 'Redeemed';
      case 'yield': return 'Yield Claimed';
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="rounded-xl bg-card border border-border p-6">
        <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
        <div className="text-center py-8 text-muted-foreground">
          <p>No transactions yet</p>
          <p className="text-sm mt-1">Buy some bond tokens to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-card border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Transaction History</h3>
        <Button variant="ghost" size="sm" onClick={onClear} className="text-muted-foreground">
          <Trash2 className="w-4 h-4 mr-1" />
          Clear
        </Button>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                tx.type === 'buy' ? 'bg-primary/20' :
                tx.type === 'yield' ? 'bg-accent/20' :
                'bg-destructive/20'
              }`}>
                {getIcon(tx.type)}
              </div>
              <div>
                <p className="text-sm font-medium">{getLabel(tx.type)} {tx.tokens} USTB</p>
                <p className="text-xs text-muted-foreground">{formatDate(tx.timestamp)}</p>
              </div>
            </div>
            <span className={`text-sm font-medium ${
              tx.type === 'sell' ? 'text-destructive' : 'text-primary'
            }`}>
              {tx.type === 'sell' ? '-' : '+'}${tx.amount.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4">
        Stored locally in your browser
      </p>
    </div>
  );
}
