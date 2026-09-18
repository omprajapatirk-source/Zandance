import React, { useState } from 'react';
import { WalletState } from '../types';
import { Shield, Key, RefreshCw, X, CheckCircle2, Lock } from 'lucide-react';

interface LaceWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletState;
  onConnect: () => void;
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

  if (!isOpen) return null;

  const handleConnect = async () => {
    setConnecting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    onConnect();
    setConnecting(false);
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
              onClick={() => {
                onDisconnect();
                onClose();
              }}
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
