import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Wallet, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MOCK_DATA } from '@/config/wagmi.tsx';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'buy' | 'sell';
}

export function TradeModal({ isOpen, onClose, mode }: TradeModalProps) {
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<'input' | 'confirm' | 'success'>('input');

  const handleTrade = () => {
    setStep('confirm');
    // Simulate transaction
    setTimeout(() => {
      setStep('success');
    }, 2000);
  };

  const handleClose = () => {
    setStep('input');
    setAmount('');
    onClose();
  };

  const parsedAmount = parseFloat(amount) || 0;
  const estimatedYield = parsedAmount * (MOCK_DATA.bondAPY / 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-display font-semibold">
                  {mode === 'buy' ? 'Buy Bond Tokens' : 'Redeem Bonds'}
                </h2>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {step === 'input' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    {/* Input */}
                    <div className="space-y-2">
                      <label className="text-sm text-muted-foreground">
                        {mode === 'buy' ? 'USDC Amount' : 'Bond Tokens'}
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00"
                          className="w-full h-14 px-4 pr-20 rounded-xl bg-secondary border border-border text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {mode === 'buy' ? 'USDC' : 'USTB'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Available Balance</span>
                        <button
                          onClick={() => setAmount('1000')}
                          className="text-primary hover:underline"
                        >
                          Max: $1,000.00
                        </button>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <ArrowRight className="w-5 h-5 text-muted-foreground rotate-90" />
                      </div>
                    </div>

                    {/* Output */}
                    <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">You will receive</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-semibold">
                          {parsedAmount.toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {mode === 'buy' ? 'USTB Tokens' : 'USDC'}
                        </span>
                      </div>
                    </div>

                    {/* Estimated yield */}
                    {mode === 'buy' && parsedAmount > 0 && (
                      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-primary">Estimated Annual Yield</span>
                        </div>
                        <p className="text-2xl font-display font-bold text-primary">
                          ${estimatedYield.toFixed(2)} / year
                        </p>
                      </div>
                    )}

                    <Button
                      onClick={handleTrade}
                      size="lg"
                      className="w-full"
                      disabled={parsedAmount <= 0}
                    >
                      <Wallet className="w-5 h-5" />
                      {mode === 'buy' ? 'Buy Bond Tokens' : 'Redeem for USDC'}
                    </Button>
                  </motion.div>
                )}

                {step === 'confirm' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-12 text-center"
                  >
                    <div className="w-16 h-16 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center animate-pulse">
                      <Wallet className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Confirm in Wallet</h3>
                    <p className="text-muted-foreground">
                      Please confirm the transaction in your wallet
                    </p>
                  </motion.div>
                )}

                {step === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center"
                  >
                    <div className="w-16 h-16 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Transaction Successful!</h3>
                    <p className="text-muted-foreground mb-6">
                      You have successfully {mode === 'buy' ? 'purchased' : 'redeemed'}{' '}
                      <span className="text-foreground font-medium">
                        {parsedAmount.toLocaleString()} {mode === 'buy' ? 'USTB' : 'USDC'}
                      </span>
                    </p>
                    <Button onClick={handleClose} variant="secondary">
                      Close
                    </Button>
                  </motion.div>
                )}
              </div>

              {/* Footer disclaimer */}
              {step === 'input' && (
                <div className="px-6 pb-6">
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50 text-xs text-muted-foreground">
                    <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>
                      This is a demo transaction. In production, this would interact with deployed smart contracts on Polygon.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
