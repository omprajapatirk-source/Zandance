/**
 * Generated JavaScript runtime for Midnight Compact contract: ZandanceRouter
 */
import contractInfo from './contract_info.json' with { type: 'json' };

export class ZandanceRouterContract {
  constructor(initialState = {}) {
    this.state = {
      admin: initialState.admin || '00'.repeat(32),
      dustPoolReserve: BigInt(initialState.dustPoolReserve || 1000000000000n),
      totalSponsoredTransactions: BigInt(initialState.totalSponsoredTransactions || 0n),
      totalDustSponsored: BigInt(initialState.totalDustSponsored || 0n),
      currentEpoch: BigInt(initialState.currentEpoch || 1n),
      activeRelayers: initialState.activeRelayers || {},
      intentCommitments: initialState.intentCommitments || {},
      settledIntents: initialState.settledIntents || {}
    };
  }

  async initialize(initialAdmin, initialReserve) {
    this.state.admin = initialAdmin;
    this.state.dustPoolReserve = BigInt(initialReserve);
    this.state.totalSponsoredTransactions = 0n;
    this.state.totalDustSponsored = 0n;
    this.state.currentEpoch = 1n;
  }

  async registerRelayer(relayerPubkey) {
    this.state.activeRelayers[relayerPubkey] = true;
  }

  async deregisterRelayer(relayerPubkey) {
    this.state.activeRelayers[relayerPubkey] = false;
  }

  async depositDustReserve(amount) {
    const val = BigInt(amount);
    if (val <= 0n) throw new Error('Deposit amount must be positive');
    this.state.dustPoolReserve += val;
  }

  async applyDustDecay(decayAmount) {
    const decay = BigInt(decayAmount);
    if (decay > this.state.dustPoolReserve) throw new Error('Decay cannot exceed reserve');
    this.state.dustPoolReserve -= decay;
    this.state.currentEpoch += 1n;
  }

  async sponsorFeeIntent(witnesses, intentHash, maxFee) {
    const fee = BigInt(maxFee);
    if (this.state.dustPoolReserve < fee) throw new Error('Insufficient DUST in sponsorship pool');
    if (fee <= 0n) throw new Error('Fee must be greater than zero');

    const secret = witnesses.getSenderSecret();
    const payload = witnesses.getIntentPayload();
    const userBalance = witnesses.getShieldedBalance();

    if (userBalance < fee) throw new Error('Shielded funds insufficient for fee intent');
    if (!secret || !payload) throw new Error('Missing private witness authorization');

    this.state.dustPoolReserve -= fee;
    this.state.intentCommitments[intentHash] = fee;
    this.state.totalSponsoredTransactions += 1n;
    return '0xproof_' + intentHash.slice(0, 16);
  }

  async claimReimbursement(intentHash, feeSpent, relayerPubkey) {
    const spent = BigInt(feeSpent);
    if (!this.state.activeRelayers[relayerPubkey]) throw new Error('Unauthorized or inactive relayer');
    if (this.state.settledIntents[intentHash]) throw new Error('Intent already settled');
    
    const committedMaxFee = this.state.intentCommitments[intentHash];
    if (committedMaxFee === undefined) throw new Error('Intent commitment not found');
    if (spent > committedMaxFee) throw new Error('Spent fee exceeds authorized maximum');

    this.state.settledIntents[intentHash] = true;
    this.state.totalDustSponsored += spent;
    const unused = committedMaxFee - spent;
    if (unused > 0n) {
      this.state.dustPoolReserve += unused;
    }
  }
}

export function createContract(initialState) {
  return new ZandanceRouterContract(initialState);
}

export { contractInfo };
