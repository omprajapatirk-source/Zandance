import React, { useState, useCallback, useEffect } from 'react';
import { WalletState, GaslessIntent, PoolStats } from './types';
import { LaceWalletModal } from './components/LaceWalletModal';
import { FeeRouter } from './components/FeeRouter';
import { PrivacyVisualizer } from './components/PrivacyVisualizer';
import { PoolManager } from './components/PoolManager';
import { ExplorerView } from './components/ExplorerView';
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
  FileCheck
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
    isConnected: true, // Default connected for instant testing / demo
    address: '025c276e4ee2938b9ded19e9ae2e70181f97009f641b68bfe2f4ee6104ed0a5b',
    shieldedAddress: '0289fd103a74ef9081bcde541289ae301824ab8912efc4019a8234bc8912304f',
    nightBalance: 25000,
    dustBalance: 420000,
    tokenBalances: {
      USDC: 2450.50,
      USDT: 1200.00,
      ETH: 1.45,
      SOL: 18.2,
      ADA: 4500
    }
  });

  const [poolStats, setPoolStats] = useState<PoolStats>({
    reserveDust: 994750000,
    stakedNight: 500000,
    totalSponsoredTxs: 148,
    totalDustSponsored: 5250000,
    currentEpoch: 12,
    decayRatePerHour: 2.1,
    activeRelayers: 5
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
      txHash: '0x8a2a67e1505d4eccab980c9f6a80a62e88bc363e93a97f89c26f1af3ae3bf5e7'
    }
  ]);

  const [latestExecutedIntent, setLatestExecutedIntent] = useState<GaslessIntent | null>(intents[0]);

  const showToast = useCallback((message: string, detail: string) => {
    const id = 'toast_' + Date.now();
    setToasts(prev => [...prev, { id, message, detail, exiting: false }]);
    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
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
      totalDustSponsored: prev.totalDustSponsored + intent.dustEquivalent
    }));
    showToast(
      `✅ Gasless Transfer Settled!`,
      `${intent.amount} ${intent.asset} via ${intent.feeToken} fee — ${intent.dustEquivalent.toLocaleString()} DUST sponsored`
    );
  };

  const handleDepositDust = (amount: number) => {
    setPoolStats((prev) => ({
      ...prev,
      reserveDust: prev.reserveDust + amount
    }));
    showToast('💧 DUST Deposited', `+${amount.toLocaleString()} DUST added to the liquidity pool`);
  };

  const handleSimulateDecay = (amount: number) => {
    setPoolStats((prev) => ({
      ...prev,
      reserveDust: Math.max(0, prev.reserveDust - amount),
      currentEpoch: prev.currentEpoch + 1
    }));
    showToast('🔥 Epoch Decay Applied', `−${amount.toLocaleString()} DUST decayed · Epoch #${poolStats.currentEpoch + 1}`);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="logo-group">
          <div className="logo-badge">🌌</div>
          <div>
            <h1 className="logo-title">Zandance</h1>
            <div className="logo-tagline">One Wallet · Any Token · Zero Gas (Powered by Midnight)</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <a
            href="https://x.com/ZandanceFi"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', fontSize: '0.82rem', padding: '0.45rem 0.85rem' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span>@ZandanceFi</span>
          </a>

          <div className="network-badge">
            <span className="network-pulse" />
            <span>Midnight Preprod</span>
          </div>

          <button
            className={wallet.isConnected ? "btn-secondary" : "btn-primary"}
            onClick={() => setIsLaceModalOpen(true)}
            style={{ fontSize: '0.88rem' }}
          >
            <Key size={16} />
            {wallet.isConnected ? (
              <span>Lace: {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</span>
            ) : (
              <span>Connect Lace Wallet</span>
            )}
          </button>
        </div>
      </header>

      {/* Hero Stats */}
      <div className="stat-grid">
        <div className="glass-card stat-item">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
            <Zap size={24} />
          </div>
          <div>
            <div className="stat-value">70 Wallets</div>
            <div className="stat-label">Verified Preprod Users</div>
          </div>
        </div>

        <div className="glass-card stat-item">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <Droplets size={24} />
          </div>
          <div>
            <div className="stat-value">{poolStats.reserveDust.toLocaleString()}</div>
            <div className="stat-label">DUST Liquidity Reserve</div>
          </div>
        </div>

        <div className="glass-card stat-item">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(147, 51, 234, 0.15)', color: '#c084fc' }}>
            <Shield size={24} />
          </div>
          <div>
            <div className="stat-value">Zero-Knowledge</div>
            <div className="stat-label">Shielded Fee Witnesses</div>
          </div>
        </div>

        <div className="glass-card stat-item">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
            <Zap size={24} />
          </div>
          <div>
            <div className="stat-value">{poolStats.totalSponsoredTxs.toLocaleString()} Txs</div>
            <div className="stat-label">Cross-Chain Gasless Settled</div>
          </div>
        </div>

        <div className="glass-card stat-item">
          <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
            <Flame size={24} />
          </div>
          <div>
            <div className="stat-value">Epoch #{poolStats.currentEpoch}</div>
            <div className="stat-label">DUST Decay & Relayers</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-button ${activeTab === 'router' ? 'active' : ''}`}
          onClick={() => setActiveTab('router')}
        >
          <ArrowRightLeft size={18} />
          <span>Gasless Fee Router</span>
        </button>

        <button
          className={`tab-button ${activeTab === 'privacy' ? 'active' : ''}`}
          onClick={() => setActiveTab('privacy')}
        >
          <Shield size={18} />
          <span>Observable Privacy Visualizer</span>
        </button>

        <button
          className={`tab-button ${activeTab === 'pool' ? 'active' : ''}`}
          onClick={() => setActiveTab('pool')}
        >
          <Droplets size={18} />
          <span>DUST Liquidity Pool & Decay</span>
        </button>

        <button
          className={`tab-button ${activeTab === 'explorer' ? 'active' : ''}`}
          onClick={() => setActiveTab('explorer')}
        >
          <Layers size={18} />
          <span>Preprod Contract Explorer</span>
        </button>
      </div>

      {/* Tab Panels with transitions */}
      <div className="tab-panel" key={activeTab}>
        {activeTab === 'router' && (
          <FeeRouter
            wallet={wallet}
            onIntentExecuted={handleIntentExecuted}
          />
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
      </div>

      {/* Footer */}
      <footer className="footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🌌</span>
          <span>Zandance v1.0.0 — Built on Midnight Network</span>
        </div>
        <div className="footer-links">
          <a href="https://x.com/ZandanceFi" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#38bdf8' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span>@ZandanceFi</span>
          </a>
          <a href="https://github.com/omprajapatirk-source/Zandance" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            <span>GitHub</span>
          </a>
          <a href="https://preprod.midnight.network/contract/02c16f00430277712f9470c4b4cc5ed31f3c3e6dab6bb815d50c4a82cca607ec" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <ExternalLink size={14} />
            <span>Preprod Explorer</span>
          </a>
          <span>MIT © 2026</span>
        </div>
      </footer>

      {/* Lace Modal */}
      <LaceWalletModal
        isOpen={isLaceModalOpen}
        onClose={() => setIsLaceModalOpen(false)}
        wallet={wallet}
        onConnect={(walletInfo?: MidnightWalletInfo) => {
          if (walletInfo) {
            // Real wallet data from DApp connector
            setWallet(w => ({
              ...w,
              isConnected: true,
              address: walletInfo.address || w.address,
              shieldedAddress: walletInfo.shieldedAddress || w.shieldedAddress,
              dustBalance: walletInfo.balanceDust || w.dustBalance,
              nightBalance: walletInfo.balanceNight || w.nightBalance,
            }));
          } else {
            // Demo mode fallback
            setWallet(w => ({ ...w, isConnected: true }));
          }
        }}
        onDisconnect={() => setWallet(w => ({
          ...w,
          isConnected: false,
        }))}
      />

      {/* Toast Notifications */}
      {toasts.length > 0 && (
        <div className="toast-container">
          {toasts.map(toast => (
            <div key={toast.id} className={`toast ${toast.exiting ? 'exiting' : ''}`}>
              <div className="toast-header">
                <CheckCircle size={16} />
                <span>{toast.message}</span>
              </div>
              <div className="toast-body">{toast.detail}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
