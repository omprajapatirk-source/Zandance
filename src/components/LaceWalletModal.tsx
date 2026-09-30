import React, { useState } from 'react';
import { WalletState } from '../types';
import { Shield, Key, RefreshCw, X, CheckCircle2, AlertTriangle, ExternalLink, Cpu, Copy, Check } from 'lucide-react';
import {
  isLaceWalletInstalled,
  connectLaceWallet,
  disconnectLaceWallet,
  type MidnightWalletInfo,
} from '../midnight';

interface LaceWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletState;
  onConnect: (walletInfo?: MidnightWalletInfo) => void;
  onDisconnect: () => void;
}

export const LaceWalletModal: React.FC<LaceWalletModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onConnect,
  onDisconnect,
}) => {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleConnectRealLace = async () => {
    setConnecting(true);
    setError(null);

    try {
      if (!isLaceWalletInstalled()) {
        throw new Error(
          'WALLET_NOT_INSTALLED: Lace Midnight wallet extension was not detected. ' +
            'Please install the Lace browser extension with Midnight support from https://www.lace.io.',
        );
      }

      // Calls window.midnight via official @midnight-ntwrk/dapp-connector-api
      const walletInfo = await connectLaceWallet();
      onConnect(walletInfo);
      setConnecting(false);
      onClose();
    } catch (err: any) {
      setConnecting(false);
      const message = err?.message || 'Connection failed';

      if (message.includes('USER_REJECTED')) {
        setError('Connection rejected: The authorization request was cancelled or declined in Lace.');
      } else if (message.includes('WALLET_NOT_INSTALLED')) {
        setError('Lace wallet not detected in your browser. Install Lace or use the testnet simulator below.');
      } else {
        setError(`Wallet connection error: ${message}`);
      }
    }
  };

  const handleSimulateDevWallet = () => {
    setError(null);
    setConnecting(true);
    setTimeout(() => {
      // Deterministic simulated testnet keypair for sandbox testing
      const simWallet: MidnightWalletInfo = {
        address: '025c276e4ee2938b9ded19e9ae2e70181f97009f641b68bfe2f4ee6104ed0a5b',
        shieldedAddress: '028a49c2d7f9911e389e0bfa7c36208a1834927b59e38dca167732a19283f982',
        networkId: 'preprod',
        balanceDust: 1000000,
        balanceNight: 50000,
      };
      onConnect(simWallet);
      setConnecting(false);
      onClose();
    }, 400);
  };

  const handleDisconnect = async () => {
    setError(null);
    try {
      await disconnectLaceWallet();
    } catch (err) {
      console.warn('[Zandance] Disconnect error:', err);
    }
    onDisconnect();
    onClose();
  };

  const hasLace = isLaceWalletInstalled();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content cyber-glassmorphism" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7928ca 0%, #38ef7d 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              boxShadow: '0 0 20px rgba(121, 40, 202, 0.4)',
            }}>
              🌙
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Lace Midnight Wallet</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Official DApp Connector API · Midnight Preprod
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '0.4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Error / Alert Banner */}
        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.35)',
            borderRadius: '12px',
            padding: '0.9rem 1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.65rem',
          }}>
            <AlertTriangle size={18} color="#fb7185" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.82rem', color: '#fecdd3', lineHeight: 1.5 }}>
              <div style={{ fontWeight: 600, marginBottom: '0.2rem', color: '#fda4af' }}>Connection Notice</div>
              <div>{error}</div>
              <a
                href="https://www.lace.io"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  color: '#c084fc',
                  marginTop: '0.45rem',
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                }}
              >
                <span>Get Lace Wallet Extension</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        )}

        {wallet.isConnected ? (
          <div>
            {/* Connected State */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '1.1rem',
              marginBottom: '1.25rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 600, fontSize: '0.92rem' }}>
                  <CheckCircle2 size={18} />
                  <span>Connected to Midnight Preprod</span>
                </div>
                <span className="mono-tag" style={{ fontSize: '0.72rem', borderColor: '#10b981' }}>ONLINE</span>
              </div>

              <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Public Address:</span>
                  <button
                    onClick={() => copyToClipboard(wallet.address, 'addr')}
                    style={{ background: 'transparent', border: 'none', color: '#f8fafc', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'var(--font-mono)' }}
                  >
                    <span>{wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}</span>
                    {copied === 'addr' ? <Check size={12} color="#10b981" /> : <Copy size={12} color="#94a3b8" />}
                  </button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Shielded (ZK) Key:</span>
                  <button
                    onClick={() => copyToClipboard(wallet.shieldedAddress, 'shielded')}
                    style={{ background: 'transparent', border: 'none', color: '#c084fc', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'var(--font-mono)' }}
                  >
                    <span>{wallet.shieldedAddress.slice(0, 10)}...{wallet.shieldedAddress.slice(-8)}</span>
                    {copied === 'shielded' ? <Check size={12} color="#10b981" /> : <Copy size={12} color="#94a3b8" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Balances Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.35)', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>NIGHT Balance</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
                  {wallet.nightBalance.toLocaleString()} <span style={{ fontSize: '0.75rem', color: '#a855f7' }}>NIGHT</span>
                </div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.35)', padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>DUST Gas Energy</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#10b981' }}>
                  {wallet.dustBalance.toLocaleString()} <span style={{ fontSize: '0.75rem', color: '#34d399' }}>DUST</span>
                </div>
              </div>
            </div>

            <button
              className="btn-secondary"
              style={{ width: '100%', borderColor: 'rgba(244, 63, 94, 0.4)', color: '#fb7185', padding: '0.8rem' }}
              onClick={handleDisconnect}
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <div>
            {/* Auth Information Card */}
            <div style={{
              background: 'rgba(147, 51, 234, 0.08)',
              border: '1px solid rgba(147, 51, 234, 0.25)',
              borderRadius: '12px',
              padding: '1.1rem',
              marginBottom: '1.25rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c084fc', fontWeight: 600, fontSize: '0.92rem', marginBottom: '0.4rem' }}>
                <Shield size={18} />
                <span>Zero-Knowledge Multi-Asset Auth</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Connect your Lace wallet to authenticate private witnesses off-chain and sponsor zero-gas cross-chain routes on Midnight Preprod.
              </p>
            </div>

            {/* Extension Detection Indicator */}
            <div style={{
              fontSize: '0.78rem',
              color: hasLace ? '#10b981' : '#fbbf24',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 0.75rem',
              background: hasLace ? 'rgba(16, 185, 129, 0.06)' : 'rgba(251, 191, 36, 0.06)',
              borderRadius: '8px',
              border: `1px solid ${hasLace ? 'rgba(16, 185, 129, 0.2)' : 'rgba(251, 191, 36, 0.2)'}`,
            }}>
              {hasLace ? (
                <>
                  <CheckCircle2 size={14} color="#10b981" />
                  <span>Lace Midnight extension detected (window.midnight)</span>
                </>
              ) : (
                <>
                  <AlertTriangle size={14} color="#fbbf24" />
                  <span>Lace extension not installed — install from lace.io or test in simulator</span>
                </>
              )}
            </div>

            {/* Primary Action: Real Lace Connect */}
            <button
              className="btn-primary"
              style={{ width: '100%', padding: '0.9rem', marginBottom: '0.75rem' }}
              onClick={handleConnectRealLace}
              disabled={connecting}
            >
              {connecting ? (
                <>
                  <RefreshCw className="spin" size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Connecting to Lace Extension...</span>
                </>
              ) : (
                <>
                  <Key size={18} />
                  <span>Connect Lace Extension</span>
                </>
              )}
            </button>

            {/* Secondary Action: Sandbox Simulator */}
            <button
              className="btn-secondary"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.82rem',
                background: 'rgba(255, 255, 255, 0.03)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                color: 'var(--text-secondary)',
              }}
              onClick={handleSimulateDevWallet}
              disabled={connecting}
            >
              <Cpu size={15} />
              <span>Launch Testnet Simulator (Dev Sandbox)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
