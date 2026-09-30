# Changelog — Zandance (Nyx)

All notable changes are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) with [Conventional Commits](https://conventionalcommits.org/).

---

## [1.0.0] — 2026-09-27 (Hackathon Final Submission)

### Added — Level 6 Completion
- `docs/DEMO_VIDEO.md`: Full step-by-step demo walkthrough for judges with submission proof table
- `docs/SETUP_GUIDE.md`: Comprehensive setup, usage, and architecture guide
- Hardened CI/CD pipeline with rich GitHub Actions step summary and build artifact verification
- Updated `deployment.json` with compiler version, circuit list, and all submission links
- 30+ meaningful conventional commits with full coverage across all 6 hackathon levels

### Fixed
- CI pipeline: Use `npm install --ignore-scripts --legacy-peer-deps` and direct node invocations for maximum compatibility on Ubuntu GitHub Actions runner
- README: Corrected GitHub clone URL to `omprajapatirk-source/Zandance`
- Level 6 checklist: Updated commit count to 30+ (was listed as 20+)

---

## [0.9.0] — 2026-09-26

### Added — Level 5 & 6 Submission
- 70-user testnet ledger and verified registry (`docs/PREPROD_TESTNET_USERS_70.md`)
- Phase 2 feedback loop and telemetry report (`docs/FEEDBACK_LOOP_PHASE2.md`)
- ZKIR audit inspector UI in Privacy tab
- Batch fee intent aggregation engine
- Exponential DUST decay pool simulator
- Technical whitepaper and cryptographic security audit

---

## [0.8.0] — 2026-09-25

### Added — Level 4 Submission
- Product X Profile: [@ZandanceFi](https://x.com/ZandanceFi)
- Level 4-6 submission checklists in README
- CI/CD badge linked in README header
- Complete setup and usage documentation

---

## [0.7.0] — 2026-09-25

### Fixed — Level 2 Critical Requirements
- Real Midnight SDK integration: `@midnight-ntwrk/dapp-connector-api`, `@midnight-ntwrk/compact-runtime`
- Lace wallet connect/disconnect via `window.midnight` with error handling for "Wallet Not Installed" and "User Rejected"
- `FeeRouter.tsx`: Real `sponsorFeeIntent` circuit call with genuine witness isolation (no mocks)
- Vite config: Added `vite-plugin-wasm` and `vite-plugin-node-polyfills` for WASM compatibility

---

## [0.6.0] — 2026-09-24

### Added — Level 3 Full dApp
- 50-user testnet registry (`docs/PREPROD_TESTNET_USERS_50.md`)
- Phase 1 feedback loop documentation (`docs/FEEDBACK_LOOP_PHASE1.md`)
- 11 automated Vitest tests (all passing)
- Multi-stage GitHub Actions CI/CD workflow

---

## [0.5.0] — 2026-09-23

### Added — Level 2 dApp Foundation
- Complete cyberpunk Awwwards-quality redesign with 3D cards, canvas constellation, custom cursor
- Glowing cosmic keyframe animations and micro-interactions
- Observable Privacy Visualizer with Dual Matrix view, ZKIR bytecode, and Compact spec

---

## [0.4.0] — 2026-09-22

### Added — Core Feature Set
- Midnight DApp connector integration and Lace wallet modal
- DUST Liquidity Pool manager and decay engine
- Multi-token fee abstraction router and intent composer
- Preprod contract explorer with search and filter

---

## [0.3.0] — 2026-09-21

### Added — Smart Contract Core
- Compact contract: `sponsorFeeIntent`, `claimReimbursement`, `applyDustDecay`, `depositDustReserve`
- Compact compiler script generating all managed/ artifacts
- Midnight Preprod deployment automation

---

## [0.2.0] — 2026-09-20

### Added — ZK Test Suite
- Comprehensive zero-knowledge test suite for all circuits
- Observable Privacy Visualizer and ZK inspector tab

---

## [0.1.0] — 2026-09-19

### Added — Project Foundation
- Initial project configuration, package setup
- Modern cyber-glassmorphism design system and CSS
- Basic Lace wallet connector and modal
