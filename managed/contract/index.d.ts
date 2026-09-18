/**
 * Generated TypeScript type definitions for Midnight Compact contract: ZandanceRouter
 * Generated automatically by compactc
 */

export interface PublicLedgerState {
  admin: string;
  dustPoolReserve: bigint;
  totalSponsoredTransactions: bigint;
  totalDustSponsored: bigint;
  currentEpoch: bigint;
  activeRelayers: Record<string, boolean>;
  intentCommitments: Record<string, bigint>;
  settledIntents: Record<string, boolean>;
}

export interface PrivateWitnesses {
  getSenderSecret: () => string;
  getIntentPayload: () => string;
  getShieldedBalance: () => bigint;
}

export interface ZandanceRouterContract {
  readonly address?: string;
  readonly state: PublicLedgerState;
  initialize(initialAdmin: string, initialReserve: bigint): Promise<void>;
  registerRelayer(relayerPubkey: string): Promise<void>;
  deregisterRelayer(relayerPubkey: string): Promise<void>;
  depositDustReserve(amount: bigint): Promise<void>;
  applyDustDecay(decayAmount: bigint): Promise<void>;
  sponsorFeeIntent(witnesses: PrivateWitnesses, intentHash: string, maxFee: bigint): Promise<string>;
  claimReimbursement(intentHash: string, feeSpent: bigint, relayerPubkey: string): Promise<void>;
}

export declare const contractInfo: typeof import('./contract_info.json');
export declare function createContract(initialState?: Partial<PublicLedgerState>): ZandanceRouterContract;
