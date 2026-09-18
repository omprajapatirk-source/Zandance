export interface WalletState {
  isConnected: boolean;
  address: string;
  shieldedAddress: string;
  nightBalance: number;
  dustBalance: number;
  tokenBalances: {
    USDC: number;
    USDT: number;
    ETH: number;
    SOL: number;
    ADA: number;
  };
}

export interface GaslessIntent {
  id: string;
  sourceChain: string;
  targetChain: string;
  asset: string;
  amount: number;
  feeToken: string;
  quotedFee: number;
  dustEquivalent: number;
  intentHash: string;
  status: 'draft' | 'proving' | 'sponsoring' | 'settled';
  timestamp: number;
  txHash?: string;
  proofHex?: string;
}

export interface PoolStats {
  reserveDust: number;
  stakedNight: number;
  totalSponsoredTxs: number;
  totalDustSponsored: number;
  currentEpoch: number;
  decayRatePerHour: number;
  activeRelayers: number;
}
