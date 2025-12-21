import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, ChevronDown, LogOut, Copy, ExternalLink, Check } from 'lucide-react';

interface WalletButtonProps {
  isConnected: boolean;
  address: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function WalletButton({ isConnected, address, onConnect, onDisconnect }: WalletButtonProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <Button onClick={onConnect} size="sm">
        <Wallet className="w-4 h-4" />
        <span className="hidden sm:inline">Connect Wallet</span>
      </Button>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowDropdown(!showDropdown)}
        className="gap-2"
      >
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span>{address ? truncateAddress(address) : 'Connected'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
      </Button>

      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowDropdown(false)} 
          />
          <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-card border border-border shadow-lg z-50 overflow-hidden">
            <div className="p-3 border-b border-border">
              <p className="text-xs text-muted-foreground mb-1">Connected Wallet</p>
              <p className="font-mono text-sm">{address ? truncateAddress(address) : 'Unknown'}</p>
            </div>
            
            <div className="p-2">
              <button
                onClick={copyAddress}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Address'}
              </button>
              
              <a
                href={address ? `https://amoy.polygonscan.com/address/${address}` : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                View on Explorer
              </a>
              
              <button
                onClick={() => {
                  onDisconnect();
                  setShowDropdown(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Disconnect
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
