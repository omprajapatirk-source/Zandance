import React, { useState, useMemo } from 'react';
import { ExternalLink, CheckCircle2, Shield, Layers, FileCode2, Terminal, Users, Search, Copy, Check } from 'lucide-react';
import { GaslessIntent } from '../types';
import preprodUsersData from '../data/preprodUsers.json';

interface ExplorerViewProps {
  intents: GaslessIntent[];
}

export const ExplorerView: React.FC<ExplorerViewProps> = ({ intents }) => {
  const contractAddress = "02c16f00430277712f9470c4b4cc5ed31f3c3e6dab6bb815d50c4a82cca607ec";
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const circuits = [
    { name: 'initialize', type: 'Public', description: 'Sets protocol admin and initializes DUST pool reserve' },
    { name: 'registerRelayer', type: 'Public', description: 'Authorizes cross-chain solver relayers on public ledger' },
    { name: 'sponsorFeeIntent', type: 'Shielded (ZK)', description: 'Zero-Knowledge witness verification + selective disclose() of intentHash' },
    { name: 'claimReimbursement', type: 'Public', description: 'Relayer settlement claim with replay-protection mapping' },
    { name: 'depositDustReserve', type: 'Public', description: 'Top up DUST liquidity from NIGHT staking yield' },
    { name: 'applyDustDecay', type: 'Public', description: 'Enforces Midnight DUST half-life decay mechanics' }
  ];

  const filteredUsers = useMemo(() => {
    return preprodUsersData.filter((u) => {
      const matchesSearch =
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.txHash.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAsset = selectedAsset === 'ALL' || u.tokenSymbol === selectedAsset;
      return matchesSearch && matchesAsset;
    });
  }, [searchTerm, selectedAsset]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Contract Header */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              <CheckCircle2 size={16} />
              <span>Verified Compact Contract on Midnight Preprod</span>
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>ZandanceRouter (v1.0.0)</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <a
              href="https://x.com/ZandanceFi"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', color: '#38bdf8' }}
            >
              <span>Follow @ZandanceFi</span>
              <ExternalLink size={14} />
            </a>
            <a
              href={`https://preprod.midnight.network/contract/${contractAddress}`}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}
            >
              <span>Midnight Preprod Explorer</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.4)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Contract Address (Preprod)</div>
          <div className="mono-tag" style={{ color: '#38bdf8', fontSize: '0.88rem' }}>
            {contractAddress}
          </div>
        </div>
      </div>

      {/* Verified Circuits Table */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layers size={18} color="#c084fc" />
          <span>Compiled Zero-Knowledge Circuits (`managed/`)</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {circuits.map((c) => (
            <div
              key={c.name}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                background: 'rgba(15, 23, 42, 0.6)',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.85rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span className="mono-tag" style={{ color: '#f8fafc', fontWeight: 600 }}>{c.name}</span>
                <span style={{ color: 'var(--text-secondary)' }}>{c.description}</span>
              </div>
              <span
                style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  background: c.type.includes('ZK') ? 'rgba(147, 51, 234, 0.2)' : 'rgba(56, 189, 248, 0.15)',
                  color: c.type.includes('ZK') ? '#d8b4fe' : '#7dd3fc',
                  border: c.type.includes('ZK') ? '1px solid rgba(147, 51, 234, 0.4)' : '1px solid rgba(56, 189, 248, 0.3)'
                }}
              >
                {c.type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 70 Verified Preprod Users Registry */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.2rem' }}>
              <Users size={16} />
              <span>Preprod Testnet Ledger · 70 Verified Participants (Level 5 & 6)</span>
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Testnet User Registry & ZK Proofs</h3>
          </div>

          {/* Search & Filter Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Search size={14} style={{ position: 'absolute', left: '0.75rem', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search user / address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '0.4rem 0.75rem 0.4rem 2rem',
                  borderRadius: '8px',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  fontSize: '0.82rem',
                  width: '180px'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {['ALL', 'USDC', 'USDT', 'ETH', 'NIGHT'].map((asset) => (
                <button
                  key={asset}
                  onClick={() => setSelectedAsset(asset)}
                  style={{
                    padding: '0.35rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: selectedAsset === asset ? '#38bdf8' : 'rgba(255,255,255,0.05)',
                    color: selectedAsset === asset ? '#0f172a' : 'var(--text-secondary)',
                    border: 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {asset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User Registry List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '0.25rem' }}>
          {filteredUsers.map((u) => (
            <div
              key={u.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                background: 'rgba(0, 0, 0, 0.35)',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.82rem',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 700, color: '#f8fafc' }}>@{u.username}</span>
                  <span className="mono-tag" style={{ color: '#38bdf8', fontSize: '0.72rem' }}>
                    {u.address.slice(0, 10)}...{u.address.slice(-6)}
                  </span>
                  <button
                    onClick={() => copyToClipboard(u.address, u.id)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}
                    title="Copy address"
                  >
                    {copiedId === u.id ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                  </button>
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  Tx: <span className="mono-tag">{u.txHash.slice(0, 14)}...</span> · Block #{u.blockHeight}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', textAlign: 'right' }}>
                <div>
                  <div style={{ color: '#f8fafc', fontWeight: 600 }}>
                    {u.tokenAmount} {u.tokenSymbol}
                  </div>
                  <div style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 600 }}>
                    +{u.dustSponsored.toLocaleString()} DUST
                  </div>
                </div>

                <span
                  style={{
                    padding: '0.2rem 0.5rem',
                    borderRadius: '9999px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}
                >
                  PREPROD
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Transaction Ledger Stream */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Terminal size={18} color="#10b981" />
          <span>Live Session Gasless Sponsorship Stream</span>
        </h3>

        {intents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No live session transfers yet. Execute a transfer in the Fee Router to trigger on-chain ZK circuits!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {intents.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '0.85rem 1rem',
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.82rem'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: 700, color: '#f8fafc' }}>{item.amount} {item.asset}</span>
                    <span style={{ color: 'var(--text-muted)' }}>({item.sourceChain} ➔ {item.targetChain})</span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    Intent: <span className="mono-tag">{item.intentHash.slice(0, 16)}...</span> | Fee: {item.quotedFee} {item.feeToken}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: '#10b981', fontWeight: 600, display: 'block' }}>
                    +{item.dustEquivalent.toLocaleString()} DUST Sponsored
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
