import { motion } from 'framer-motion';
import { Shield, TrendingUp, Lock, Zap } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 gradient-glow opacity-50" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Backed by US Treasury Bonds
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-foreground mb-6 leading-tight">
            Invest in{' '}
            <span className="text-gradient-primary">Government Bonds</span>
            <br />
            <span className="text-gradient-gold">On-Chain</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Access institutional-grade treasury bonds starting from just $1. 
            Earn 5.25% APY with full transparency, instant settlement, and 24/7 liquidity.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8">
            <FeatureBadge icon={TrendingUp} text="5.25% APY" />
            <FeatureBadge icon={Lock} text="100% Backed" />
            <FeatureBadge icon={Zap} text="Instant Settlement" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FeatureBadge({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className="w-5 h-5 text-primary" />
      <span className="font-medium">{text}</span>
    </div>
  );
}
