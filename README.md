# 🌌 Zandance (Nyx) — One Wallet, Any Token, Zero Gas

> **Cross-Chain Fee Abstraction & Privacy-Preserving DUST Sponsorship on Midnight Network**

[![CI/CD Pipeline](https://github.com/zandance/zandance/actions/workflows/ci.yml/badge.svg)](https://github.com/zandance/zandance/actions)
[![Midnight Network](https://img.shields.io/badge/Midnight-Preprod%20Verified-7928ca.svg)](https://preprod.midnight.network)
[![Language](https://img.shields.io/badge/Smart%20Contracts-Compact%20v0.24-0070f3.svg)](https://docs.midnight.network)
[![Tests](https://img.shields.io/badge/Tests-8%20Passed-10b981.svg)](tests/zandance_router.test.ts)

---

## 💡 Initial Product Idea

**Zandance** is a privacy-preserving fee-abstraction router and gasless wallet designed specifically to unlock frictionless user adoption across the Midnight Network and general-purpose chains (Ethereum, Polygon, Cardano, Solana). Instead of forcing users to juggle distinct fee tokens and mental models, Zandance turns Midnight's unique DUST decay mechanic into a first-class liquidity pool—allowing users to pay for transactions with whatever token they already hold (e.g., USDC, USDT, ADA, SOL, ETH) while executing shielded zero-knowledge transfers that never leak wallet identities, source balances, or confidential intent payloads.

---

## 🏛️ Architecture & System Design

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       Zandance Wallet (Frontend)                        │
│     Chain-Agnostic UI · Balance Aggregator · Intent Composer · Lace     │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                        ┌────────────▼────────────┐
                        │  Fee Abstraction Router │
                        │  (ZK Witness Generator, │
                        │   Quotes fee, Builds    │
                        │   Signed Intent Hash)   │
                        └──────┬─────────────┬────┘
                               │             │
        ┌──────────────────────▼──┐   ┌──────▼───────────────────┐
        │  Midnight Adapter       │   │  EVM / Cardano / Solana  │
        │  - Compact Contract     │   │  Adapters                │
        │  - DUST Liquidity Pool  │   │  - ERC-4337 Paymasters   │
        │  - ZK Proof Verifier    │   │  - Cross-chain Relayers  │
        └─────────────────────────┘   └──────────────────────────┘
                               │             │
                        ┌──────▼─────────────▼────┐
                        │ Solver / Settlement     │
                        │ - Fronts gas on target  │
                        │ - Settles reimbursement │
                        │ - Enforces replay lock  │
                        └─────────────────────────┘
```

---

## 🔒 Midnight Privacy Model: Public State vs Private Witness

Midnight separates contract execution into two distinct cryptographic realms: **Public Ledger State** and **Off-Chain Private Witnesses**.

### 1. What an Observer Can Learn (Public Ledger State)
* `admin`: Public protocol operator address.
* `dustPoolReserve`: Total remaining DUST available in the sponsorship liquidity pool.
* `totalSponsoredTransactions`: Cumulative count of gasless transactions processed.
* `activeRelayers`: Mapping of verified relayer public keys authorized to front execution gas.
* `intentCommitments`: The Blake2b/Pedersen cryptographic `intentHash` and authorized maximum fee.
* `settledIntents`: Replay-protection boolean mapping to prevent double-spending.

### 2. What an Observer CANNOT Learn (Private Witnesses & Shielded State)
* **Sender Identity**: The user's secret key (`getSenderSecret()`) is evaluated strictly within client-side ZK circuits and never broadcast to the ledger.
* **Shielded Balances**: The contract verifies that `getShieldedBalance() >= maxFee` in zero knowledge without revealing the user's actual token balance.
* **Confidential Payload**: The recipient and data parameters inside `getIntentPayload()` are masked off-chain.

### 3. Deliberate Disclosure (`disclose()`)
In Midnight's Compact language, moving data from private witness memory to the public blockchain requires explicit use of the `disclose()` keyword. In Zandance:
```compact
// Deliberate disclosure: Only intentHash and maxFee are made public on-chain
intentCommitments.insert(disclose(intentHash), disclose(maxFee));
dustPoolReserve = dustPoolReserve - maxFee;
```

---

## 👁️ Observable Privacy Behavior Claim

> **Observable Claim**: A user can prove they are authorized by the protocol, hold sufficient private assets to reimburse a fee, and commit to a gasless route **WITHOUT** ever exposing their public key, private signing key, or asset holdings on the public Midnight ledger or cross-chain relay logs.

### Proof of Observable Invariant:
1. When `sponsorFeeIntent` is called, the ZK prover executes constraints on `getSenderSecret` and `getShieldedBalance`.
2. The generated SNARK proof verifies state transition validity.
3. Observers on Midnight Preprod only see an incremented counter and the blind `intentHash`, fulfilling complete transaction privacy.

---

## 🚀 Midnight Preprod Deployment Details

| Parameter | Preprod Testnet Value |
| :--- | :--- |
| **Contract Name** | `ZandanceRouter` |
| **Compiler Version** | `compactc v0.24.1-midnight` |
| **Preprod Contract Address** | `02c16f00430277712f9470c4b4cc5ed31f3c3e6dab6bb815d50c4a82cca607ec` |
| **Deployment Transaction** | `0x8a2a67e1505d4eccab980c9f6a80a62e88bc363e93a97f89c26f1af3ae3bf5e7` |
| **Initial Pool Reserve** | `1,000,000,000 DUST` |
| **Explorer Link** | [View on Midnight Preprod Explorer](https://preprod.midnight.network/contract/02c16f00430277712f9470c4b4cc5ed31f3c3e6dab6bb815d50c4a82cca607ec) |

---

## 🛠️ Local Setup & Execution Guide

### Prerequisites
* **Node.js**: v22.x or higher
* **Git**

### Installation
```bash
# 1. Clone repository
git clone https://github.com/zandance/zandance.git
cd zandance

# 2. Install dependencies
npm install
```

### 1. Compile Compact Smart Contract & Generate Circuits
```bash
npm run compact:compile
```
*Outputs generated ZKIR circuits and keys into `managed/`:*
* `managed/contract/contract_info.json`
* `managed/zkir/*.zkir` (7 compiled circuits)
* `managed/keys/*.prover` & `managed/keys/*.verifier`

### 2. Run Automated Test Suite (8+ Tests Passing)
```bash
npm test
```

### 3. Deploy to Midnight Preprod / Preview
```bash
npm run deploy:preprod
```

### 4. Start Local Development dApp
```bash
npm run dev
```
Open your browser at `http://localhost:3000` to interact with the Lace Wallet connector, Gasless Fee Router, and Zero-Knowledge Privacy Visualizer.

---

## 📋 Hackathon Submission Verification Matrix

### Level 1 — New Moon Submission Checklist
- [x] Toolchain installed & Compact contract compiles via `npm run compact:compile`
- [x] Passing test suite (`npm test` — 8 passing tests)
- [x] Generated `managed/` directory present (circuits + keys + contract metadata)
- [x] Contract deployed to Preprod with visible address (`02c16f00...07ec`)
- [x] Initial product idea (1 short paragraph) drafted in README
- [x] README section explaining Public State vs Private Witness & `disclose()`
- [x] Minimum 5+ meaningful commits

### Level 2 — Waxing Crescent Submission Checklist
- [x] Lace Midnight wallet connect / disconnect implemented
- [x] Circuit called successfully from frontend (`sponsorFeeIntent`)
- [x] Observable privacy behavior (proven without revealing private witness)
- [x] Contract deployed to Preprod with verifiable address
- [x] Live demo web application configured
- [x] Minimum 8+ meaningful commits

### Level 3 — Full Moon / Full dApp Submission Checklist
- [x] Fully functional dApp meaningfully using Midnight's privacy model
- [x] 8+ automated tests passing (minimum 3 required)
- [x] CI/CD pipeline running (`.github/workflows/ci.yml`)
- [x] README "privacy model" section: what an observer can and cannot learn
- [x] Minimum 10+ meaningful commits

---

## 📄 License
MIT License © 2026 Zandance Core Team
