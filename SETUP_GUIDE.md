# BondFi - Fractional Tokenized Government Bonds Platform

## 🚀 Setup Guide

### Prerequisites
- Node.js 18+
- MetaMask or compatible wallet
- Polygon Amoy Testnet configured

### Step 1: Smart Contract Deployment

1. **Install Hardhat or Foundry**
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
# OR
curl -L https://foundry.paradigm.xyz | bash
```

2. **Compile Contracts**
```bash
# Using Hardhat
npx hardhat compile

# Using Foundry
forge build
```

3. **Deploy to Polygon Amoy Testnet**
```bash
# Add network to hardhat.config.js
networks: {
  polygonAmoy: {
    url: "https://rpc-amoy.polygon.technology/",
    accounts: [PRIVATE_KEY],
    chainId: 80002
  }
}

# Deploy
npx hardhat run scripts/deploy.js --network polygonAmoy
```

4. **Verify Contracts**
```bash
npx hardhat verify --network polygonAmoy DEPLOYED_ADDRESS
```

### Step 2: Frontend Configuration

1. **Update Contract Addresses**
Edit `src/config/wagmi.ts`:
```typescript
export const CONTRACT_ADDRESSES = {
  bondToken: '0xYOUR_BOND_TOKEN_ADDRESS',
  mockUSDC: '0xYOUR_MOCK_USDC_ADDRESS',
};
```

2. **Get WalletConnect Project ID**
- Visit https://cloud.walletconnect.com/
- Create a project and copy the Project ID
- Update `src/config/wagmi.ts`:
```typescript
projectId: 'YOUR_PROJECT_ID',
```

3. **Run the Frontend**
```bash
npm install
npm run dev
```

### Step 3: Test the Platform

1. **Get Testnet MATIC**
- Visit https://faucet.polygon.technology/
- Request Amoy testnet MATIC

2. **Mint Mock USDC**
- Call `mint()` on MockUSDC contract
- Or use the admin function

3. **Purchase Bond Tokens**
- Connect wallet
- Approve USDC spending
- Click "Buy Bond Tokens"

---

## 📁 Project Structure

```
src/
├── contracts/          # Solidity smart contracts
│   └── BondToken.sol   # Main ERC-20 bond token
├── config/
│   └── wagmi.ts        # Web3 configuration
├── components/
│   ├── layout/         # Header, navigation
│   └── dashboard/      # Stats, charts, modals
├── pages/
│   └── Index.tsx       # Main dashboard
└── App.tsx             # Root component
```

## 🔐 Smart Contract Functions

### BondToken.sol

| Function | Access | Description |
|----------|--------|-------------|
| `mint(address, uint256)` | Admin | Mint new bond tokens |
| `purchaseBonds(uint256)` | Public | Buy bonds with USDC |
| `redeemBonds(uint256)` | Public | Sell bonds for USDC |
| `claimYield()` | Public | Claim accumulated yield |
| `distributeYield()` | Admin | Trigger yield distribution |
| `setAPY(uint256)` | Admin | Update bond APY |

## 🎨 Design System

The platform uses a custom dark theme optimized for fintech:
- **Primary**: Emerald green (#10B981) - Growth/Success
- **Accent**: Gold (#FBBF24) - Premium/Bonds
- **Background**: Deep navy (#0B1120) - Trust/Stability

## ⚠️ Disclaimer

This is a prototype for educational purposes only. Before deploying to mainnet:
- Conduct thorough security audits
- Implement proper access controls
- Add comprehensive testing
- Ensure regulatory compliance
