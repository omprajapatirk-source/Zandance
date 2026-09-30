# 🎬 Zandance (Nyx) — MVP Demo Video & Interactive Walkthrough

> **Live App**: [https://zandance.vercel.app](https://zandance.vercel.app)  
> **Contract**: `c16f00430277712f9470c4b4cc5ed31f3c3e6dab6bb815d50c4a82cca607ec` on Midnight Preprod  
> **X Profile**: [@ZandanceFi](https://x.com/ZandanceFi)

---

## 📽️ Demo Video Walkthrough

The interactive demo video is embedded directly at the live Vercel deployment:

**🌐 [https://zandance.vercel.app](https://zandance.vercel.app)**

### Demo Script — Step by Step

#### Step 1: Connect Lace Midnight Wallet
- Navigate to [https://zandance.vercel.app](https://zandance.vercel.app)
- Click the **"Connect Lace"** button in the top-right CyberDock navigation bar
- The Lace DApp Connector API (`window.midnight`) is invoked via `@midnight-ntwrk/dapp-connector-api`
- If Lace is not installed, an informative error: `"Wallet Not Installed"` is displayed
- Upon connection, the shielded address and DUST balance are displayed in the header

#### Step 2: Select Multi-Chain Fee Route
- On the **Fee Router** tab, select your source token (USDC, USDT, ETH, or NIGHT)
- Select the target chain (Midnight Preprod, Ethereum, Polygon, Cardano, or Solana)
- Enter the transfer amount
- Real-time DUST equivalent quote is calculated and displayed

#### Step 3: Execute ZK Fee Intent (`sponsorFeeIntent`)
- Click **"Execute Gasless Route"**
- Client-side ZK witness is assembled (`getSenderSecret`, `getIntentPayload`, `getShieldedBalance`)
- The Compact circuit (`sponsorFeeIntent`) is called from the frontend
- A SNARK proof is generated in the browser WASM runtime
- Transaction submitted to Midnight Preprod
- Results display: `intentHash`, `txHash`, and `proofHex`

#### Step 4: Inspect Observable Privacy Guarantees
- Switch to the **Privacy** tab
- The **Dual Matrix Visualizer** shows:
  - 🔒 **LEFT (Off-Chain Private)**: `getSenderSecret()`, `getShieldedBalance()`, `getIntentPayload()` — MASKED
  - ⚡ **CENTER**: PLONK PROVE boundary
  - 👁️ **RIGHT (On-Chain Public)**: `intentHash`, `maxFee`, nullifier — VISIBLE on Preprod
- Switch to **ZKIR BYTECODE** to inspect the raw zero-knowledge circuit trace
- Switch to **COMPACT DISCLOSE()** to see the exact `disclose()` boundary in the contract

#### Step 5: View the Live Preprod Explorer
- Switch to the **Explorer** tab
- All 70 verified testnet users are listed with their public addresses, transaction hashes, and DUST amounts
- Search and filter by address, username, or token type
- Click any transaction to open it on the Midnight Preprod Explorer

---

## 🔑 Key Proof Points for Judges

| Requirement | Evidence |
| :--- | :--- |
| **Wallet Connect/Disconnect** | Lace DApp connector via `window.midnight` — live at [zandance.vercel.app](https://zandance.vercel.app) |
| **Circuit Called from Frontend** | `sponsorFeeIntent` circuit in `src/midnight.ts` — real witness isolation |
| **Observable Privacy Behavior** | Privacy tab Dual Matrix: private witnesses never touch the ledger |
| **Contract on Preprod** | `c16f00430277712f9470c4b4cc5ed31f3c3e6dab6bb815d50c4a82cca607ec` |
| **CI/CD Pipeline** | [.github/workflows/ci.yml](.github/workflows/ci.yml) with badge in README |
| **Product X Profile** | [@ZandanceFi](https://x.com/ZandanceFi) — linked in README header |
| **70 Preprod Users** | [docs/PREPROD_TESTNET_USERS_70.md](PREPROD_TESTNET_USERS_70.md) with tx hashes |
| **Feedback Loop** | [docs/FEEDBACK_LOOP_PHASE2.md](FEEDBACK_LOOP_PHASE2.md) — Phase 1 & Phase 2 |
| **30+ Commits** | 30+ meaningful conventional commits on `main` branch |

---

## 🛡️ Privacy Claim (Observable)

> A user can prove they are authorized and hold sufficient shielded assets to pay a fee **WITHOUT** ever exposing:
> - Their private signing key
> - Their real wallet balance  
> - The recipient address or payload of their transaction

**This is enforced by Midnight's `disclose()` primitive** — only explicitly disclosed values (`intentHash`, `maxFee`) appear on the public ledger. All other witness data stays in browser RAM.

---

## 📋 Submission Links

| Item | Link |
| :--- | :--- |
| GitHub Repository | [github.com/omprajapatirk-source/Zandance](https://github.com/omprajapatirk-source/Zandance) |
| Live Demo | [zandance.vercel.app](https://zandance.vercel.app) |
| Contract Address | `c16f00430277712f9470c4b4cc5ed31f3c3e6dab6bb815d50c4a82cca607ec` |
| X Profile | [@ZandanceFi](https://x.com/ZandanceFi) |
| CI/CD Badge | [![CI](https://github.com/omprajapatirk-source/Zandance/actions/workflows/ci.yml/badge.svg)](https://github.com/omprajapatirk-source/Zandance/actions) |
