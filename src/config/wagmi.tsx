import { createContext, useContext, useState, ReactNode } from 'react';

interface WalletContextType {
  isConnected: boolean;
  address: string | null;
  connect: () => void;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType>({
  isConnected: false,
  address: null,
  connect: () => {},
  disconnect: () => {},
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  const connect = () => {
    // Simulate wallet connection
    setIsConnected(true);
    setAddress('0x1234...5678');
  };

  const disconnect = () => {
    setIsConnected(false);
    setAddress(null);
  };

  return (
    <WalletContext.Provider value={{ isConnected, address, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);

// Contract addresses (replace with deployed addresses)
export const CONTRACT_ADDRESSES = {
  bondToken: '0x0000000000000000000000000000000000000000',
  mockUSDC: '0x0000000000000000000000000000000000000000',
} as const;

// Mock data for demo purposes
export const MOCK_DATA = {
  bondAPY: 5.25,
  totalValueLocked: 12_500_000,
  userBalance: 2_450,
  totalEarnings: 127.50,
  pendingYield: 12.35,
  bondPrice: 1.00,
  maturityDate: '2026-06-15',
  bondName: 'US Treasury Bond 2026',
  issuer: 'U.S. Department of Treasury',
};
