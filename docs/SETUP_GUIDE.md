# 🛠️ Zandance — Complete Setup & Usage Guide

## Prerequisites

| Dependency | Version | Purpose |
| :--- | :--- | :--- |
| **Node.js** | v22.x | Runtime for scripts, tests, and dev server |
| **Git** | Latest | Version control |
| **Lace Wallet** | Latest (Chrome Extension) | Midnight DApp connector (optional for dev sandbox mode) |

---

## Installation

```bash
# Clone the repository
git clone https://github.com/omprajapatirk-source/Zandance.git
cd Zandance

# Install all dependencies
npm install
```

---

## Available Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Start local dev server on `http://localhost:3000` |
| `npm run compact:compile` | Compile Compact contract & generate managed/ artifacts |
| `npm test` | Run full Vitest test suite (11 tests) |
| `npm run build` | Build production bundle for deployment |
| `npm run deploy:preprod` | Deploy to Midnight Preprod network |
| `npm run preview` | Preview production build locally |

---

## Local Development Workflow

### 1. Compile Smart Contract Circuits

```bash
npm run compact:compile
```

This generates the following artifacts in `managed/`:

```
managed/
├── contract/
│   ├── contract_info.json   ← Contract metadata & ABI
│   ├── index.js             ← JavaScript runtime bindings
│   └── index.d.ts           ← TypeScript declarations
├── zkir/
│   ├── initialize.zkir
│   ├── sponsorFeeIntent.zkir  ← Core privacy circuit
│   └── ... (7 circuits total)
└── keys/
    ├── *.prover             ← 7 PLONK prover keys
    └── *.verifier           ← 7 PLONK verifier keys
```

### 2. Run Tests

```bash
npm test
```

Expected output: **11 passing tests** covering:
- Contract initialization & public ledger state
- `sponsorFeeIntent` ZK circuit execution with private witnesses
- Replay protection via nullifier settlement
- DUST pool deposits and exponential decay
- Cross-chain fee router price conversions
- 70 Preprod testnet user dataset validation
- Batch fee aggregation savings calculation

### 3. Start Development dApp

```bash
npm run dev
```

Navigate to `http://localhost:3000`. The app runs in **development sandbox mode** by default — no Lace wallet is required. A simulated DApp connector is auto-initialized.

### 4. Connect Lace Wallet (Production Mode)

Install the [Lace Wallet Chrome Extension](https://www.lace.io/) and ensure it is configured for **Midnight Preprod**. Once installed, clicking **"Connect Lace"** will call:

```typescript
const connector = await window.midnight?.enable?.('zandance');
```

---

## Environment Configuration

No `.env` file is required for local development. The app uses public Preprod endpoints.

For production deployment, `vercel.json` configures SPA rewrites automatically.

---

## Contract Architecture

The Zandance Compact smart contract (`contracts/zandance_router.compact`) implements:

- **Public Ledger State**: `dustPoolReserve`, `intentCommitments`, `settledIntents`, `totalSponsoredTransactions`
- **Private Witnesses** (never on-chain): `getSenderSecret()`, `getShieldedBalance()`, `getIntentPayload()`
- **Explicit Disclosure**: Only `intentHash` and `maxFee` are disclosed via `disclose()` to the public ledger

---

## Deployment

The contract is pre-deployed on **Midnight Preprod**:

```
Contract Address: c16f00430277712f9470c4b4cc5ed31f3c3e6dab6bb815d50c4a82cca607ec
Explorer: https://midnightexplorer.com/contract/c16f00...07ec
```

To re-deploy:

```bash
npm run deploy:preprod
```

---

## CI/CD Pipeline

GitHub Actions workflow runs automatically on every push to `main`:

1. Checkout code
2. Setup Node.js 22.x
3. `npm install --ignore-scripts`
4. `npm run compact:compile` — generates managed/ artifacts
5. Verify managed/ directory exists with all artifacts
6. `npm test` — run 11 automated tests
7. `npm run build` — build production bundle

See [.github/workflows/ci.yml](../.github/workflows/ci.yml) for details.
