import { motion } from 'framer-motion';
import { Shield, TrendingUp, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@/config/wagmi.tsx';

export function Header() {
  const { isConnected, address, connect, disconnect } = useWallet();

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full gradient-gold animate-pulse" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-foreground">
              Bond<span className="text-primary">Fi</span>
            </h1>
            <p className="text-xs text-muted-foreground">Tokenized Treasury Bonds</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink href="#dashboard" active>Dashboard</NavLink>
          <NavLink href="#marketplace">Marketplace</NavLink>
          <NavLink href="#portfolio">Portfolio</NavLink>
          <NavLink href="#docs">Docs</NavLink>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">5.25% APY</span>
          </div>
          
          {isConnected ? (
            <Button variant="glass" size="sm" onClick={disconnect}>
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">{address}</span>
            </Button>
          ) : (
            <Button size="sm" onClick={connect}>
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
}

function NavLink({ 
  href, 
  children, 
  active = false 
}: { 
  href: string; 
  children: React.ReactNode; 
  active?: boolean;
}) {
  return (
    <a 
      href={href}
      className={`text-sm font-medium transition-colors ${
        active 
          ? 'text-foreground' 
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {children}
    </a>
  );
}
