import { useState } from 'react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-xl">Bond<span className="text-primary">Fi</span></div>
          <Button size="sm" onClick={() => setIsConnected(!isConnected)}>
            {isConnected ? '0x1234...5678' : 'Connect Wallet'}
          </Button>
        </div>
      </header>

      <main className="pt-20 pb-12">
        {/* Hero */}
        <section className="text-center py-16 px-4">
          <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="text-sm font-medium text-primary">Backed by US Treasury Bonds</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Invest in <span className="text-primary">Government Bonds</span><br />
            <span className="text-accent">On-Chain</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Access institutional-grade treasury bonds starting from $1. Earn 5.25% APY.
          </p>
        </section>

        {/* Stats Grid */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-6 rounded-xl bg-card border border-border">
              <p className="text-sm text-muted-foreground">Total Value Locked</p>
              <p className="text-2xl font-bold text-primary">$12.5M</p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border">
              <p className="text-sm text-muted-foreground">Current APY</p>
              <p className="text-2xl font-bold text-accent">5.25%</p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border">
              <p className="text-sm text-muted-foreground">Your Holdings</p>
              <p className="text-2xl font-bold">$2,450</p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border">
              <p className="text-sm text-muted-foreground">Total Earnings</p>
              <p className="text-2xl font-bold text-primary">$127.50</p>
            </div>
          </div>
        </section>

        {/* Bond Card */}
        <section className="container mx-auto px-4 py-8 max-w-md">
          <div className="rounded-xl border border-border overflow-hidden">
            <div className="bg-accent p-4">
              <h3 className="font-bold text-accent-foreground">US Treasury Bond 2026</h3>
              <p className="text-sm text-accent-foreground/70">U.S. Department of Treasury</p>
            </div>
            <div className="bg-card p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-secondary"><p className="text-xs text-muted-foreground">APY</p><p className="font-bold text-primary">5.25%</p></div>
                <div className="p-3 rounded-lg bg-secondary"><p className="text-xs text-muted-foreground">Price</p><p className="font-bold">$1.00</p></div>
              </div>
              <Button onClick={() => setShowModal(true)} className="w-full" size="lg">Buy Bond Tokens</Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 text-sm text-muted-foreground">
          © 2024 BondFi - Demo Prototype
        </footer>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-background/80" onClick={() => setShowModal(false)} />
          <div className="relative bg-card border border-border rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Buy Bond Tokens</h2>
            <input type="number" placeholder="Enter amount" className="w-full p-3 rounded-lg bg-secondary border border-border mb-4" />
            <Button onClick={() => setShowModal(false)} className="w-full">Confirm Purchase</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
