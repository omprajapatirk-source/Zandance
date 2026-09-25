import React, { useState } from 'react';
import { WalletState } from '../types';
import { Shield, Key, RefreshCw, X, CheckCircle2, Lock, AlertTriangle, ExternalLink } from 'lucide-react';
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
  onDisconnect
}) => {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConnect = async () => {
    setConnecting(true);
    setError(null);

    // Attempt real Lace wallet connection via DApp connector API
    if (isLaceWalletInstalled()) {
      try {
        const walletInfo = await connectLaceWallet();
        onConnect(walletInfo);
        setConnecting(false);
        onClose();
        return;
      } catch (err: any) {
        const message = err?.message || 'Connection failed';

        if (message.includes('USER_REJECTED')) {
          setError('Connection rejected. Please approve the connection request in your Lace wallet.');
          setConnecting(false);
          return;
        }

        if (message.includes('WALLET_NOT_INSTALLED')) {
          setError('Lace wallet not detected. Please install the Lace browser extension.');
          setConnecting(false);
          return;
        }

        // For other errors, fall through to demo mode
        console.warn('[Zandance] DApp connector error, falling back to demo mode:', message);
      }
    } else {
      console.warn('[Zandance] Lace wallet extension not detected. Using demo mode for development.');
    }

    // Fallback: demo mode for local development without Lace extension
    await new Promise((resolve) => setTimeout(resolve, 800));
    onConnect(); // No walletInfo = use default demo state
    setConnecting(false);
    onClose();
  };

  const handleDisconnect = async () => {
    setError(null);

    // Attempt real DApp connector disconnect
    try {
      await disconnectLaceWallet();
    } catch {
      // Silently handle – wallet may already be disconnected
    }

    onDisconnect();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7928ca, #38ef7d)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem'
            }}>
              🌙
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Lace Midnight Wallet</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Midnight Preprod Testnet Connector</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.08)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '12px',
            padding: '0.85rem 1rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.6rem'
          }}>
            <AlertTriangle size={18} color="#fb7185" style={{ flexShrink: 0, marginTop: '1px' }} />
            <div style={{ fontSize: '0.82rem', color: '#fca5a5', lineHeight: 1.5 }}>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Connection Error</div>
              <div>{error}</div>
              {error.includes('install') && (
                <a
                  href="https://www.lace.io"
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#a855f7', marginTop: '0.4rem', textDecoration: 'none', fontWeight: 600 }}
                >
                  <span>Install Lace Wallet</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        )}

        {wallet.isConnected ? (
          <div>
            <div style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <CheckCircle2 size={18} />
                <span>Connected to Midnight Preprod</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <div style={{ marginBottom: '0.3rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Public Address: </span>
                  <span className="mono-tag">{wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Shielded (ZK) Key: </span>
                  <span className="mono-tag" style={{ color: '#c084fc' }}>{wallet.shieldedAddress.slice(0, 10)}...{wallet.shieldedAddress.slice(-8)}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NIGHT Balance</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.2rem' }}>
                  {wallet.nightBalance.toLocaleString()} <span style={{ fontSize: '0.75rem', color: '#a855f7' }}>NIGHT</span>
                </div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DUST Energy</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981', marginTop: '0.2rem' }}>
                  {wallet.dustBalance.toLocaleString()} <span style={{ fontSize: '0.75rem' }}>DUST</span>
                </div>
              </div>
            </div>

            <button
              className="btn-secondary"
              style={{ width: '100%', borderColor: 'rgba(244, 63, 94, 0.4)', color: '#fb7185' }}
              onClick={handleDisconnect}
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <div>
            <div style={{
              background: 'rgba(147, 51, 234, 0.08)',
              border: '1px solid rgba(147, 51, 234, 0.25)',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c084fc', fontWeight: 600, fontSize: '0.92rem', marginBottom: '0.5rem' }}>
                <Shield size={18} />
                <span>Zero-Knowledge Multi-Asset Auth</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Connect your Lace wallet to prove private token ownership and authorize zero-knowledge DUST sponsorship intents.
              </p>
            </div>

            {/* Wallet detection status */}
            <div style={{
              fontSize: '0.78rem',
              color: isLaceWalletInstalled() ? '#10b981' : '#fbbf24',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}>
              {isLaceWalletInstalled() ? (
                <>
                  <CheckCircle2 size={14} />
                  <span>Lace Midnight wallet detected</span>
                </>
              ) : (
                <>
                  <AlertTriangle size={14} />
                  <span>Lace wallet not detected — will connect in demo mode</span>
                </>
              )}
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', padding: '0.9rem' }}
              onClick={handleConnect}
              disabled={connecting}
            >
              {connecting ? (
                <>
                  <RefreshCw className="spin" size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Connecting to Lace...</span>
                </>
              ) : (
                <>
                  <Key size={18} />
                  <span>Connect Lace Wallet</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
