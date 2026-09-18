import React, { useState } from 'react';
import { PoolStats, WalletState } from '../types';
import { Flame, Droplets, TrendingUp, ShieldAlert, Award, Clock } from 'lucide-react';

interface PoolManagerProps {
  stats: PoolStats;
  wallet: WalletState;
  onDepositDust: (amount: number) => void;
  onSimulateDecay: (amount: number) => void;
}

export const PoolManager: React.FC<PoolManagerProps> = ({
  stats,
  wallet,
  onDepositDust,
  onSimulateDecay
}) => {
  const [depositAmount, setDepositAmount] = useState('500000');
  const [decaySimAmount, setDecaySimAmount] = useState('50000');

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
      {/* Pool Health & Capacity Card */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Droplets size={22} color="#10b981" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>DUST Liquidity Pool</h2>
          </div>
          <span className="network-badge" style={{ background: 'rgba(147, 51, 234, 0.12)', borderColor: 'rgba(147, 51, 234, 0.3)', color: '#c084fc' }}>
            Epoch #{stats.currentEpoch}
          </span>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
          Midnight's anti-speculation design generates non-transferable DUST from staked NIGHT. Zandance pools DUST capacity to sponsor user cross-chain fees automatically.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Available DUST Reserve</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10b981', fontFamily: 'var(--font-mono)', marginTop: '0.25rem' }}>
              {stats.reserveDust.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#6ee7b7', marginTop: '0.2rem' }}>~{(stats.reserveDust / 35000).toFixed(0)} Txs Sponsored</div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Protocol Staked NIGHT</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#c084fc', fontFamily: 'var(--font-mono)', marginTop: '0.25rem' }}>
              {stats.stakedNight.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#d8b4fe', marginTop: '0.2rem' }}>+120k DUST/hour Yield</div>
          </div>
        </div>

        {/* Deposit NIGHT Yield into Pool */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <label className="form-label">Stake Rewards DUST Deposit (from NIGHT yield)</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="number"
              className="form-input"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="Amount"
            />
            <button
              className="btn-primary"
              style={{ whiteSpace: 'nowrap' }}
              onClick={() => onDepositDust(parseFloat(depositAmount) || 0)}
            >
              Deposit DUST
            </button>
          </div>
        </div>
      </div>

      {/* DUST Decay Mechanics & Relayer Status */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Flame size={22} color="#f43f5e" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>DUST Decay & Relayer Engine</h2>
          </div>
          <span className="network-badge" style={{ color: '#fb7185', background: 'rgba(244, 63, 94, 0.12)', borderColor: 'rgba(244, 63, 94, 0.3)' }}>
            <Clock size={12} />
            <span>Decaying Asset</span>
          </span>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
          DUST naturally decays over time. Zandance continuously routes intents to avoid capacity waste and rebalances stale epochs via Compact circuits.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Active Solver Relayers</span>
            <span style={{ fontWeight: 700, color: '#38bdf8' }}>{stats.activeRelayers} Online (EVM, Midnight, Solana)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Total Sponsored Transactions</span>
            <span style={{ fontWeight: 700, color: '#f8fafc', fontFamily: 'var(--font-mono)' }}>{stats.totalSponsoredTxs.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '8px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Cumulative DUST Sponsored</span>
            <span style={{ fontWeight: 700, color: '#10b981', fontFamily: 'var(--font-mono)' }}>{stats.totalDustSponsored.toLocaleString()} DUST</span>
          </div>
        </div>

        {/* Decay Simulation Button */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <label className="form-label">Simulate Midnight Epoch Decay</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="number"
              className="form-input"
              value={decaySimAmount}
              onChange={(e) => setDecaySimAmount(e.target.value)}
              placeholder="Decay Amount"
            />
            <button
              className="btn-secondary"
              style={{ whiteSpace: 'nowrap', borderColor: 'rgba(244, 63, 94, 0.3)', color: '#fb7185' }}
              onClick={() => onSimulateDecay(parseFloat(decaySimAmount) || 0)}
            >
              Apply Epoch Decay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
