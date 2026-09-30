"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { WalletState, GaslessIntent, PoolStats } from './types';
import { IntroLoadingScreen } from './components/IntroLoadingScreen';
import { SmartNavbar } from './components/SmartNavbar';
import { SlideInWalletPanel } from './components/SlideInWalletPanel';
import { StarfieldBackground } from './components/StarfieldBackground';
import { AnimatedStatCounter } from './components/AnimatedStatCounter';
import { LiveTransactionsFeed } from './components/LiveTransactionsFeed';
import { FeeRouter } from './components/FeeRouter';
import { PrivacyVisualizer } from './components/PrivacyVisualizer';
import { PoolManager } from './components/PoolManager';
import { ExplorerView } from './components/ExplorerView';
import { DeveloperCodeBlock } from './components/DeveloperCodeBlock';
import { MidnightExplorerModal } from './components/MidnightExplorerModal';
import { TransactionReceiptModal } from './components/TransactionReceiptModal';
import { GuidedTourModal } from './components/GuidedTourModal';
import { LiveSavingsTicker } from './components/LiveSavingsTicker';
import { LaceWalletModal } from './components/LaceWalletModal';
import IntegrationCardDemo from './components/ui/demo';
import {
  connectLaceWallet,
  disconnectLaceWallet,
  isLaceWalletInstalled,
  type MidnightWalletInfo
} from './midnight';
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
  Cpu,
  Sun,
  Moon,
  ArrowDown,
  Lock,
  Boxes,
  Compass,
  Coins,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface ToastNotification {
  id: string;
  message: string;
  detail: string;
  exiting: boolean;
}

interface PillarItem {
  id: string;
  title: string;
  category: string;
  tag: string;
  description: string;
  statLabel: string;
  statValue: string;
  icon: React.ReactNode;
  bgGradient: string;
}

const CORE_PILLARS: PillarItem[] = [
  {
    id: 'fee-abstraction',
    title: 'Fee Abstraction',
    category: 'ROUTING ENGINE',
    tag: '01 / CORE',
    description: 'Pay cross-chain gas fees in any token without holding native assets. Zandance converts intents into shielded Midnight commitments.',
    statLabel: 'GAS SAVINGS',
    statValue: '100% Zero Native',
    icon: <ArrowRightLeft size={18} className="text-cyan-400" />,
    bgGradient: 'bg-gradient-to-b from-cyan-950/40 via-slate-900/90 to-slate-900/95 hover:from-cyan-950/60'
  },
  {
    id: 'dust-sponsorship',
    title: 'DUST Sponsorship',
    category: 'LIQUIDITY POOL',
    tag: '02 / TOKENOMICS',
    description: 'Zero-cost transactions funded through pooled staking yields on Midnight. Staked NIGHT generates non-transferable DUST to front fees.',
    statLabel: 'POOL RESERVE',
    statValue: '994.75M DUST',
    icon: <Droplets size={18} className="text-emerald-400" />,
    bgGradient: 'bg-gradient-to-b from-emerald-950/40 via-slate-900/90 to-slate-900/95 hover:from-emerald-950/60'
  },
  {
    id: 'cross-chain',
    title: 'Cross-Chain Bridge',
    category: 'INTEROPERABILITY',
    tag: '03 / NETWORKS',
    description: 'Seamless liquidity routing between Polygon, Ethereum, Cardano, Solana & Midnight with verifiable cryptographic proofs.',
    statLabel: 'SUPPORTED CHAINS',
    statValue: '5 Major Chains',
    icon: <Layers size={18} className="text-purple-400" />,
    bgGradient: 'bg-gradient-to-b from-purple-950/40 via-slate-900/90 to-slate-900/95 hover:from-purple-950/60'
  },
  {
    id: 'zk-privacy',
    title: 'ZK-SNARK Privacy',
    category: 'CRYPTOGRAPHY',
    tag: '04 / ENCLAVE',
    description: 'Client-side PLONK proofs evaluate in browser RAM, ensuring zero leakage of sender addresses or account balances.',
    statLabel: 'PROOF TIME',
    statValue: '18ms PLONK',
    icon: <Shield size={18} className="text-blue-400" />,
    bgGradient: 'bg-gradient-to-b from-blue-950/40 via-slate-900/90 to-slate-900/95 hover:from-blue-950/60'
  },
  {
    id: 'developer-sdk',
    title: 'Developer SDK',
    category: 'DEVELOPERS',
    tag: '05 / TOOLING',
    description: 'Embed zero-gas fee abstraction into any dApp in 3 lines of TypeScript using lightweight Compact smart contract bindings.',
    statLabel: 'COMPILER',
    statValue: 'Compact v0.24',
    icon: <Code2 size={18} className="text-violet-400" />,
    bgGradient: 'bg-gradient-to-b from-violet-950/40 via-slate-900/90 to-slate-900/95 hover:from-violet-950/60'
  },
  {
    id: 'multi-token',
    title: 'Multi-Token Assets',
    category: 'ASSET SUITE',
    tag: '06 / TOKENS',
    description: 'Native fee support for USDC, USDT, ETH, NIGHT, and ADA with dynamic automated oracle conversion and slippage protection.',
    statLabel: 'ACTIVE PAIRS',
    statValue: '5 Core Assets',
    icon: <Coins size={18} className="text-teal-400" />,
    bgGradient: 'bg-gradient-to-b from-teal-950/40 via-slate-900/90 to-slate-900/95 hover:from-teal-950/60'
  }
];

const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Connect Wallet',
    tag: 'ONBOARDING',
    subtitle: 'Connect your Lace Midnight wallet or launch with instant testnet credentials.',
    detail: 'Secure keypair handshake with BLS12-381 / SECP256K1 cryptography.',
    badge: 'Lace & Preprod',
    bgGradient: 'bg-gradient-to-br from-cyan-950/40 via-slate-900/90 to-slate-900/95',
    accentColor: 'text-cyan-400',
    badgeStyle: 'bg-cyan-500/15 text-cyan-400'
  },
  {
    step: '02',
    title: 'Select Payment Token',
    tag: 'INTENT',
    subtitle: 'Pick any token in your balance: USDC, USDT, ETH, NIGHT, or ADA.',
    detail: 'Real-time DUST quote calculation gives instant deterministic fee preview.',
    badge: 'Fixed Rate',
    bgGradient: 'bg-gradient-to-br from-indigo-950/40 via-slate-900/90 to-slate-900/95',
    accentColor: 'text-indigo-400',
    badgeStyle: 'bg-indigo-500/15 text-indigo-400'
  },
  {
    step: '03',
    title: 'Sign Privately with ZK Proof',
    tag: 'PROVING',
    subtitle: 'Witness evaluation executed client-side in RAM inside Compact PLONK constraints.',
    detail: 'Discloses only the intent hash while protecting sender identity and balances.',
    badge: 'Client-side WASM',
    bgGradient: 'bg-gradient-to-br from-purple-950/40 via-slate-900/90 to-slate-900/95',
    accentColor: 'text-purple-400',
    badgeStyle: 'bg-purple-500/15 text-purple-400'
  },
  {
    step: '04',
    title: 'Sponsored & Settled',
    tag: 'BROADCAST',
    subtitle: 'Decentralized relayer sponsors transaction on Midnight Preprod at zero user gas cost.',
    detail: 'Transaction settles immediately with public verifiable proof on Preprod explorer.',
    badge: '$0.00 User Gas',
    bgGradient: 'bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-slate-900/95',
    accentColor: 'text-emerald-400',
    badgeStyle: 'bg-emerald-500/15 text-emerald-400'
  }
];

export function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('zandance_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'dark';
  });

  const [activeAppTab, setActiveAppTab] = useState<'router' | 'privacy' | 'pool' | 'explorer' | 'integrations'>('router');
  const [isWalletDrawerOpen, setIsWalletDrawerOpen] = useState(false);
  const [isLaceModalOpen, setIsLaceModalOpen] = useState(false);
  const [isExplorerModalOpen, setIsExplorerModalOpen] = useState(false);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [selectedReceiptIntent, setSelectedReceiptIntent] = useState<GaslessIntent | null>(null);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  useEffect(() => {
    localStorage.setItem('zandance_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      showToast(
        next === 'dark' ? '🌑 Dark Mode (OLED) Active' : '🌌 Light Mode (Aurora) Active',
        next === 'dark' ? 'Clean deep black monochrome theme enabled' : 'Vibrant cosmic aurora theme enabled'
      );
      return next;
    });
  };

  const [wallet, setWallet] = useState<WalletState>(() => {
    const isSavedConnected = typeof window !== 'undefined' && localStorage.getItem('zandance_wallet_connected') === 'true';
    return {
      isConnected: isSavedConnected,
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
    };
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

  const handleFaucet = (token: string, amount: number) => {
    setWallet((prev) => ({
      ...prev,
      tokenBalances: {
        ...prev.tokenBalances,
        [token]: (prev.tokenBalances[token as keyof typeof prev.tokenBalances] || 0) + amount,
      },
    }));
    showToast('🚰 Testnet Faucet Triggered', `+${amount} ${token} credited to wallet`);
  };

  const handleConnectWallet = async () => {
    if (isLaceWalletInstalled()) {
      try {
        showToast('Connecting Lace...', 'Opening authorization prompt in Lace extension...');
        const info = await connectLaceWallet();
        setWallet((prev) => ({
          ...prev,
          isConnected: true,
          address: info.address || prev.address,
          shieldedAddress: info.shieldedAddress || prev.shieldedAddress,
          dustBalance: info.balanceDust || prev.dustBalance,
          nightBalance: info.balanceNight || prev.nightBalance,
        }));
        if (typeof window !== 'undefined') {
          localStorage.setItem('zandance_wallet_connected', 'true');
        }
        showToast('⚡ Lace Extension Connected', `Active: ${info.address ? info.address.slice(0, 10) + '...' : 'Preprod Enclave'}`);
      } catch (err: any) {
        const msg = err?.message || '';
        if (
          msg.includes('USER_REJECTED') ||
          msg.toLowerCase().includes('reject') ||
          msg.toLowerCase().includes('cancel') ||
          msg.toLowerCase().includes('denied')
        ) {
          showToast('Connection Cancelled', 'Authorization was declined or closed in Lace.');
        } else {
          console.warn('[Zandance] Extension connect error:', err);
          setIsLaceModalOpen(true);
        }
      }
    } else {
      // Open the Lace Modal with installation instructions and testnet sandbox option
      setIsLaceModalOpen(true);
    }
  };

  const handleDisconnectWallet = async () => {
    try {
      await disconnectLaceWallet();
    } catch { /* silent */ }
    setWallet((prev) => ({ ...prev, isConnected: false }));
    if (typeof window !== 'undefined') {
      localStorage.removeItem('zandance_wallet_connected');
    }
    showToast('🔌 Wallet Disconnected', 'Disconnected from Lace session.');
  };

  const handleNavToTab = (tab: 'router' | 'privacy' | 'pool' | 'explorer' | 'integrations') => {
    setActiveAppTab(tab);
    const el = document.getElementById('fee-router');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={`relative min-h-screen ${theme === 'dark' ? 'dark bg-black' : 'bg-[#030712]'} text-foreground antialiased selection:bg-cyan-500 selection:text-black transition-colors duration-500`}>
      {/* 1. NYX CRESCENT INTRO LOADING SCREEN */}
      <IntroLoadingScreen />

      {/* 2. INTERACTIVE STARFIELD BACKGROUND (Aurora in Light mode, Pure Black in Dark mode) */}
      <StarfieldBackground isDark={theme === 'dark'} />

      {/* 3. SMART-HIDING FLOATING NAVBAR */}
      <SmartNavbar
        wallet={wallet}
        onOpenWallet={() => setIsWalletDrawerOpen(true)}
        onConnectWallet={handleConnectWallet}
        onOpenExplorer={() => setIsExplorerModalOpen(true)}
        onOpenTour={() => setIsTourModalOpen(true)}
        onSelectTab={handleNavToTab}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* 5. HERO SECTION WITH EDITORIAL TYPOGRAPHY */}
      <section className="relative pt-28 pb-12 sm:pt-36 sm:pb-16 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 text-xs font-mono text-muted-foreground mb-6 backdrop-blur-md shadow-md">
          <span className="size-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Cross-Chain Fee Abstraction &amp; Zero Gas DUST Sponsorship</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium font-syne tracking-tight text-foreground max-w-4xl leading-[1.1]">
          One Wallet. Any Token.{' '}
          <span className="font-medium bg-gradient-to-r from-foreground via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Zero Gas.
          </span>
        </h1>

        <p className="mt-4 text-xs sm:text-sm md:text-base font-space text-muted-foreground max-w-xl leading-relaxed">
          Zandance abstracts multi-chain transaction fees through Midnight’s zero-knowledge DUST sponsorship engine. Transact freely without native gas tokens.
        </p>

        {/* Live Animated Metrics Row (Rich Color Blocks) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 w-full max-w-4xl mt-8 text-left">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 via-slate-900/90 to-slate-900/95 shadow-xl backdrop-blur-md">
            <div className="text-[11px] font-mono text-muted-foreground uppercase">Gas Paid By User</div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-400 mt-1">
              $0.00 Gas
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">100% Sponsored</div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/60 via-slate-900/90 to-slate-900/95 shadow-xl backdrop-blur-md">
            <div className="text-[11px] font-mono text-muted-foreground uppercase">DUST Pool Reserve</div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-foreground mt-1">
              <AnimatedStatCounter value={poolStats.reserveDust} suffix=" DUST" />
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">Staked NIGHT Backed</div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900/90 to-slate-900/95 shadow-xl backdrop-blur-md">
            <div className="text-[11px] font-mono text-muted-foreground uppercase">ZK-SNARK Enclave</div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-cyan-400 mt-1">18ms PLONK</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">RAM Isolated Proofs</div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/60 via-slate-900/90 to-slate-900/95 shadow-xl backdrop-blur-md">
            <div className="text-[11px] font-mono text-muted-foreground uppercase">Verified Testnet Users</div>
            <div className="text-xl sm:text-2xl font-mono font-bold text-purple-400 mt-1">
              <AnimatedStatCounter value={70} suffix=" Wallets" />
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">Preprod Verified</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <button
            onClick={() => handleNavToTab('router')}
            className="px-6 py-2.5 rounded-full bg-foreground text-background font-medium text-xs sm:text-sm hover:opacity-90 transition-all shadow-lg cursor-pointer"
          >
            Launch Gasless Router
          </button>
          <button
            onClick={() => setIsTourModalOpen(true)}
            className="px-5 py-2.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-medium text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md"
          >
            <Sparkles size={14} />
            <span>Interactive Guided Demo</span>
          </button>
          <a
            href="#showcase"
            className="px-6 py-2.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-foreground text-xs sm:text-sm transition-all shadow-md"
          >
            Protocol Pillars
          </a>
        </div>
      </section>

      {/* LIVE PROTOCOL GAS SAVINGS TICKER */}
      <LiveSavingsTicker totalDustSponsored={poolStats.totalDustSponsored} totalTxs={poolStats.totalSponsoredTxs} />

      {/* 6. CORE PROTOCOL ARCHITECTURE GRID */}
      <section id="showcase" className="py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-white/[0.08]">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              ARCHITECTURE &amp; CAPABILITIES
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-syne tracking-tight text-white mt-1">
              Core Protocol Pillars
            </h2>
          </div>
          <p className="text-sm font-space text-slate-200 max-w-md mt-2 sm:mt-0 leading-relaxed">
            Privacy-preserving fee routing and DUST liquidity infrastructure on Midnight Network.
          </p>
        </div>

        {/* Clean 6-Card Rich Color Block Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {CORE_PILLARS.map((pillar) => (
            <div
              key={pillar.id}
              className={`p-6 sm:p-7 rounded-3xl ${pillar.bgGradient} backdrop-blur-2xl shadow-2xl transition-all duration-300 flex flex-col justify-between group`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-slate-950/80 group-hover:scale-105 transition-transform shadow-sm">
                    {pillar.icon}
                  </div>
                  <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-950/80 text-cyan-300 font-bold">
                    {pillar.tag}
                  </span>
                </div>

                <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold mb-1.5">
                  {pillar.category}
                </div>
                <h3 className="text-xl font-bold font-syne text-white tracking-tight mb-2.5">
                  {pillar.title}
                </h3>
                <p className="text-sm font-space text-slate-200 leading-relaxed mb-6">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-semibold">{pillar.statLabel}</span>
                <span className="font-bold text-white">{pillar.statValue}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. HOW IT WORKS 4-STEP PIPELINE */}
      <section id="how-it-works" className="py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-white/[0.08]">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold">
              EXECUTION PIPELINE
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-syne tracking-tight text-white mt-1">
              How Zero-Gas Routing Works
            </h2>
          </div>
          <p className="text-sm font-space text-slate-200 max-w-md mt-2 sm:mt-0 leading-relaxed">
            From client-side witness evaluation to decentralized relayer sponsorship in four simple steps.
          </p>
        </div>

        {/* Clean 4-Step Color Block Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <div
              key={step.step}
              className={`p-6 rounded-3xl ${step.bgGradient} backdrop-blur-2xl shadow-xl transition-all duration-300 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl font-mono font-bold text-white/50">
                    {step.step}
                  </span>
                  <span className={`text-xs font-mono px-3 py-1 rounded-full font-bold ${step.badgeStyle}`}>
                    {step.badge}
                  </span>
                </div>

                <div className="text-[11px] font-mono uppercase tracking-wider text-purple-300 font-bold mb-1.5">
                  {step.tag}
                </div>
                <h3 className="text-lg font-bold font-syne text-white tracking-tight mb-2">
                  {step.title}
                </h3>
                <p className="text-sm font-space text-slate-200 leading-relaxed mb-2.5">
                  {step.subtitle}
                </p>
                <p className="text-xs font-mono text-slate-300 leading-relaxed">
                  {step.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. INTERACTIVE APP PANEL (FEE ROUTER & ENCLAVE) */}
      <section id="fee-router" className="py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-3 border-b border-white/[0.06]">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              LIVE PREPROD APPARATUS
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-medium font-syne tracking-tight text-foreground mt-1">
              Interactive Protocol Console
            </h2>
          </div>

          {/* Module Selector Pill Switcher */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-slate-900/90 backdrop-blur-xl shadow-lg mt-4 sm:mt-0">
            <button
              onClick={() => setActiveAppTab('router')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                activeAppTab === 'router'
                  ? 'bg-foreground text-background font-semibold shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Fee Router
            </button>
            <button
              onClick={() => setActiveAppTab('privacy')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                activeAppTab === 'privacy'
                  ? 'bg-foreground text-background font-semibold shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Privacy Enclave
            </button>
            <button
              onClick={() => setActiveAppTab('pool')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                activeAppTab === 'pool'
                  ? 'bg-foreground text-background font-semibold shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              DUST Pool
            </button>
            <button
              onClick={() => setActiveAppTab('explorer')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                activeAppTab === 'explorer'
                  ? 'bg-foreground text-background font-semibold shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Activity Feed
            </button>
            <button
              onClick={() => setActiveAppTab('integrations')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                activeAppTab === 'integrations'
                  ? 'bg-foreground text-background font-semibold shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Integrations
            </button>
          </div>
        </div>

        {/* Tab Module Rendering */}
        <div className="w-full">
          {activeAppTab === 'router' && (
            <FeeRouter 
              wallet={wallet} 
              onIntentExecuted={handleIntentExecuted}
              onOpenReceipt={(intent) => setSelectedReceiptIntent(intent)}
            />
          )}

          {activeAppTab === 'privacy' && (
            <div id="privacy">
              <PrivacyVisualizer latestIntent={latestExecutedIntent} />
            </div>
          )}

          {activeAppTab === 'pool' && (
            <div id="pool">
              <PoolManager
                stats={poolStats}
                wallet={wallet}
                onDepositDust={handleDepositDust}
                onSimulateDecay={handleSimulateDecay}
              />
            </div>
          )}

          {activeAppTab === 'explorer' && (
            <div id="explorer">
              <ExplorerView intents={intents} onOpenExplorerModal={() => setIsExplorerModalOpen(true)} />
            </div>
          )}

          {activeAppTab === 'integrations' && (
            <div className="flex flex-col items-center justify-center w-full">
              <IntegrationCardDemo />
            </div>
          )}
        </div>
      </section>

      {/* 9. LIVE SPONSORED ACTIVITY FEED */}
      <section className="py-6 px-4 sm:px-8 max-w-7xl mx-auto">
        <LiveTransactionsFeed intents={intents} />
      </section>

      {/* 10. DEVELOPERS CODE SECTION */}
      <section id="developers" className="py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-3 border-b border-white/[0.08]">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              COMPACT CIRCUITS &amp; SDK
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-syne tracking-tight text-white mt-1">
              Build Zero-Gas Applications
            </h2>
          </div>
          <p className="text-sm font-space text-slate-200 max-w-md mt-2 sm:mt-0 leading-relaxed">
            Embed confidential witness verification and DUST sponsorship into any Web3 application.
          </p>
        </div>

        <DeveloperCodeBlock />
      </section>

      {/* 11. MAJESTIC BRAND LOGO & FOOTER */}
      <footer className="border-t border-white/[0.08] bg-black/60 backdrop-blur-xl py-14 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          {/* Prominent Logo Icon */}
          <a href="#" className="flex flex-col items-center gap-3.5 group mb-5">
            <div className="relative p-1 rounded-2xl bg-gradient-to-br from-cyan-400 via-purple-500 to-indigo-600 shadow-xl group-hover:scale-105 transition-transform duration-300">
              <img
                src="/zandance_logo.jpg"
                alt="Zandance Brand Logo"
                className="size-14 sm:size-16 rounded-xl object-cover"
              />
            </div>
            <div className="flex flex-col items-center">
              <span className="font-syne font-extrabold text-2xl sm:text-3xl tracking-tight text-white">
                ZANDANCE
              </span>
              <span className="text-sm font-space text-slate-300 mt-0.5">
                One Wallet · Any Token · Zero Gas
              </span>
            </div>
          </a>

          {/* Network Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/80 border border-white/[0.08] text-xs font-mono text-cyan-300 mb-6">
            <span className="size-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>Built on Midnight Network · Compact ZK Circuits</span>
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-mono text-slate-300 mb-6">
            <a href="#showcase" className="hover:text-white transition-colors">
              Pillars
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <a href="#fee-router" className="hover:text-white transition-colors">
              Fee Router
            </a>
            <a href="#pool" className="hover:text-white transition-colors">
              DUST Pool
            </a>
            <a href="#developers" className="hover:text-white transition-colors">
              Developers
            </a>
            <button
              onClick={() => setIsExplorerModalOpen(true)}
              className="hover:text-cyan-400 text-slate-300 transition-colors font-semibold"
            >
              Midnight Explorer
            </button>
            <a href="https://x.com/ZandanceFi" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition-colors font-semibold">
              X (Twitter)
            </a>
            <a href="https://github.com/omprajapatirk-source/Zandance" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              GitHub
            </a>
            <a href="https://zandance.vercel.app" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              Live Demo
            </a>
          </div>

          {/* Copyright & License */}
          <p className="text-xs font-space text-slate-400 max-w-md leading-relaxed border-t border-white/[0.08] pt-5 w-full">
            Zandance (Nyx) Protocol · Powered by Midnight Network Preprod Testnet · MIT License © 2026
          </p>
        </div>
      </footer>

      {/* 12. SLIDE-IN WALLET DRAWER PANEL */}
      <SlideInWalletPanel
        isOpen={isWalletDrawerOpen}
        onClose={() => setIsWalletDrawerOpen(false)}
        wallet={wallet}
        onConnect={handleConnectWallet}
        onDisconnect={handleDisconnectWallet}
        onFaucet={handleFaucet}
        onOpenExplorer={() => setIsExplorerModalOpen(true)}
      />

      {/* 12B. LACE EXTENSION CONNECTION & SANDBOX MODAL */}
      <LaceWalletModal
        isOpen={isLaceModalOpen}
        onClose={() => setIsLaceModalOpen(false)}
        wallet={wallet}
        onConnect={(walletInfo) => {
          if (walletInfo) {
            setWallet((prev) => ({
              ...prev,
              isConnected: true,
              address: walletInfo.address || prev.address,
              shieldedAddress: walletInfo.shieldedAddress || prev.shieldedAddress,
              dustBalance: walletInfo.balanceDust || prev.dustBalance,
              nightBalance: walletInfo.balanceNight || prev.nightBalance,
            }));
            if (typeof window !== 'undefined') {
              localStorage.setItem('zandance_wallet_connected', 'true');
            }
            showToast('⚡ Wallet Session Connected', `Address: ${walletInfo.address.slice(0, 10)}...`);
          }
        }}
        onDisconnect={handleDisconnectWallet}
      />

      {/* 13. DEDICATED MIDNIGHT PREPROD BLOCK EXPLORER MODAL */}
      <MidnightExplorerModal
        isOpen={isExplorerModalOpen}
        onClose={() => setIsExplorerModalOpen(false)}
        intents={intents}
      />

      {/* 14. INTERACTIVE GUIDED TOUR MODAL */}
      <GuidedTourModal
        isOpen={isTourModalOpen}
        onClose={() => setIsTourModalOpen(false)}
        onNavigateTab={(t) => setActiveAppTab(t)}
        onOpenExplorerModal={() => setIsExplorerModalOpen(true)}
      />

      {/* 15. TRANSACTION RECEIPT & SOCIAL PROOF MODAL */}
      <TransactionReceiptModal
        intent={selectedReceiptIntent}
        isOpen={!!selectedReceiptIntent}
        onClose={() => setSelectedReceiptIntent(null)}
        onOpenExplorer={() => setIsExplorerModalOpen(true)}
      />

      {/* 13. MINIMAL TOAST NOTIFICATIONS */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-xl border border-border bg-card/95 text-foreground backdrop-blur-xl shadow-xl flex items-start gap-3 pointer-events-auto transition-all duration-300 ${
              toast.exiting ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
            }`}
          >
            <Sparkles size={16} className="text-cyan-400 mt-0.5 shrink-0" />
            <div>
              <div className="text-xs font-semibold font-syne">{toast.message}</div>
              <div className="text-[11px] font-mono text-muted-foreground mt-0.5">{toast.detail}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
