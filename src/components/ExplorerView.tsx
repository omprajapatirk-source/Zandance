import React from 'react';
import { ExternalLink, CheckCircle2, Shield, Layers, FileCode2, Terminal } from 'lucide-react';
import { GaslessIntent } from '../types';

interface ExplorerViewProps {
  intents: GaslessIntent[];
}

export const ExplorerView: React.FC<ExplorerViewProps> = ({ intents }) => {
  const contractAddress = "02c16f00430277712f9470c4b4cc5ed31f3c3e6dab6bb815d50c4a82cca607ec";
  const circuits = [
    { name: 'initialize', type: 'Public', description: 'Sets protocol admin and initializes DUST pool reserve' },
    { name: 'registerRelayer', type: 'Public', description: 'Authorizes cross-chain solver relayers on public ledger' },
    { name: 'sponsorFeeIntent', type: 'Shielded (ZK)', description: 'Zero-Knowledge witness verification + selective disclose() of intentHash' },
    { name: 'claimReimbursement', type: 'Public', description: 'Relayer settlement claim with replay-protection mapping' },
    { name: 'depositDustReserve', type: 'Public', description: 'Top up DUST liquidity from NIGHT staking yield' },
    { name: 'applyDustDecay', type: 'Public', description: 'Enforces Midnight DUST half-life decay mechanics' }
  ];

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

      {/* Live Transaction Ledger Stream */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Terminal size={18} color="#10b981" />
          <span>On-Chain Gasless Sponsorship Stream</span>
        </h3>

        {intents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No transactions yet. Execute a transfer in the Fee Router to trigger on-chain ZK circuits!
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
