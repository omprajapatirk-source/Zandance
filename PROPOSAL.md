# PROPOSAL.md — Zandance (Nyx) Product Idea Submission

## 1. Product & Users

**Zandance** is a privacy-preserving fee-abstraction router and gasless wallet purpose-built for the Midnight Network. It solves the "cold-start UX problem": new users arriving from Ethereum, Polygon, Cardano, or Solana cannot transact on Midnight without first acquiring DUST (Midnight's non-transferable gas resource generated from staked NIGHT). Zandance eliminates this barrier entirely.

### Target Users

| User Segment | Pain Point Solved |
| :--- | :--- |
| **Cross-chain DeFi users** | Can pay Midnight gas fees using USDC, USDT, ETH, SOL, or ADA — no DUST or NIGHT needed |
| **Privacy-conscious individuals** | Transfer assets without revealing sender identity, balance, or payload on any public ledger |
| **dApp developers** | Integrate gasless, privacy-preserving transactions into their Midnight applications via Zandance's router |
| **Institutional / compliance teams** | Prove authorization and solvency via ZK proofs without exposing proprietary trading positions |

### Core Product Features

1. **Zero-Gas Cross-Chain Transfers**: Users select a source chain, destination chain, amount, and fee payment token. Zandance quotes the DUST equivalent, sponsors it from its liquidity pool, and settles the transaction gaslessly.
2. **Privacy-Preserving Fee Sponsorship**: The `sponsorFeeIntent` Compact circuit executes private witnesses (user secret, shielded balance, intent payload) entirely off-chain. Only a blind `intentHash` and `maxFee` are disclosed to the public Midnight ledger.
3. **DUST Liquidity Pool with Decay Mechanics**: Zandance pools DUST generated from protocol-staked NIGHT. The pool naturally decays per Midnight's anti-speculation design, and the protocol continuously rebalances via the `applyDustDecay` circuit.
4. **Lace Wallet Integration**: Direct browser-extension connectivity via the `@midnight-ntwrk/dapp-connector-api`, enabling one-click wallet connect/disconnect with proper error handling.

---

## 2. Why Midnight?

Zandance is fundamentally impossible to build on any other blockchain. Here's why:

### Midnight-Specific Capabilities Used

| Midnight Feature | How Zandance Uses It |
| :--- | :--- |
| **Compact Language & ZK Circuits** | All 7 circuits (`initialize`, `registerRelayer`, `sponsorFeeIntent`, `claimReimbursement`, `depositDustReserve`, `applyDustDecay`, `deregisterRelayer`) are written in Compact and compiled to ZKIR |
| **Private Witnesses** | `getSenderSecret()`, `getIntentPayload()`, `getShieldedBalance()` — these off-chain private inputs are evaluated inside the ZK prover and never touch the public ledger |
| **`disclose()` keyword** | Only `intentHash` and `maxFee` are deliberately disclosed via `disclose()`. Everything else remains in the private witness. This is the core privacy invariant. |
| **DUST as non-transferable gas** | DUST's decay mechanic is central to Zandance's economics. The `applyDustDecay` circuit enforces epoch-based decay, and the pool's health is a first-class UI concern. |
| **NIGHT staking → DUST generation** | The protocol stakes NIGHT to generate DUST capacity, which is then pooled for user fee sponsorship. This is the fundamental economic loop. |

### Why Not Other Chains?

- **Ethereum / Polygon**: No native private witness model. Even with ERC-4337 paymasters, the user's address and balance are always public. Privacy requires external mixers (Tornado Cash-style), which are legally fraught and architecturally separate from the fee layer.
- **Cardano**: UTXO model allows some privacy, but lacks a built-in ZK circuit language or `disclose()` semantics. Building equivalent privacy would require custom Plutus scripts with external ZK libraries.
- **Solana**: Account model with full public visibility. No native privacy features.
- **Midnight uniquely combines**: (a) first-class ZK circuits in Compact, (b) the `disclose()` primitive for selective transparency, (c) the DUST/NIGHT dual-token gas model, and (d) the Lace wallet ecosystem. Zandance leverages all four.

---

## 3. Data Model: Public State / Private Witness / Disclose

### Public Ledger State (On-Chain, Observable by Anyone)

These fields are declared with `export ledger` in the Compact contract and stored on the Midnight public ledger:

```
admin:                       Bytes<32>   — Protocol operator address
dustPoolReserve:             Uint<64>    — Total DUST available for sponsorship
totalSponsoredTransactions:  Uint<64>    — Cumulative gasless transaction count
totalDustSponsored:          Uint<64>    — Cumulative DUST spent on fee sponsorship
currentEpoch:                Uint<64>    — Current decay epoch number
activeRelayers:              Map<Bytes<32>, Boolean>  — Authorized relayer keys
intentCommitments:           Map<Bytes<32>, Uint<64>> — intentHash → maxFee
settledIntents:              Map<Bytes<32>, Boolean>  — Replay protection flags
```

### Private Witnesses (Off-Chain, Never Visible on Ledger)

These are declared with the `witness` keyword and executed exclusively inside the client-side ZK prover:

```
getSenderSecret():    Bytes<32>  — User's private key / nullifier seed
getIntentPayload():   Bytes<32>  — Shielded cross-chain transfer details
getShieldedBalance(): Uint<64>   — User's private token balance
```

### Disclose Boundary

The `disclose()` keyword is the explicit gate between private and public:

```compact
// ONLY these two values cross from private → public:
intentCommitments.insert(disclose(intentHash), disclose(maxFee));

// Everything else (secret, payload, balance) stays private
```

**Observable Privacy Invariant**: An observer can see that *some* user committed `intentHash` with `maxFee` DUST, but cannot determine *who* the user is, *what* they are transferring, or *how much* they hold.

---

## 4. Scope & Feasibility for Mainnet by Level 6

### Current State (Level 2–3 Submission)

- ✅ 7 compiled Compact circuits with ZKIR, prover/verifier keys
- ✅ Deployed to Preprod with verifiable contract address
- ✅ 11 passing automated tests covering circuit logic, state transitions, and privacy
- ✅ CI/CD pipeline (GitHub Actions)
- ✅ Lace wallet integration via DApp connector API
- ✅ Frontend circuit calls using compiled contract runtime

### Mainnet Roadmap

| Level | Milestone | Technical Work Required |
| :--- | :--- | :--- |
| **Level 4** | Multi-relayer settlement | Deploy 3+ relayer nodes; implement `claimReimbursement` flow end-to-end with real EVM/Cardano bridge adapters |
| **Level 5** | Audit-ready contracts | Formal verification of Compact circuits; security audit of `disclose()` boundaries; stress-test DUST decay under adversarial conditions |
| **Level 6** | Mainnet deployment | Migrate from Preprod to Mainnet; integrate with production Lace wallet; establish NIGHT staking pool with real liquidity partners |

### Feasibility Assessment

**Achievable with constraints:**

1. **Smart Contracts**: The 7 circuits are already feature-complete. Mainnet deployment requires only re-compilation against the Mainnet-targeted compiler and a security audit.
2. **DUST Economics**: The decay mechanic is implemented and tested. Production tuning of `decayRatePerHour` will require economic modeling with real staking data.
3. **Cross-Chain Bridges**: The current architecture abstracts bridge adapters behind the `intentPayload` witness. Production bridges (EVM paymasters, Cardano Plutus endpoints) are the largest engineering effort, estimated at 8–12 weeks.
4. **Wallet Integration**: Already using the official `@midnight-ntwrk/dapp-connector-api`. Mainnet Lace support should be a configuration change.

**Risk factors**: Cross-chain bridge security (requires auditing each adapter independently), DUST liquidity bootstrapping (requires partnership with NIGHT stakers), and Midnight Mainnet launch timeline (external dependency).

---

## License

MIT License © 2026 Zandance Core Team
