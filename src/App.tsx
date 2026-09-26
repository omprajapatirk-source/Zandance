import React, { useState, useCallback, useEffect } from 'react';
import { WalletState, GaslessIntent, PoolStats } from './types';
import { LaceWalletModal } from './components/LaceWalletModal';
import { FeeRouter } from './components/FeeRouter';
import { PrivacyVisualizer } from './components/PrivacyVisualizer';
import { PoolManager } from './components/PoolManager';
import { ExplorerView } from './components/ExplorerView';
import { CyberCanvasBackground } from './components/CyberCanvasBackground';
import { CyberCursor } from './components/CyberCursor';
import { CyberTicker } from './components/CyberTicker';
import { CyberDock } from './components/CyberDock';
import type { MidnightWalletInfo } from './midnight';
import {
  Shield,
  Zap,
  Droplets,
  Layers,
  ArrowRightLeft,
  Key,
  Flame,
  CheckCircle,
  ExternalLink,
  Code2,
  FileCheck,
  Radio,
  Sparkles,
  Users,
  Cpu
} from 'lucide-react';

interface ToastNotification {
  id: string;
  message: string;
  detail: string;
  exiting: boolean;
}

export function App() {
  const [activeTab, setActiveTab] = useState<'router' | 'privacy' | 'pool' | 'explorer'>('router');
  const [isLaceModalOpen, setIsLaceModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const [wallet, setWallet] = useState<WalletState>({
    isConnected: true, // Default connected for immediate testnet demo
    address: '025c276e4ee2938b9ded19e9ae2e70181f97009f641b68bfe2f4ee6104ed0a5b',
    shieldedAddress: '0289fd103a74ef9081bcde541289ae301824ab8912efc4019a8234bc8912304f',
    nightBalance: 25000,
    dustBalance: 420000,
    tokenBalances: {
      USDC: 2450.50,
      USDT: 1200.00,
      ETH: 1.45,
      SOL: 18.2,
      ADA: 4500,
    },
  });

  const [poolStats, setPoolStats] = useState<PoolStats>({
    reserveDust: 994750000,
    stakedNight: 500000,
    totalSponsoredTxs: 148,
    totalDustSponsored: 5250000,
    currentEpoch: 12,
    decayRatePerHour: 2.1,
    activeRelayers: 14,
  });

  const [intents, setIntents] = useState<GaslessIntent[]>([
    {
      id: 'int_init_1',
      sourceChain: 'polygon',
      targetChain: 'midnight-preprod',
      asset: 'USDC',
      amount: 250,
      feeToken: 'USDC',
      quotedFee: 1.40,
      dustEquivalent: 35000,
      intentHash: '0x9a8f4c2e5b7190d3a6c8e54721bf901ea2b4c810d7e635ab921c459e0a12f384',
      status: 'settled',
      timestamp: Date.now() - 360000,
      txHash: '0x8a2a67e1505d4eccab980c9f6a80a62e88bc363e93a97f89c26f1af3ae3bf5e7',
    },
  ]);

  const [latestExecutedIntent, setLatestExecutedIntent] = useState<GaslessIntent | null>(intents[0]);

  const showToast = useCallback((message: string, detail: string) => {
    const id = 'toast_' + Date.now();
    setToasts((prev) => [...prev, { id, message, detail, exiting: false }]);
    setTimeout(() => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 300);
    }, 4000);
  }, []);

  const handleIntentExecuted = (intent: GaslessIntent) => {
    setIntents((prev) => [intent, ...prev]);
    setLatestExecutedIntent(intent);
    setPoolStats((prev) => ({
      ...prev,
      reserveDust: prev.reserveDust - intent.dustEquivalent,
      totalSponsoredTxs: prev.totalSponsoredTxs + 1,
      totalDustSponsored: prev.totalDustSponsored + intent.dustEquivalent,
    }));
    showToast(
      `⚡ Gasless Transfer Settled!`,
      `${intent.amount} ${intent.asset} · ${intent.dustEquivalent.toLocaleString()} DUST sponsored on Midnight Preprod`
    );
  };

  const handleDepositDust = (amount: number) => {
    setPoolStats((prev) => ({
      ...prev,
      reserveDust: prev.reserveDust + amount,
    }));
    showToast('💧 DUST Deposited', `+${amount.toLocaleString()} DUST added to liquidity pool`);
  };

  const handleSimulateDecay = (amount: number) => {
    setPoolStats((prev) => ({
      ...prev,
      reserveDust: Math.max(0, prev.reserveDust - amount),
      currentEpoch: prev.currentEpoch + 1,
    }));
    showToast('🔥 Epoch Decay Applied', `−${amount.toLocaleString()} DUST decayed · Epoch #${poolStats.currentEpoch + 1}`);
  };

  return (
    <div className="cyber-root-shell">
      {/* Interactive Canvas Constellation Background */}
      <CyberCanvasBackground />

      {/* Custom Cyber Interactive Cursor */}
      <CyberCursor />

      {/* Top Cyber Telemetry Ticker */}
      <CyberTicker />

      <div className="app-container">
        {/* Main Header Navbar */}
        <header className="header">
          <div className="logo-group">
            <div className="logo-badge-cyber">
              <span className="logo-symbol">🌌</span>
              <div className="logo-halo-ring" />
            </div>
            <div>
              <div className="logo-title-row">
                <h1 className="logo-title font-syne">ZANDANCE</h1>
                <span className="version-tag font-mono text-lime">v1.0.0-PROD</span>
              </div>
              <div className="logo-tagline font-space">
                Zero-Gas Fee Abstraction · Powered by Midnight Network
              </div>
            </div>
          </div>

          <div className="header-actions-flex">
            <a
              href="https://x.com/ZandanceFi"
              target="_blank"
              rel="noreferrer"
              className="cyber-social-link"
              title="Official X Handle"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>@ZandanceFi</span>
            </a>

            <div className="preprod-status-chip">
              <span className="pulse-beacon-green" />
              <span className="font-mono">PREPROD LIVE</span>
            </div>

            <button
              className={`cyber-wallet-btn ${wallet.isConnected ? 'connected' : ''}`}
              onClick={() => setIsLaceModalOpen(true)}
            >
              <Key size={15} />
              {wallet.isConnected ? (
                <span className="font-mono">
                  LACE: {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                </span>
              ) : (
                <span>CONNECT LACE</span>
              )}
            </button>
          </div>
        </header>

        {/* Hero Cyber Statistics Row */}
        <section className="cyber-hero-stats-row">
          <div className="stat-card-cyber">
            <div className="stat-icon-halo neon-cyan-border">
              <Users size={20} className="neon-cyan" />
            </div>
            <div>
              <div className="stat-num font-mono neon-cyan">70 WALLETS</div>
              <div className="stat-sub font-space">Verified Preprod Users</div>
            </div>
          </div>

          <div className="stat-card-cyber">
            <div className="stat-icon-halo neon-lime-border">
              <Droplets size={20} className="neon-lime" />
            </div>
            <div>
              <div className="stat-num font-mono neon-lime">{poolStats.reserveDust.toLocaleString()}</div>
              <div className="stat-sub font-space">DUST Pool Reserve</div>
            </div>
          </div>

          <div className="stat-card-cyber">
            <div className="stat-icon-halo neon-purple-border">
              <Shield size={20} className="neon-purple" />
            </div>
            <div>
              <div className="stat-num font-mono neon-purple">ZERO-KNOWLEDGE</div>
              <div className="stat-sub font-space">Witness Isolation Enclave</div>
            </div>
          </div>

          <div className="stat-card-cyber">
            <div className="stat-icon-halo neon-magenta-border">
              <Zap size={20} className="neon-magenta" />
            </div>
            <div>
              <div className="stat-num font-mono neon-magenta">{poolStats.totalSponsoredTxs} TXS</div>
              <div className="stat-sub font-space">100% Gasless Sponsored</div>
            </div>
          </div>
        </section>

        {/* Futuristic Floating Dock / Tab Navigation */}
        <CyberDock activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Tab Panels */}
        <main className="main-content-area">
          {activeTab === 'router' && (
            <FeeRouter wallet={wallet} onIntentExecuted={handleIntentExecuted} />
          )}

          {activeTab === 'privacy' && (
            <PrivacyVisualizer latestIntent={latestExecutedIntent} />
          )}

          {activeTab === 'pool' && (
            <PoolManager
              stats={poolStats}
              wallet={wallet}
              onDepositDust={handleDepositDust}
              onSimulateDecay={handleSimulateDecay}
            />
          )}

          {activeTab === 'explorer' && (
            <ExplorerView intents={intents} />
          )}
        </main>

        {/* Cyberpunk Footer */}
        <footer className="cyber-footer">
          <div className="footer-left font-space">
            <span className="neon-symbol">🌌</span>
            <span>ZANDANCE PROTOCOL · POWERED BY MIDNIGHT NETWORK &amp; COMPACT</span>
          </div>

          <div className="footer-links-grid font-mono text-xs">
            <a href="https://x.com/ZandanceFi" target="_blank" rel="noreferrer" className="footer-link neon-cyan">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>@ZandanceFi</span>
            </a>

            <a href="https://github.com/omprajapatirk-source/Zandance" target="_blank" rel="noreferrer" className="footer-link">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              <span>GitHub</span>
            </a>

            <a href="https://preprod.midnight.network/contract/02c16f00430277712f9470c4b4cc5ed31f3c3e6dab6bb815d50c4a82cca607ec" target="_blank" rel="noreferrer" className="footer-link neon-lime">
              <ExternalLink size={13} />
              <span>Preprod Explorer</span>
            </a>

            <span className="text-muted">MIT © 2026</span>
          </div>
        </footer>

        {/* Lace Wallet Modal */}
        <LaceWalletModal
          isOpen={isLaceModalOpen}
          onClose={() => setIsLaceModalOpen(false)}
          wallet={wallet}
          onConnect={(walletInfo?: MidnightWalletInfo) => {
            if (walletInfo) {
              setWallet({
                isConnected: true,
                address: walletInfo.address,
                shieldedAddress: walletInfo.shieldedAddress,
                nightBalance: walletInfo.balanceNight,
                dustBalance: walletInfo.balanceDust,
                tokenBalances: wallet.tokenBalances,
              });
              showToast('⚡ Lace Wallet Connected', `Address: ${walletInfo.address.slice(0, 10)}... (Preprod)`);
            } else {
              setWallet((prev) => ({ ...prev, isConnected: true }));
              showToast('⚡ Lace Wallet Connected (Sim)', `Address: ${wallet.address.slice(0, 10)}...`);
            }
          }}
          onDisconnect={() => {
            setWallet((prev) => ({ ...prev, isConnected: false }));
            showToast('🔌 Wallet Disconnected', 'Disconnected from Lace');
          }}
        />

        {/* Cyberpunk Toast Notifications */}
        <div className="cyber-toast-container">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`cyber-toast ${toast.exiting ? 'exiting' : ''}`}
            >
              <div className="toast-glow-bar" />
              <div className="toast-content">
                <div className="toast-title font-syne">{toast.message}</div>
                <div className="toast-detail font-mono text-xs text-muted">{toast.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;

