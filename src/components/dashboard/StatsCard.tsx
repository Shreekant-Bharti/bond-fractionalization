import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'gold';
  delay?: number;
}

export function StatsCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  variant = 'default',
  delay = 0,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "relative overflow-hidden rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02]",
        variant === 'primary' && "gradient-card border-primary/20 shadow-glow",
        variant === 'gold' && "gradient-card border-accent/20 shadow-gold",
        variant === 'default' && "bg-card border-border"
      )}
    >
      {/* Background glow */}
      {variant !== 'default' && (
        <div className={cn(
          "absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 blur-3xl",
          variant === 'primary' && "bg-primary",
          variant === 'gold' && "bg-accent"
        )} />
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center",
            variant === 'primary' && "bg-primary/20",
            variant === 'gold' && "bg-accent/20",
            variant === 'default' && "bg-secondary"
          )}>
            <Icon className={cn(
              "w-6 h-6",
              variant === 'primary' && "text-primary",
              variant === 'gold' && "text-accent",
              variant === 'default' && "text-muted-foreground"
            )} />
          </div>
          {change && (
            <span className={cn(
              "text-sm font-medium px-2 py-1 rounded-full",
              changeType === 'positive' && "text-primary bg-primary/10",
              changeType === 'negative' && "text-destructive bg-destructive/10",
              changeType === 'neutral' && "text-muted-foreground bg-secondary"
            )}>
              {change}
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <p className={cn(
          "text-3xl font-display font-bold",
          variant === 'primary' && "text-gradient-primary",
          variant === 'gold' && "text-gradient-gold",
          variant === 'default' && "text-foreground"
        )}>
          {value}
        </p>
      </div>
    </motion.div>
  );
}
