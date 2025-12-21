import { motion } from 'framer-motion';
import { Wallet, TrendingUp, Clock, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MOCK_DATA } from '@/config/wagmi.tsx';

interface PortfolioSectionProps {
  onSell: () => void;
}

export function PortfolioSection({ onSell }: PortfolioSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-2xl bg-card border border-border overflow-hidden"
    >
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-display font-semibold text-foreground flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          Your Portfolio
        </h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Holdings */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-secondary/50">
            <p className="text-sm text-muted-foreground mb-1">Bond Holdings</p>
            <p className="text-2xl font-display font-bold text-foreground">
              ${MOCK_DATA.userBalance.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {MOCK_DATA.userBalance.toLocaleString()} USTB
            </p>
          </div>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <p className="text-sm text-muted-foreground mb-1">Total Earnings</p>
            <p className="text-2xl font-display font-bold text-primary">
              ${MOCK_DATA.totalEarnings.toFixed(2)}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 text-primary" />
              <span className="text-xs text-primary">+{MOCK_DATA.bondAPY}% APY</span>
            </div>
          </div>
        </div>

        {/* Pending yield */}
        <div className="p-4 rounded-xl gradient-card border border-accent/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-accent" />
              <span className="font-medium text-foreground">Claimable Yield</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Updates daily</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-display font-bold text-gradient-gold">
              ${MOCK_DATA.pendingYield.toFixed(2)}
            </p>
            <Button variant="gold" size="sm">
              Claim Yield
            </Button>
          </div>
        </div>

        {/* Transaction history preview */}
        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-3">Recent Activity</h4>
          <div className="space-y-2">
            <TransactionRow
              type="buy"
              amount="$500.00"
              tokens="500 USTB"
              time="2 hours ago"
            />
            <TransactionRow
              type="yield"
              amount="$2.45"
              tokens="Yield Claimed"
              time="1 day ago"
            />
            <TransactionRow
              type="buy"
              amount="$1,950.00"
              tokens="1,950 USTB"
              time="3 days ago"
            />
          </div>
        </div>

        <Button onClick={onSell} variant="outline" className="w-full">
          Redeem Bond Tokens
        </Button>
      </div>
    </motion.div>
  );
}

function TransactionRow({
  type,
  amount,
  tokens,
  time,
}: {
  type: 'buy' | 'sell' | 'yield';
  amount: string;
  tokens: string;
  time: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          type === 'buy' ? 'bg-primary/20' :
          type === 'yield' ? 'bg-accent/20' :
          'bg-destructive/20'
        }`}>
          {type === 'buy' && <TrendingUp className="w-4 h-4 text-primary" />}
          {type === 'yield' && <Gift className="w-4 h-4 text-accent" />}
          {type === 'sell' && <Wallet className="w-4 h-4 text-destructive" />}
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{tokens}</p>
          <p className="text-xs text-muted-foreground">{time}</p>
        </div>
      </div>
      <span className={`text-sm font-medium ${
        type === 'sell' ? 'text-destructive' : 'text-primary'
      }`}>
        {type === 'sell' ? '-' : '+'}{amount}
      </span>
    </div>
  );
}
