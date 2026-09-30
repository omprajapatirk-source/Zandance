"use client";

import React, { useState } from 'react';
import { WalletState, GaslessIntent } from '../types';
import {
  ArrowRightLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Cpu,
  ExternalLink,
  Copy,
  Check,
  Lock,
  Zap,
  Radio,
  Sliders,
  Terminal,
  ChevronRight,
  ChevronDown,
  Search
} from 'lucide-react';
import { callSponsorFeeIntent, type CircuitCallResult } from '../midnight';
import { GenerateButton } from './GenerateButton';
import { SearchableTokenSelector, TokenOption } from './SearchableTokenSelector';
import { CrossChainRouteMap } from './CrossChainRouteMap';

interface FeeRouterProps {
  wallet: WalletState;
  onIntentExecuted: (intent: GaslessIntent) => void;
  onOpenReceipt?: (intent: GaslessIntent) => void;
}

const SUPPORTED_CHAINS = [
  { id: 'polygon', name: 'Polygon PoS', icon: '🟣', badge: 'EVM' },
  { id: 'ethereum', name: 'Ethereum Sepolia', icon: '🔷', badge: 'EVM' },
  { id: 'cardano', name: 'Cardano Preprod', icon: '🔵', badge: 'UTXO' },
  { id: 'midnight-preprod', name: 'Midnight Preprod', icon: '🌌', badge: 'ZK SHIELDED' },
  { id: 'solana', name: 'Solana Devnet', icon: '🟣', badge: 'SVM' }
];

const FEE_TOKENS: TokenOption[] = [
  { symbol: 'USDC', name: 'USD Coin', rate: 25000, icon: '💵', color: '#00f0ff', balance: 2450.50 },
  { symbol: 'USDT', name: 'Tether USD', rate: 25000, icon: '💲', color: '#10b981', balance: 1200.00 },
  { symbol: 'ETH', name: 'Ether', rate: 75000000, icon: '🔷', color: '#6366f1', balance: 1.45 },
  { symbol: 'NIGHT', name: 'Midnight NIGHT', rate: 7000, icon: '🌌', color: '#9d4edd', balance: 25000 },
  { symbol: 'ADA', name: 'Cardano ADA', rate: 18000, icon: '🔵', color: '#38bdf8', balance: 4500 }
];

const PROOF_STEPS = [
  { label: 'Witness Generation [getSenderSecret & getShieldedBalance]', detail: 'RAM enclave isolation', icon: <Lock size={14} /> },
  { label: 'PLONK SNARK Proof [sponsorFeeIntent.zkir]', detail: '18ms constraint verification', icon: <Cpu size={14} /> },
  { label: 'Relayer Sponsorship & Preprod Ledger Broadcast', detail: 'Zero gas broadcast', icon: <Zap size={14} /> }
];

export const FeeRouter: React.FC<FeeRouterProps> = ({ wallet, onIntentExecuted, onOpenReceipt }) => {
  const [sourceChain, setSourceChain] = useState('polygon');
  const [targetChain, setTargetChain] = useState('midnight-preprod');
  const [transferAmount, setTransferAmount] = useState('150');
  const [selectedFeeToken, setSelectedFeeToken] = useState('USDC');
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [recipient, setRecipient] = useState('0279fa9329e4bf18e907a0c84b5c77e382098b1a8ef8325da78a9c1e0892c');
  const [status, setStatus] = useState<'idle' | 'step0' | 'step1' | 'step2' | 'success' | 'error'>('idle');
  const [latestTx, setLatestTx] = useState<GaslessIntent | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [circuitError, setCircuitError] = useState<string | null>(null);

  const currentFeeConfig = FEE_TOKENS.find((t) => t.symbol === selectedFeeToken) || FEE_TOKENS[0];
  const requiredDust = 35000;
  const quotedTokenFee = (requiredDust / currentFeeConfig.rate).toFixed(4);
  const isProcessing = status === 'step0' || status === 'step1' || status === 'step2';

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch { /* silent */ }
  };

  const handleExecute = async () => {
    if (!wallet.isConnected) {
      alert('Please connect your Lace Midnight wallet first.');
      return;
    }

    setCircuitError(null);
    setStatus('step0');

    // Assemble off-chain private witnesses
    const senderSecret = wallet.shieldedAddress || wallet.address;
    const intentPayload = JSON.stringify({
      sourceChain,
      targetChain,
      asset: 'USDC',
      amount: parseFloat(transferAmount) || 10,
      recipient,
      feeToken: selectedFeeToken,
      nonce: Date.now(),
    });
    const shieldedBalance = BigInt(wallet.dustBalance || 1000000);
    const maxFee = BigInt(requiredDust);

    await new Promise((resolve) => setTimeout(resolve, 300));
    setStatus('step1');

    // Execute compiled Compact circuit runtime with client-side witness evaluation
    let circuitResult: CircuitCallResult;
    try {
      circuitResult = await callSponsorFeeIntent({
        senderSecret,
        intentPayload,
        shieldedBalance,
        maxFee,
      });
    } catch (err: any) {
      console.error('[FeeRouter] Compact circuit execution failed:', err);
      setCircuitError(err?.message || 'Compact circuit execution failed');
      setStatus('error');
      return;
    }

    setStatus('step2');
    await new Promise((resolve) => setTimeout(resolve, 400));

    const intentRecord: GaslessIntent = {
      id: `intent_${Date.now()}`,
      sourceChain,
      targetChain,
      asset: 'USDC',
      amount: parseFloat(transferAmount) || 10,
      feeToken: selectedFeeToken,
      quotedFee: parseFloat(quotedTokenFee),
      dustEquivalent: requiredDust,
      status: 'settled',
      intentHash: circuitResult.intentHash,
      txHash: circuitResult.txHash,
      proofHex: circuitResult.proofHex,
      timestamp: Date.now(),
    };

    setLatestTx(intentRecord);
    setStatus('success');
    onIntentExecuted(intentRecord);
  };

  const buttonStatus: 'idle' | 'loading' | 'success' | 'error' = isProcessing
    ? 'loading'
    : status === 'success'
    ? 'success'
    : status === 'error'
    ? 'error'
    : 'idle';

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Searchable Token Modal */}
      <SearchableTokenSelector
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        selectedToken={selectedFeeToken}
        onSelectToken={(sym) => setSelectedFeeToken(sym)}
        tokens={FEE_TOKENS}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        {/* Main Intent Composer Glass Card */}
        <div className="lg:col-span-8 rounded-3xl bg-slate-900/90 dark:bg-slate-900/90 bg-card/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
        <div>
          {/* Card Top Title */}
          <div className="flex items-center justify-between pb-5 border-b border-white/[0.06]">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-400 text-xs font-mono font-medium mb-2">
                <Sparkles size={12} />
                <span>ZERO-GAS PROTOCOL</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold font-syne text-foreground tracking-tight">
                Cross-Chain Fee Router
              </h2>
              <p className="text-xs sm:text-sm font-space text-muted-foreground mt-1">
                Sponsor Midnight DUST gas fees in any token with zero-knowledge witness isolation.
              </p>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/60 font-mono text-xs text-muted-foreground">
              <span className="size-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Route: Active</span>
            </div>
          </div>

          {/* Chain Route Switcher Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center my-6">
            <div className="sm:col-span-5 p-3.5 rounded-2xl bg-slate-950/70">
              <label className="text-[10px] font-mono uppercase text-muted-foreground block mb-1">
                SOURCE CHAIN
              </label>
              <select
                value={sourceChain}
                onChange={(e) => setSourceChain(e.target.value)}
                className="w-full bg-transparent font-syne font-medium text-sm text-foreground outline-none cursor-pointer"
              >
                {SUPPORTED_CHAINS.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-foreground">
                    {c.icon} {c.name} ({c.badge})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-1 flex items-center justify-center">
              <div className="size-8 rounded-full bg-slate-950/80 flex items-center justify-center text-cyan-400 shadow-sm">
                <ArrowRightLeft size={14} />
              </div>
            </div>

            <div className="sm:col-span-5 p-3.5 rounded-2xl bg-slate-950/70">
              <label className="text-[10px] font-mono uppercase text-muted-foreground block mb-1">
                DESTINATION NETWORK
              </label>
              <select
                value={targetChain}
                onChange={(e) => setTargetChain(e.target.value)}
                className="w-full bg-transparent font-syne font-medium text-sm text-foreground outline-none cursor-pointer"
              >
                {SUPPORTED_CHAINS.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-foreground">
                    {c.icon} {c.name} ({c.badge})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Transfer Amount Input Box */}
          <div className="p-4 rounded-2xl bg-slate-950/70">
            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-2">
              <span>TRANSFER AMOUNT</span>
              <span>Available: $2,450.50 USDC</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-transparent text-2xl sm:text-3xl font-mono font-bold text-foreground outline-none"
              />
              <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-xs font-mono font-bold text-foreground shrink-0 shadow-sm">
                USDC
              </span>
            </div>

            {/* Quick Percentage Presets */}
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.06]">
              {['25%', '50%', '75%', '100%'].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => {
                    const balance = 2450.50;
                    const factor = parseInt(pct) / 100;
                    setTransferAmount((balance * factor).toFixed(2));
                  }}
                  className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-slate-900/90 hover:bg-slate-800 text-muted-foreground hover:text-foreground transition-all"
                >
                  {pct === '100%' ? 'MAX' : pct}
                </button>
              ))}
              <div className="ml-auto text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={13} />
                <span>Zero Gas Fee Sponsored</span>
              </div>
            </div>
          </div>

          {/* Recipient Shielded Address */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-950/70">
            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-1">
              <span>RECIPIENT SHIELDED ADDRESS</span>
              <span className="text-[10px] text-cyan-400">BLS12-381 / SECP256K1</span>
            </div>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="02..."
              className="w-full bg-transparent font-mono text-xs text-foreground outline-none truncate"
            />
          </div>

          {/* Fee Token Selector Button */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-950/70">
            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground mb-2">
              <span>PAY SPONSORSHIP FEE IN</span>
              <button
                type="button"
                onClick={() => setIsTokenModalOpen(true)}
                className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>Search All Tokens</span>
                <ChevronDown size={12} />
              </button>
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setIsTokenModalOpen(true)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-foreground transition-all shadow-sm"
              >
                <span className="text-base">{currentFeeConfig.icon}</span>
                <span className="font-mono font-bold text-xs">{currentFeeConfig.symbol}</span>
                <ChevronDown size={13} className="text-muted-foreground" />
              </button>

              <div className="text-right">
                <div className="text-xs font-mono font-bold text-foreground">
                  {quotedTokenFee} {currentFeeConfig.symbol}
                </div>
                <div className="text-[10px] font-mono text-muted-foreground">
                  ~35,000 DUST Sponsored
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Savings Bar */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 flex items-center justify-between text-xs font-mono my-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap size={14} className="text-emerald-400" />
              <span>Estimated Legacy Gas: <span className="line-through text-slate-500">~$12.50</span></span>
            </div>
            <div className="text-emerald-400 font-bold flex items-center gap-1.5">
              <span>Midnight Route: $0.00 Gas</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-400/20 text-[10px]">SAVE 100%</span>
            </div>
          </div>
        </div>

        {/* Generate Button Component */}
        <div className="mt-4">
          <GenerateButton
            onClick={handleExecute}
            status={buttonStatus}
            disabled={!wallet.isConnected}
            disabledReason="Please connect Lace wallet to sponsor transactions"
            label="Generate ZK Proof & Sponsor Transfer"
          />
        </div>
      </div>

      {/* Side Telemetry Column */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        {/* Dynamic Fee Oracle Card */}
        <div className="rounded-3xl bg-gradient-to-b from-indigo-950/50 via-slate-900/90 to-slate-900/95 backdrop-blur-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-2 pb-4 border-b border-white/[0.06] font-syne font-semibold text-sm text-foreground">
            <Radio size={15} className="text-cyan-400" />
            <span>Real-Time Fee Oracle</span>
          </div>

          <div className="space-y-3.5 mt-4 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">DUST Required:</span>
              <span className="text-foreground font-bold">{requiredDust.toLocaleString()} DUST</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">DUST Pool Subsidy:</span>
              <span className="text-emerald-400 font-bold">100% Gasless</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
              <span className="text-muted-foreground">Reimbursement:</span>
              <span className="text-cyan-400 font-bold text-sm">
                {quotedTokenFee} {selectedFeeToken}
              </span>
            </div>
          </div>

          <div className="mt-5 p-3 rounded-xl bg-slate-950/60 text-[11px] font-space text-muted-foreground flex items-start gap-2">
            <ShieldCheck size={15} className="text-cyan-400 shrink-0 mt-0.5" />
            <span>
              <strong>Zero-Knowledge Guarantee:</strong> Private keys and account balances never leave browser memory.
            </span>
          </div>
        </div>

        {/* Live Stepper when Proving */}
        {isProcessing && (
          <div className="rounded-3xl bg-slate-900/95 backdrop-blur-2xl p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center gap-2 pb-3 border-b border-white/[0.06] font-syne font-semibold text-xs text-foreground">
              <Terminal size={14} className="text-cyan-400" />
              <span>Compact Circuit Execution</span>
            </div>

            <div className="space-y-3 mt-4">
              {PROOF_STEPS.map((s, idx) => {
                const currentStepNum = status === 'step0' ? 0 : status === 'step1' ? 1 : 2;
                const isDone = idx < currentStepNum;
                const isCurrent = idx === currentStepNum;
                return (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <div
                      className={`size-5 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5 ${
                        isDone
                          ? 'bg-emerald-500 text-black font-bold'
                          : isCurrent
                          ? 'bg-cyan-500/20 text-cyan-400 animate-pulse'
                          : 'bg-slate-800 text-muted-foreground'
                      }`}
                    >
                      {isDone ? <Check size={11} strokeWidth={3} /> : idx + 1}
                    </div>
                    <div>
                      <div className="font-syne font-medium text-foreground">{s.label}</div>
                      <div className="text-[10px] font-mono text-muted-foreground mt-0.5">{s.detail}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Confirmed Settlement Success Result Card */}
        {status === 'success' && latestTx && (
          <div className="rounded-3xl bg-gradient-to-b from-emerald-950/60 via-slate-900/90 to-slate-900/95 backdrop-blur-2xl p-6 shadow-2xl animate-scale-up">
            <div className="flex items-center gap-2.5 pb-4 border-b border-white/[0.06]">
              <div className="p-1.5 rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 size={18} />
              </div>
              <div>
                <h4 className="font-syne font-bold text-sm text-foreground">Transfer Sponsored &amp; Settled</h4>
                <div className="text-[10px] font-mono text-emerald-400">Confirmed on Midnight Preprod</div>
              </div>
            </div>

            <div className="space-y-2.5 mt-4 text-xs font-mono">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70">
                <span className="text-muted-foreground">Intent:</span>
                <span className="text-cyan-400">{latestTx.intentHash.slice(0, 10)}...</span>
                <button onClick={() => copyToClipboard(latestTx.intentHash, 'intent')} className="text-muted-foreground hover:text-foreground">
                  {copiedField === 'intent' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                </button>
              </div>

              {latestTx.txHash && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70">
                  <span className="text-muted-foreground">Tx Hash:</span>
                  <span className="text-emerald-400">{latestTx.txHash.slice(0, 10)}...</span>
                  <button onClick={() => copyToClipboard(latestTx.txHash || '', 'tx')} className="text-muted-foreground hover:text-foreground">
                    {copiedField === 'tx' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mt-4">
              {onOpenReceipt && (
                <button
                  type="button"
                  onClick={() => onOpenReceipt(latestTx)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-xs font-mono font-bold text-slate-950 flex items-center justify-center gap-1.5 transition-all shadow-md"
                >
                  <Sparkles size={12} />
                  <span>View Official Receipt</span>
                </button>
              )}
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Interactive Multi-Chain Relayer Map (Full Width) */}
      <div className="w-full">
        <CrossChainRouteMap sourceChain={sourceChain} asset={selectedFeeToken} feeToken={selectedFeeToken} />
      </div>
    </div>
  );
};
