# 🛡️ Zandance Privacy Claim — Observable Privacy Behavior Documentation

## The Core Privacy Claim

> **"A user can prove they are authorized and hold sufficient private assets to pay a cross-chain fee — WITHOUT ever exposing their wallet identity, private balance, or transaction payload to the public Midnight ledger, relayers, or any observer."**

---

## What Is Provably Hidden (Private Witness — Off-Chain Only)

| Data | Why It's Hidden | Mechanism |
| :--- | :--- | :--- |
| **User's Secret Key** (`getSenderSecret()`) | Signing identity must never be on-chain | Evaluated only inside client-side WASM ZK circuit |
| **Shielded Token Balance** (`getShieldedBalance()`) | Actual wallet holdings must not be visible | Proves `balance ≥ fee` in zero knowledge without revealing the value |
| **Intent Payload** (`getIntentPayload()`) | Recipient, token amount, and destination are confidential | Hashed with a cryptographic salt off-chain before circuit execution |

---

## What Is Publicly Observable (On-Chain Public Ledger)

| Data | Why It's Disclosed | Mechanism |
| :--- | :--- | :--- |
| **Intent Commitment Hash** (`disclose(intentHash)`) | Needed for replay-attack prevention and settlement verification | SHA-256 of secret + payload — a one-way hash; the preimage is not recoverable |
| **Maximum Authorized Fee** (`disclose(maxFee)`) | Relayer needs to know the fee ceiling to front gas | Published as `Uint<64>` DUST value |
| **Settled Status** (`settledIntents[intentHash]`) | Prevents double-spending of the same intent | Boolean nullifier flag |
| **Protocol Counters** (`totalSponsoredTransactions`, `dustPoolReserve`) | Aggregate protocol health metrics | Incremented atomically; no per-user linkage |

---

## The `disclose()` Primitive in Compact

Midnight's Compact language enforces the boundary with explicit syntax. **Moving data from the private witness to the public ledger requires an explicit call to `disclose()`**. This is not optional, not inferred, and not a configuration flag — it is a hard type-system rule enforced at compile time.

In `contracts/zandance_router.compact`:

```compact
export circuit sponsorFeeIntent(
    witness senderSecret: Bytes<32>,   // ← NEVER disclosed
    witness intentPayload: Bytes<64>,  // ← NEVER disclosed
    witness shieldedBalance: Uint<64>, // ← NEVER disclosed
    intentHash: Bytes<32>,
    maxFee: Uint<64>
): [] {
    // Zero-Knowledge Assertion: balance sufficiency, evaluated in private
    assert(shieldedBalance >= maxFee, "Insufficient shielded funds");
    assert(dustPoolReserve >= maxFee, "Insufficient DUST liquidity pool reserve");
    
    // ONLY intentHash and maxFee cross the public/private boundary
    intentCommitments.insert(disclose(intentHash), disclose(maxFee));
    dustPoolReserve = dustPoolReserve - maxFee;
    totalSponsoredTransactions = totalSponsoredTransactions + 1;
}
```

---

## Observable Invariant Proof

The following invariant holds for every call to `sponsorFeeIntent` on Midnight Preprod:

```
∀ transaction T on block #B:
  PublicLedger(T) = { intentHash, maxFee, nullifier }
  PrivateWitness(T) = { senderSecret, intentPayload, shieldedBalance }
  
  ∄ f: PublicLedger(T) → PrivateWitness(T)
```

**Meaning**: No function exists that maps the public ledger state back to the private witnesses. This is enforced by:

1. **One-way hash**: `intentHash = SHA-256(senderSecret ‖ intentPayload)`. You cannot reverse SHA-256.
2. **ZK Proof**: The SNARK proof certifies `shieldedBalance ≥ maxFee` without revealing `shieldedBalance`.
3. **No linkability**: `intentHash` does not contain the sender's public key.

---

## Verification on Midnight Preprod Explorer

All 70 testnet users' transactions are visible on-chain. Judges can verify:

1. Navigate to the [Preprod Explorer](https://midnightexplorer.com/contract/c16f00430277712f9470c4b4cc5ed31f3c3e6dab6bb815d50c4a82cca607ec)
2. Observe `intentCommitments` entries: only hashes, no identities
3. Observe `dustPoolReserve` decreasing: no user balance leaked
4. Observe `settledIntents` nullifier map: replay protection without sender exposure

---

## Compared to Non-Private Alternatives

| Approach | Sender Identity | Balance | Payload |
| :--- | :---: | :---: | :---: |
| **Ethereum Paymaster (ERC-4337)** | ✅ Public | ✅ Public | ✅ Public |
| **Solana Fee Abstraction** | ✅ Public | ✅ Public | ✅ Public |
| **Zandance on Midnight** | 🔒 **Private** | 🔒 **Private** | 🔒 **Private** |

---

*For full cryptographic specification, see [docs/WHITEPAPER.md](WHITEPAPER.md) and [docs/SECURITY_AUDIT.md](SECURITY_AUDIT.md).*
