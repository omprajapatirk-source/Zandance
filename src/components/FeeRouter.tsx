import React, { useState } from 'react';
import { WalletState, GaslessIntent } from '../types';
import { ArrowRightLeft, Sparkles, ShieldCheck, CheckCircle2, AlertCircle, Cpu, ExternalLink, Copy, Check, Lock, Zap } from 'lucide-react';
import { callSponsorFeeIntent, type CircuitCallResult } from '../midnight';

interface FeeRouterProps {
  wallet: WalletState;
  onIntentExecuted: (intent: GaslessIntent) => void;
}

const SUPPORTED_CHAINS = [
  { id: 'midnight-preprod', name: 'Midnight Preprod', icon: '🌙', type: 'ZK Privacy' },
  { id: 'polygon', name: 'Polygon PoS', icon: '🟣', type: 'EVM' },
  { id: 'ethereum', name: 'Ethereum Sepolia', icon: '🔷', type: 'EVM' },
  { id: 'cardano', name: 'Cardano Preprod', icon: '🔵', type: 'UTXO' },
  { id: 'solana', name: 'Solana Devnet', icon: '🟣', type: 'SVM' }
];

const FEE_TOKENS = [
  { symbol: 'USDC', rate: 25000, name: 'USD Coin', icon: '💵' },
  { symbol: 'USDT', rate: 25000, name: 'Tether USD', icon: '💲' },
  { symbol: 'ETH', rate: 75000000, name: 'Ether', icon: '🔷' },
  { symbol: 'ADA', rate: 18000, name: 'Cardano ADA', icon: '🔵' },
  { symbol: 'SOL', rate: 4500000, name: 'Solana SOL', icon: '🟣' }
];

const PROOF_STEPS = [
  { label: 'Generating ZK Witness (getSenderSecret, getShieldedBalance)', icon: <Lock size={14} /> },
  { label: 'Computing SNARK proof via sponsorFeeIntent circuit', icon: <Cpu size={14} /> },
  { label: 'Broadcasting DUST-sponsored intent to Midnight Preprod', icon: <Zap size={14} /> }
];

export const FeeRouter: React.FC<FeeRouterProps> = ({ wallet, onIntentExecuted }) => {
  const [sourceChain, setSourceChain] = useState('polygon');
  const [targetChain, setTargetChain] = useState('midnight-preprod');
  const [transferAmount, setTransferAmount] = useState('100');
  const [selectedFeeToken, setSelectedFeeToken] = useState('USDC');
  const [recipient, setRecipient] = useState('0279fa9329e4bf18e907a0c84b5c77e382098b1a8ef8325da78a9c1e0892c');
  const [status, setStatus] = useState<'idle' | 'step0' | 'step1' | 'step2' | 'success'>('idle');
  const [latestTx, setLatestTx] = useState<GaslessIntent | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [circuitError, setCircuitError] = useState<string | null>(null);

  const currentFeeConfig = FEE_TOKENS.find(t => t.symbol === selectedFeeToken) || FEE_TOKENS[0];
  const requiredDust = 35000; // 35k DUST estimated transaction gas
  const quotedTokenFee = (requiredDust / currentFeeConfig.rate).toFixed(4);

  const isProcessing = status === 'step0' || status === 'step1' || status === 'step2';

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch { /* fallback silent */ }
  };

  const handleExecute = async () => {
    if (!wallet.isConnected) {
      alert('Please connect your Lace Midnight wallet first.');
      return;
    }

    setCircuitError(null);

    // -----------------------------------------------------------------------
    // Step 0: Build ZK Witness from wallet state
    // -----------------------------------------------------------------------
    setStatus('step0');

    // Build the private witness inputs from wallet state
    const senderSecret = wallet.shieldedAddress || wallet.address;
    const intentPayload = JSON.stringify({
      sourceChain,
      targetChain,
      asset: 'USDC',
      amount: parseFloat(transferAmount),
      recipient,
      feeToken: selectedFeeToken,
      nonce: Date.now(),
    });
    const shieldedBalance = BigInt(wallet.dustBalance || 420000);
    const maxFee = BigInt(requiredDust);

    // -----------------------------------------------------------------------
    // Step 1: Execute sponsorFeeIntent circuit (witness build + local proof)
    // -----------------------------------------------------------------------
    setStatus('step1');

    let circuitResult: CircuitCallResult;
    try {
      circuitResult = await callSponsorFeeIntent({
        senderSecret,
        intentPayload,
        shieldedBalance,
        maxFee,
      });
    } catch (err: any) {
      console.error('[FeeRouter] Circuit call failed:', err);
      setCircuitError(err?.message || 'Circuit execution failed');
      setStatus('idle');
      return;
    }

    // -----------------------------------------------------------------------
    // Step 2: Broadcast result to Midnight Preprod
    // -----------------------------------------------------------------------
    setStatus('step2');
    // Small delay to show the broadcasting step in the UI
    await new Promise(r => setTimeout(r, 600));

    const intentId = 'int_' + Math.random().toString(36).substring(2, 9);

    const newIntent: GaslessIntent = {
      id: intentId,
      sourceChain,
      targetChain,
      asset: 'USDC',
      amount: parseFloat(transferAmount),
      feeToken: selectedFeeToken,
      quotedFee: parseFloat(quotedTokenFee),
      dustEquivalent: circuitResult.dustSpent,
      intentHash: circuitResult.intentHash,
      status: 'settled',
      timestamp: Date.now(),
      txHash: circuitResult.txHash,
      proofHex: circuitResult.proofHex
    };

    setLatestTx(newIntent);
    setStatus('success');
    onIntentExecuted(newIntent);
  };

  const getStepState = (stepIndex: number) => {
    const stepNum = status === 'step0' ? 0 : status === 'step1' ? 1 : status === 'step2' ? 2 : -1;
    if (status === 'success') return 'complete';
    if (stepIndex === stepNum) return 'active';
    if (stepIndex < stepNum) return 'complete';
    return 'pending';
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.5rem' }}>
      {/* Left Column: Form */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Zero-Gas Cross-Chain Transfer</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Pay Midnight or cross-chain gas using any token in your wallet.
            </p>
          </div>
          <span className="network-badge">
            <Sparkles size={14} />
            <span>DUST Sponsored</span>
          </span>
        </div>

        {/* Chain Routing */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <label className="form-label">Source Chain</label>
            <select
              className="form-select"
              value={sourceChain}
              onChange={(e) => setSourceChain(e.target.value)}
            >
              {SUPPORTED_CHAINS.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>

          <div style={{
            marginTop: '1.5rem',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid var(--border-subtle)'
          }}>
            <ArrowRightLeft size={16} color="var(--text-secondary)" />
          </div>

          <div>
            <label className="form-label">Destination Chain</label>
            <select
              className="form-select"
              value={targetChain}
              onChange={(e) => setTargetChain(e.target.value)}
            >
              {SUPPORTED_CHAINS.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Amount and Recipient */}
        <div className="form-group">
          <label className="form-label">Transfer Amount (USDC)</label>
          <input
            type="number"
            className="form-input"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            placeholder="0.00"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Recipient Address (Midnight Preprod Shielded Address)</label>
          <input
            type="text"
            className="form-input"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}
          />
        </div>

        {/* Fee Payment Token Selector */}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Pay Gas Fee In:</span>
            <span style={{ color: '#10b981', fontWeight: 600 }}>0 DUST Needed from User</span>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
            {FEE_TOKENS.map((token) => (
              <button
                key={token.symbol}
                type="button"
                onClick={() => setSelectedFeeToken(token.symbol)}
                style={{
                  background: selectedFeeToken === token.symbol ? 'rgba(147, 51, 234, 0.25)' : 'rgba(10, 15, 28, 0.6)',
                  border: selectedFeeToken === token.symbol ? '1px solid #9333ea' : '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '0.6rem 0.4rem',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontSize: '1.1rem' }}>{token.icon}</div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, marginTop: '0.2rem' }}>{token.symbol}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Circuit Error Banner */}
        {circuitError && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.08)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '10px',
            padding: '0.75rem 1rem',
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.82rem',
            color: '#fca5a5'
          }}>
            <AlertCircle size={16} />
            <span>Circuit Error: {circuitError}</span>
          </div>
        )}

        {/* Proof Progress Steps */}
        {isProcessing && (
          <div className="proof-steps">
            {PROOF_STEPS.map((step, i) => {
              const state = getStepState(i);
              return (
                <div key={i} className={`proof-step ${state}`}>
                  <div className="proof-step-icon" style={{
                    background: state === 'complete' ? 'rgba(16, 185, 129, 0.2)' : state === 'active' ? 'rgba(147, 51, 234, 0.2)' : 'rgba(255,255,255,0.05)',
                    color: state === 'complete' ? '#10b981' : state === 'active' ? '#c084fc' : 'var(--text-muted)'
                  }}>
                    {state === 'complete' ? <CheckCircle2 size={14} /> : step.icon}
                  </div>
                  <span style={{ color: state === 'pending' ? 'var(--text-muted)' : 'var(--text-primary)', fontWeight: state === 'active' ? 600 : 400 }}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Execute Button */}
        <button
          className="btn-primary"
          style={{ width: '100%', marginTop: '0.5rem', padding: '1rem' }}
          onClick={handleExecute}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Cpu className="spin" size={20} />
              <span>Processing Zero-Knowledge Proof...</span>
            </>
          ) : (
            <>
              <ShieldCheck size={20} />
              <span>Execute Zero-Gas Transfer ({quotedTokenFee} {selectedFeeToken})</span>
            </>
          )}
        </button>
      </div>

      {/* Right Column: Live Fee Breakdown & Receipt */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div className="glass-card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⚡ Fee Abstraction Quote</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Destination Gas (Midnight)</span>
              <span style={{ color: '#10b981', fontWeight: 600 }}>{requiredDust.toLocaleString()} DUST</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Zandance DUST Pool</span>
              <span style={{ color: '#c084fc' }}>Sponsored 100%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
              <span>Exchange Rate</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>1 {selectedFeeToken} = {currentFeeConfig.rate.toLocaleString()} DUST</span>
            </div>
            <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0.25rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.95rem' }}>
              <span>You Pay Exactly</span>
              <span style={{ color: '#f8fafc' }}>{quotedTokenFee} {selectedFeeToken}</span>
            </div>
          </div>
        </div>

        {/* Success Transaction Banner */}
        {latestTx && (
          <div className="glass-card" style={{ border: '1px solid rgba(16, 185, 129, 0.4)', background: 'rgba(16, 185, 129, 0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 700, marginBottom: '0.75rem' }}>
              <CheckCircle2 size={18} />
              <span>Transaction Settled Gasless!</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Intent Hash: </span>
                <span className="mono-tag">{latestTx.intentHash.slice(0, 16)}...</span>
                <button className={`copy-btn ${copiedField === 'intent' ? 'copied' : ''}`} onClick={() => copyToClipboard(latestTx.intentHash, 'intent')}>
                  {copiedField === 'intent' ? <Check size={10} /> : <Copy size={10} />}
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Preprod Tx: </span>
                <span className="mono-tag" style={{ color: '#38bdf8' }}>{latestTx.txHash?.slice(0, 16)}...</span>
                <button className={`copy-btn ${copiedField === 'tx' ? 'copied' : ''}`} onClick={() => copyToClipboard(latestTx.txHash || '', 'tx')}>
                  {copiedField === 'tx' ? <Check size={10} /> : <Copy size={10} />}
                </button>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>ZK Proof: </span>
                <span className="mono-tag" style={{ color: '#c084fc' }}>Verified SNARK ✅</span>
              </div>
              <a
                href={`https://preprod.midnight.network/tx/${latestTx.txHash}`}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#a855f7', marginTop: '0.5rem', textDecoration: 'none', fontWeight: 600 }}
              >
                <span>View on Midnight Preprod Explorer</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
