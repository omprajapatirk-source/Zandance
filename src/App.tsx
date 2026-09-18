import React, { useState } from 'react';
import { WalletState, GaslessIntent, PoolStats } from './types';
import { LaceWalletModal } from './components/LaceWalletModal';
import { FeeRouter } from './components/FeeRouter';
import { PrivacyVisualizer } from './components/PrivacyVisualizer';
import { PoolManager } from './components/PoolManager';
import { ExplorerView } from './components/ExplorerView';
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

export function App() {
  const [activeTab, setActiveTab] = useState<'router' | 'privacy' | 'pool' | 'explorer'>('router');
  const [isLaceModalOpen, setIsLaceModalOpen] = useState(false);

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

  const handleIntentExecuted = (intent: GaslessIntent) => {
    setIntents((prev) => [intent, ...prev]);
    setLatestExecutedIntent(intent);
    setPoolStats((prev) => ({
      ...prev,
      reserveDust: prev.reserveDust - intent.dustEquivalent,
      totalSponsoredTxs: prev.totalSponsoredTxs + 1,
      totalDustSponsored: prev.totalDustSponsored + intent.dustEquivalent
    }));
  };

  const handleDepositDust = (amount: number) => {
    setPoolStats((prev) => ({
      ...prev,
      reserveDust: prev.reserveDust + amount
    }));
  };

  const handleSimulateDecay = (amount: number) => {
    setPoolStats((prev) => ({
      ...prev,
      reserveDust: Math.max(0, prev.reserveDust - amount),
      currentEpoch: prev.currentEpoch + 1
    }));
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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

      {/* Tab Panels */}
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

      {/* Lace Modal */}
      <LaceWalletModal
        isOpen={isLaceModalOpen}
        onClose={() => setIsLaceModalOpen(false)}
        wallet={wallet}
        onConnect={() => setWallet(w => ({ ...w, isConnected: true }))}
        onDisconnect={() => setWallet(w => ({ ...w, isConnected: false }))}
      />
    </div>
  );
}

export default App;
