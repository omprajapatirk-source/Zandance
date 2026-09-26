# 🌌 Zandance (Nyx) — One Wallet, Any Token, Zero Gas

> **Cross-Chain Fee Abstraction & Privacy-Preserving DUST Sponsorship on Midnight Network**

[![CI/CD Pipeline](https://github.com/omprajapatirk-source/Zandance/actions/workflows/ci.yml/badge.svg)](https://github.com/omprajapatirk-source/Zandance/actions)
[![Midnight Network](https://img.shields.io/badge/Midnight-Preprod%20Verified-7928ca.svg)](https://preprod.midnight.network/contract/02c16f00430277712f9470c4b4cc5ed31f3c3e6dab6bb815d50c4a82cca607ec)
[![Official X](https://img.shields.io/badge/X%20(Twitter)-%40ZandanceFi-000000.svg?logo=x)](https://x.com/ZandanceFi)
[![Language](https://img.shields.io/badge/Smart%20Contracts-Compact%20v0.24-0070f3.svg)](https://docs.midnight.network)
[![Tests](https://img.shields.io/badge/Tests-11%20Passed-10b981.svg)](tests/zandance_router.test.ts)
[![Preprod Users](https://img.shields.io/badge/Preprod%20Users-70%20Verified-0ea5e9.svg)](docs/PREPROD_TESTNET_USERS_70.md)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-zandance.vercel.app-38bdf8.svg)](https://zandance.vercel.app)

> 🌐 **Live Demo**: [https://zandance.vercel.app](https://zandance.vercel.app) | 🐦 **X (Twitter)**: [@ZandanceFi](https://x.com/ZandanceFi) | 📄 **Proposal**: [PROPOSAL.md](PROPOSAL.md) | 📜 **Whitepaper**: [docs/WHITEPAPER.md](docs/WHITEPAPER.md)

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

> 📡 **Deployed Live Demo**: [https://zandance.vercel.app](https://zandance.vercel.app)

---

## 📋 Hackathon Submission Verification Matrix

### Level 1 — New Moon Submission Checklist
- [x] Toolchain installed & Compact contract compiles via `npm run compact:compile`
- [x] Passing test suite (`npm test` — 11 passing tests)
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
- [x] 11 automated tests passing (minimum 3 required)
- [x] CI/CD pipeline running (`.github/workflows/ci.yml`)
- [x] README "privacy model" section: what an observer can and cannot learn
- [x] Minimum 10+ meaningful commits

### Level 4 — Gibbous Moon Submission Checklist
- [x] **Working MVP live on Preprod (verifiable address)**: `02c16f00430277712f9470c4b4cc5ed31f3c3e6dab6bb815d50c4a82cca607ec`
- [x] **Documentation**: Complete [README.md](README.md), local setup, architecture diagrams, and privacy model
- [x] **CI/CD Pipeline**: Multi-stage automated workflow running on GitHub Actions ([.github/workflows/ci.yml](.github/workflows/ci.yml))
- [x] **Product X Profile**: Official [@ZandanceFi](https://x.com/ZandanceFi) profile created and linked across all headers & footers
- [x] **Meaningful Commits**: Minimum 15+ conventional commits on GitHub

### Level 5 — Disseminating Moon Submission Checklist
- [x] **Extended MVP**: Multi-token dynamic fee routing, Lace wallet state sync, and real-time Preprod explorer ledger
- [x] **50 Preprod Users**: Verifiable registry with transaction hashes, shielded addresses, and proof logs in [docs/PREPROD_TESTNET_USERS_50.md](docs/PREPROD_TESTNET_USERS_50.md) & [src/data/preprodUsers.json](src/data/preprodUsers.json)
- [x] **Feedback Loop Documented**: Phase 1 user testing report, NPS metrics, and UX iterations in [docs/FEEDBACK_LOOP_PHASE1.md](docs/FEEDBACK_LOOP_PHASE1.md)
- [x] **Updated Documentation**: Full protocol documentation suite and test guides
- [x] **Meaningful Commits**: Minimum 20+ conventional commits on GitHub

### Level 6 — Full Moon Master Submission Checklist
- [x] **Extended MVP Architecture**: ZKIR audit inspector, batch fee intent aggregation, and exponential DUST decay simulator
- [x] **70 Preprod Users**: Full 70-user testnet cohort with on-chain verification logs in [docs/PREPROD_TESTNET_USERS_70.md](docs/PREPROD_TESTNET_USERS_70.md)
- [x] **Feedback Loop Synthesis**: Phase 2 telemetry, long-term roadmap, and feature matrix in [docs/FEEDBACK_LOOP_PHASE2.md](docs/FEEDBACK_LOOP_PHASE2.md)
- [x] **Master Documentation Suite**:
  - 📜 [Technical Whitepaper & Specification](docs/WHITEPAPER.md)
  - 🛡️ [Security, Privacy & Cryptographic Audit](docs/SECURITY_AUDIT.md)
  - 📄 [Product Proposal & Mainnet Plan](PROPOSAL.md)
- [x] **Meaningful Commits**: 20+ conventional commits on GitHub

### Product Idea Submission
- [x] [PROPOSAL.md](PROPOSAL.md) — Product idea, target users, why Midnight, privacy data model, and Mainnet feasibility

---

## 📄 License
MIT License © 2026 Zandance Core Team
