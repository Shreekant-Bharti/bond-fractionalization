import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { YieldChart } from '@/components/YieldChart';
import { TransactionHistory } from '@/components/TransactionHistory';
import { UserMenu } from '@/components/UserMenu';
import { useBondTransactions } from '@/hooks/useBondTransactions';
import { useAuth } from '@/hooks/useAuth';
import { 
  Shield, TrendingUp, Lock, Zap, Wallet, DollarSign, Percent, 
  X, AlertCircle, CheckCircle2, ArrowRight, Loader2, Sparkles
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock data
const MOCK_DATA = {
  bondAPY: 5.25,
  totalValueLocked: 12_500_000,
  bondPrice: 1.00,
  bondName: 'US Treasury Bond 2026',
  issuer: 'U.S. Department of Treasury',
};

const Index = () => {
  const { profile } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [tradeMode, setTradeMode] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { transactions, isLoading, addTransaction, clearHistory, getTotalInvested, getTotalTokens } = useBondTransactions();

  const userHoldings = getTotalTokens();
  const totalInvested = getTotalInvested();
  const estimatedEarnings = totalInvested * (MOCK_DATA.bondAPY / 100) * (transactions.length > 0 ? 0.5 : 0);

  const handleTrade = async () => {
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) return;

    if (tradeMode === 'sell' && parsedAmount > userHoldings) {
      toast({
        title: "Insufficient balance",
        description: `You only have ${userHoldings} USTB tokens`,
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Simulate transaction processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const result = await addTransaction({
      type: tradeMode,
      amount: parsedAmount,
      tokens: parsedAmount, // 1:1 ratio
      txHash: `0x${Math.random().toString(16).slice(2)}`,
    });

    setIsProcessing(false);

    if (result) {
      toast({
        title: tradeMode === 'buy' ? "Purchase Successful!" : "Redemption Successful!",
        description: `${tradeMode === 'buy' ? 'Purchased' : 'Redeemed'} ${parsedAmount} USTB tokens`,
      });
      setShowModal(false);
      setAmount('');
    }
  };

  const openTradeModal = (mode: 'buy' | 'sell') => {
    setTradeMode(mode);
    setShowModal(true);
  };

  // Convert transactions for TransactionHistory component
  const formattedTransactions = transactions.map(tx => ({
    id: tx.id,
    type: tx.type,
    amount: tx.amount,
    tokens: tx.tokens,
    timestamp: new Date(tx.created_at).getTime(),
    txHash: tx.tx_hash || undefined,
  }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Bond<span className="text-primary">Fi</span></h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Tokenized Treasury Bonds</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{MOCK_DATA.bondAPY}% APY</span>
            </div>
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="pt-20 pb-12">
        {/* Welcome Banner for new users */}
        {!isLoading && transactions.length === 0 && (
          <section className="container mx-auto px-4 py-4">
            <div className="rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold mb-1">
                    Welcome{profile?.name ? `, ${profile.name}` : ''}! 🎉
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Start investing in tokenized treasury bonds. Buy your first bond tokens to begin earning {MOCK_DATA.bondAPY}% APY.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Hero */}
        <section className="text-center py-12 px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Backed by US Treasury Bonds</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
            Invest in <span className="text-primary">Government Bonds</span><br />
            <span className="text-accent">On-Chain</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-6">
            Access institutional-grade treasury bonds starting from $1. Earn {MOCK_DATA.bondAPY}% APY.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-primary" /><span>{MOCK_DATA.bondAPY}% APY</span></div>
            <div className="flex items-center gap-2"><Lock className="w-4 h-4 text-primary" /><span>100% Backed</span></div>
            <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /><span>Instant Settlement</span></div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard 
              title="Total Value Locked" 
              value={`$${(MOCK_DATA.totalValueLocked / 1_000_000).toFixed(1)}M`} 
              icon={DollarSign} 
              variant="primary" 
            />
            <StatsCard 
              title="Current APY" 
              value={`${MOCK_DATA.bondAPY}%`} 
              icon={Percent} 
              variant="gold" 
            />
            <StatsCard 
              title="Your Holdings" 
              value={isLoading ? '...' : `$${userHoldings.toLocaleString()}`} 
              icon={Wallet} 
              subtitle={isLoading ? '' : `${userHoldings} USTB`}
            />
            <StatsCard 
              title="Est. Earnings" 
              value={isLoading ? '...' : `$${estimatedEarnings.toFixed(2)}`} 
              icon={TrendingUp}
              variant="primary"
            />
          </div>
        </section>

        {/* Main Content Grid */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Yield Chart - Takes 2 columns */}
            <div className="lg:col-span-2">
              <YieldChart investment={userHoldings || 100} apy={MOCK_DATA.bondAPY} />
            </div>

            {/* Bond Card */}
            <div className="rounded-xl border border-border overflow-hidden">
              <div className="bg-accent p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent-foreground/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-bold text-accent-foreground">{MOCK_DATA.bondName}</h3>
                    <p className="text-sm text-accent-foreground/70">{MOCK_DATA.issuer}</p>
                  </div>
                </div>
              </div>
              <div className="bg-card p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-secondary">
                    <p className="text-xs text-muted-foreground">APY</p>
                    <p className="font-bold text-primary">{MOCK_DATA.bondAPY}%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary">
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="font-bold">${MOCK_DATA.bondPrice.toFixed(2)}</p>
                  </div>
                </div>
                <Button onClick={() => openTradeModal('buy')} className="w-full" size="lg">
                  Buy Bond Tokens
                </Button>
                {userHoldings > 0 && (
                  <Button onClick={() => openTradeModal('sell')} variant="outline" className="w-full">
                    Redeem Tokens
                  </Button>
                )}
                <p className="text-xs text-center text-muted-foreground">
                  AAA Rated • Cloud Database • Real-time Sync
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Transaction History */}
        <section className="container mx-auto px-4 py-8 max-w-2xl">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <TransactionHistory transactions={formattedTransactions} onClear={clearHistory} />
          )}
        </section>

        {/* Tech Progress Table */}
        <section className="container mx-auto px-4 py-8 max-w-3xl">
          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="text-lg font-semibold">Tech Progress & Roadmap</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left p-3 font-medium">Feature</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Implementation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-border">
                    <td className="p-3">Fractional Tokens</td>
                    <td className="p-3"><span className="text-primary">✅ Complete</span></td>
                    <td className="p-3 text-muted-foreground">ERC-20 Bond tokens minted for as low as $1</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3">Stablecoin Swap</td>
                    <td className="p-3"><span className="text-primary">✅ Complete</span></td>
                    <td className="p-3 text-muted-foreground">Automated swap of USDT for Bond tokens</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3">User Authentication</td>
                    <td className="p-3"><span className="text-primary">✅ Complete</span></td>
                    <td className="p-3 text-muted-foreground">Email/Password + Google OAuth</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3">Database Persistence</td>
                    <td className="p-3"><span className="text-primary">✅ Complete</span></td>
                    <td className="p-3 text-muted-foreground">PostgreSQL with RLS policies</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3">Real-time Sync</td>
                    <td className="p-3"><span className="text-primary">✅ Complete</span></td>
                    <td className="p-3 text-muted-foreground">Live updates across browser tabs</td>
                  </tr>
                  <tr className="border-t border-border">
                    <td className="p-3">Network</td>
                    <td className="p-3"><span className="text-accent">🔄 Deploying</span></td>
                    <td className="p-3 text-muted-foreground">Polygon Amoy Testnet for low gas fees</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 text-sm text-muted-foreground border-t border-border mt-8">
          <p>© 2024 BondFi - Hackathon Demo Prototype</p>
          <p className="text-xs mt-1">Polygon Amoy Testnet • Cloud Database • Real-time Sync</p>
        </footer>
      </main>

      {/* Trade Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => !isProcessing && setShowModal(false)} />
          <div className="relative bg-card border border-border rounded-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold">
                {tradeMode === 'buy' ? 'Buy Bond Tokens' : 'Redeem Tokens'}
              </h2>
              <button 
                onClick={() => !isProcessing && setShowModal(false)} 
                className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center"
                disabled={isProcessing}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {isProcessing ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center animate-pulse">
                    <Wallet className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Processing Transaction</h3>
                  <p className="text-sm text-muted-foreground">Saving to database...</p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">
                      {tradeMode === 'buy' ? 'USDC Amount' : 'USTB Tokens'}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full h-14 px-4 pr-16 rounded-xl bg-secondary border border-border text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        {tradeMode === 'buy' ? 'USDC' : 'USTB'}
                      </span>
                    </div>
                    {tradeMode === 'sell' && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Available: {userHoldings} USTB
                      </p>
                    )}
                  </div>

                  <div className="flex justify-center">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 rotate-90" />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                    <p className="text-sm text-muted-foreground mb-1">You will receive</p>
                    <p className="text-2xl font-semibold">
                      {parseFloat(amount) || 0} {tradeMode === 'buy' ? 'USTB' : 'USDC'}
                    </p>
                  </div>

                  {parseFloat(amount) > 0 && tradeMode === 'buy' && (
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Est. Annual Yield</span>
                      </div>
                      <p className="text-xl font-bold text-primary">
                        ${(parseFloat(amount) * MOCK_DATA.bondAPY / 100).toFixed(2)} / year
                      </p>
                    </div>
                  )}

                  <Button onClick={handleTrade} className="w-full" size="lg" disabled={!parseFloat(amount)}>
                    <Wallet className="w-5 h-5" />
                    {tradeMode === 'buy' ? 'Confirm Purchase' : 'Confirm Redemption'}
                  </Button>

                  <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50 text-xs text-muted-foreground">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>Transaction saved to cloud database with real-time sync.</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Stats Card Component
function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  variant, 
  subtitle 
}: { 
  title: string; 
  value: string; 
  icon: React.ElementType; 
  variant?: 'primary' | 'gold'; 
  subtitle?: string;
}) {
  return (
    <div className={`p-5 rounded-xl border transition-all hover:scale-[1.02] ${
      variant === 'primary' ? 'gradient-card border-primary/20 shadow-glow' :
      variant === 'gold' ? 'gradient-card border-accent/20 shadow-gold' :
      'bg-card border-border'
    }`}>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
        variant === 'primary' ? 'bg-primary/20' :
        variant === 'gold' ? 'bg-accent/20' :
        'bg-secondary'
      }`}>
        <Icon className={`w-5 h-5 ${
          variant === 'primary' ? 'text-primary' :
          variant === 'gold' ? 'text-accent' :
          'text-muted-foreground'
        }`} />
      </div>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className={`text-xl md:text-2xl font-bold ${
        variant === 'primary' ? 'text-primary' :
        variant === 'gold' ? 'text-accent' : ''
      }`}>{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}

export default Index;
