import React, { useState } from 'react';
import { WalletState } from '../types';
import { Shield, Key, RefreshCw, X, CheckCircle2, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

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
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleUnlockAndAuthorize = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!password.trim()) {
      setError('Please enter your Lace wallet password to authorize.');
      return;
    }

    setError('');
    setConnecting(true);

    // Simulate authenticating against Lace Midnight Preprod extension & deriving ZK witness key
    await new Promise((resolve) => setTimeout(resolve, 1200));
    
    onConnect();
    setConnecting(false);
    setPassword('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '440px',
          background: '#0d111a',
          border: '1px solid rgba(121, 40, 202, 0.4)',
          borderRadius: '16px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(121, 40, 202, 0.2)'
        }}
      >
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #7928ca, #38ef7d)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              boxShadow: '0 4px 12px rgba(121, 40, 202, 0.4)'
            }}>
              🌙
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>Lace Midnight Wallet</h3>
              <p style={{ fontSize: '0.75rem', color: '#a855f7', margin: 0, fontWeight: 600 }}>Midnight Preprod Testnet</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={18} />
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
                <span>Authorized &amp; Connected</span>
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
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>NIGHT Staked</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginTop: '0.2rem' }}>
                  {wallet.nightBalance.toLocaleString()} <span style={{ fontSize: '0.75rem', color: '#a855f7' }}>NIGHT</span>
                </div>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.75rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
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
          <form onSubmit={handleUnlockAndAuthorize}>
            {/* Requesting dApp Info */}
            <div style={{
              background: 'rgba(121, 40, 202, 0.08)',
              border: '1px solid rgba(121, 40, 202, 0.25)',
              borderRadius: '10px',
              padding: '0.85rem 1rem',
              marginBottom: '1rem',
              fontSize: '0.82rem',
              color: '#cbd5e1'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c084fc', fontWeight: 600, marginBottom: '0.25rem' }}>
                <Shield size={16} />
                <span>Authorization Request: Zandance dApp</span>
              </div>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                Grants permission to derive client-side ZK fee witness proofs and sponsor DUST gas on Midnight Preprod.
              </p>
            </div>

            {/* Password Input Section */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.5rem' }}>
                Enter Lace Wallet Password:
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your wallet password..."
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  autoFocus
                  style={{
                    width: '100%',
                    background: '#161b26',
                    border: error ? '1px solid #f43f5e' : '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '8px',
                    padding: '0.75rem 2.75rem 0.75rem 0.85rem',
                    color: '#f8fafc',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f43f5e', fontSize: '0.78rem', marginTop: '0.4rem' }}>
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* Unlock & Authorize Button */}
            <button
              type="submit"
              className="btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                fontSize: '0.92rem',
                fontWeight: 600,
                background: 'linear-gradient(135deg, #7928ca, #4f46e5)',
                boxShadow: '0 4px 15px rgba(121, 40, 202, 0.4)'
              }}
              disabled={connecting}
            >
              {connecting ? (
                <>
                  <RefreshCw className="spin" size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Authorizing Midnight Session...</span>
                </>
              ) : (
                <>
                  <Key size={18} />
                  <span>Unlock &amp; Authorize Wallet</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
