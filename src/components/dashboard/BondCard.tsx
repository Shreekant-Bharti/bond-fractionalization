import { motion } from 'framer-motion';
import { Shield, Clock, Percent, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MOCK_DATA } from '@/config/wagmi.tsx';

interface BondCardProps {
  onBuy: () => void;
}

export function BondCard({ onBuy }: BondCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative overflow-hidden rounded-2xl border border-border"
    >
      {/* Premium header */}
      <div className="gradient-gold p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-accent-foreground/10 backdrop-blur flex items-center justify-center">
              <Shield className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h3 className="font-display font-bold text-accent-foreground">
                {MOCK_DATA.bondName}
              </h3>
              <p className="text-sm text-accent-foreground/70">
                {MOCK_DATA.issuer}
              </p>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-accent-foreground/10 backdrop-blur">
            <span className="text-sm font-semibold text-accent-foreground">AAA Rated</span>
          </div>
        </div>
      </div>

      {/* Bond details */}
      <div className="bg-card p-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <BondDetail
            icon={Percent}
            label="Current APY"
            value={`${MOCK_DATA.bondAPY}%`}
            highlight
          />
          <BondDetail
            icon={DollarSign}
            label="Token Price"
            value={`$${MOCK_DATA.bondPrice.toFixed(2)}`}
          />
          <BondDetail
            icon={Clock}
            label="Maturity Date"
            value={MOCK_DATA.maturityDate}
          />
          <BondDetail
            icon={Shield}
            label="Risk Level"
            value="Very Low"
          />
        </div>

        <div className="space-y-3">
          <Button onClick={onBuy} size="lg" className="w-full">
            Buy Bond Tokens
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Backed 1:1 by US Treasury Bonds • Fully Audited
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function BondDetail({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
        highlight ? 'bg-primary/20' : 'bg-muted'
      }`}>
        <Icon className={`w-5 h-5 ${highlight ? 'text-primary' : 'text-muted-foreground'}`} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`font-semibold ${highlight ? 'text-primary' : 'text-foreground'}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
