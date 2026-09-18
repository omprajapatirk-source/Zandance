import { describe, it, expect, beforeEach } from 'vitest';
import { createContract, contractInfo } from '../managed/contract/index.js';
import crypto from 'crypto';

describe('Zandance (Nyx) Midnight Compact Smart Contract Test Suite', () => {
  let contract: ReturnType<typeof createContract>;
  const adminAddress = '02' + 'a'.repeat(62);
  const relayerPubkey = '02' + 'b'.repeat(62);
  const unauthorizedRelayer = '02' + 'c'.repeat(62);
  const initialReserve = 5000000n; // 5M DUST

  beforeEach(async () => {
    contract = createContract();
    await contract.initialize(adminAddress, initialReserve);
  });

  describe('Level 1 & Level 3: Public Ledger State & Contract Compilation', () => {
    it('should have all compiled circuits listed in contract metadata', () => {
      expect(contractInfo.name).toBe('ZandanceRouter');
      expect(contractInfo.circuits.length).toBeGreaterThanOrEqual(6);
      const circuitNames = contractInfo.circuits.map((c: any) => c.name);
      expect(circuitNames).toContain('initialize');
      expect(circuitNames).toContain('registerRelayer');
      expect(circuitNames).toContain('sponsorFeeIntent');
      expect(circuitNames).toContain('claimReimbursement');
      expect(circuitNames).toContain('applyDustDecay');
    });

    it('should initialize contract with correct public ledger state', () => {
      expect(contract.state.admin).toBe(adminAddress);
      expect(contract.state.dustPoolReserve).toBe(initialReserve);
      expect(contract.state.totalSponsoredTransactions).toBe(0n);
      expect(contract.state.totalDustSponsored).toBe(0n);
      expect(contract.state.currentEpoch).toBe(1n);
    });

    it('should allow registering and deregistering cross-chain relayers', async () => {
      await contract.registerRelayer(relayerPubkey);
      expect(contract.state.activeRelayers[relayerPubkey]).toBe(true);

      await contract.deregisterRelayer(relayerPubkey);
      expect(contract.state.activeRelayers[relayerPubkey]).toBe(false);
    });
  });

  describe('Level 2 & Level 3: Observable Privacy & Zero-Knowledge Circuits', () => {
    it('should execute sponsorFeeIntent using private witnesses without leaking user secret', async () => {
      const userSecret = '0x' + crypto.randomBytes(32).toString('hex');
      const intentPayload = '0x' + crypto.randomBytes(32).toString('hex');
      const intentHash = '0x' + crypto.createHash('sha256').update(userSecret + intentPayload).digest('hex');
      const maxFee = 25000n; // 25,000 DUST

      const witnesses = {
        getSenderSecret: () => userSecret,
        getIntentPayload: () => intentPayload,
        getShieldedBalance: () => 100000n // 100k DUST equivalent held privately
      };

      const initialPoolReserve = contract.state.dustPoolReserve;
      const proof = await contract.sponsorFeeIntent(witnesses, intentHash, maxFee);

      // Verify proof generated
      expect(proof).toBeDefined();
      expect(proof.startsWith('0xproof_')).toBe(true);

      // Verify public ledger changes
      expect(contract.state.dustPoolReserve).toBe(initialPoolReserve - maxFee);
      expect(contract.state.intentCommitments[intentHash]).toBe(maxFee);
      expect(contract.state.totalSponsoredTransactions).toBe(1n);

      // Observable Privacy Invariant:
      // The public ledger ONLY knows intentHash and maxFee.
      // It DOES NOT know userSecret or intentPayload.
      expect((contract.state as any).userSecret).toBeUndefined();
      expect((contract.state as any).senderAddress).toBeUndefined();
      expect((contract.state as any).intentPayload).toBeUndefined();
    });

    it('should reject sponsorFeeIntent when shielded balance is insufficient', async () => {
      const intentHash = '0x' + crypto.randomBytes(32).toString('hex');
      const witnesses = {
        getSenderSecret: () => 'secret',
        getIntentPayload: () => 'payload',
        getShieldedBalance: () => 100n // only 100 DUST, but maxFee is 500
      };

      await expect(contract.sponsorFeeIntent(witnesses, intentHash, 500n))
        .rejects.toThrow('Shielded funds insufficient for fee intent');
    });
  });

  describe('Settlement, Replay Protection & DUST Pool Mechanics', () => {
    it('should allow authorized relayer to claim fee reimbursement and prevent double-claim replay', async () => {
      await contract.registerRelayer(relayerPubkey);

      const intentHash = '0x' + crypto.randomBytes(32).toString('hex');
      const committedFee = 50000n;
      const actualFeeSpent = 42000n;

      const witnesses = {
        getSenderSecret: () => 'user-private-key-salt',
        getIntentPayload: () => 'intent-details-shielded',
        getShieldedBalance: () => 100000n
      };

      await contract.sponsorFeeIntent(witnesses, intentHash, committedFee);

      // Unauthorized relayer cannot claim
      await expect(contract.claimReimbursement(intentHash, actualFeeSpent, unauthorizedRelayer))
        .rejects.toThrow('Unauthorized or inactive relayer');

      // Authorized relayer claims reimbursement
      const reserveBeforeClaim = contract.state.dustPoolReserve;
      await contract.claimReimbursement(intentHash, actualFeeSpent, relayerPubkey);

      // Settled flag recorded
      expect(contract.state.settledIntents[intentHash]).toBe(true);
      expect(contract.state.totalDustSponsored).toBe(actualFeeSpent);

      // Unused DUST (50,000 - 42,000 = 8,000) refunded back to pool reserve
      expect(contract.state.dustPoolReserve).toBe(reserveBeforeClaim + (committedFee - actualFeeSpent));

      // Replay attack prevention: second claim must fail
      await expect(contract.claimReimbursement(intentHash, actualFeeSpent, relayerPubkey))
        .rejects.toThrow('Intent already settled');
    });

    it('should support DUST pool reserve deposits and epoch-based DUST decay', async () => {
      const initialPool = contract.state.dustPoolReserve;
      
      // Deposit 1M DUST from NIGHT staking yields
      await contract.depositDustReserve(1000000n);
      expect(contract.state.dustPoolReserve).toBe(initialPool + 1000000n);

      // Apply Midnight DUST decay for the epoch
      const decayAmount = 50000n;
      await contract.applyDustDecay(decayAmount);
      expect(contract.state.dustPoolReserve).toBe(initialPool + 1000000n - decayAmount);
      expect(contract.state.currentEpoch).toBe(2n);
    });

    it('should correctly simulate cross-chain fee router quote and intent serialization', () => {
      // Simulate Cross-Chain Router price conversion
      const exchangeRates: Record<string, number> = {
        'USDC': 25000, // 1 USDC = 25,000 DUST
        'ETH': 75000000, // 1 ETH = 75,000,000 DUST
        'SOL': 4500000,
        'ADA': 18000
      };

      const gasCostDust = 50000; // 50k DUST
      const quotedUSDC = (gasCostDust / exchangeRates['USDC']).toFixed(4); // 2.0000 USDC
      
      expect(parseFloat(quotedUSDC)).toBe(2.0);

      // Intent hash integrity check
      const nonce = 1042;
      const intentDigest = crypto.createHash('sha256')
        .update(`crosschain_intent_${nonce}_USDC_${quotedUSDC}`)
        .digest('hex');

      expect(intentDigest).toHaveLength(64);
    });
  });
});
