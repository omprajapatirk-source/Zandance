import React, { useState, useMemo } from 'react';
import { PoolStats, WalletState } from '../types';
import { Flame, Droplets, TrendingUp, ShieldAlert, Award, Clock, Activity, Zap, PlusCircle, Sliders } from 'lucide-react';
import { CyberCard3D } from './CyberCard3D';

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
  const [decayLambda, setDecayLambda] = useState('0.05');

  const maxCapacity = 1_000_000_000;
  const healthPercent = Math.min(100, (stats.reserveDust / maxCapacity) * 100);
  const isLow = healthPercent < 25;

  // Epoch decay curve bars
  const epochTimeline = useMemo(() => {
    const epochs: { epoch: number; height: number; dustVal: number }[] = [];
    const baseHeight = 90;
    const lambdaNum = parseFloat(decayLambda) || 0.05;

    for (let i = 0; i < 10; i++) {
      const decayFactor = Math.exp(-lambdaNum * i);
      const dustVal = Math.round(stats.reserveDust * decayFactor);
      epochs.push({
        epoch: stats.currentEpoch + i,
        height: Math.max(15, baseHeight * decayFactor),
        dustVal,
      });
    }
    return epochs;
  }, [stats.currentEpoch, stats.reserveDust, decayLambda]);

  return (
    <div className="tab-panel pool-grid-layout">
      {/* Left Card: DUST Liquidity Pool Core */}
      <CyberCard3D glowColor="lime" className="pool-card-main">
        <div className="card-header-flex">
          <div>
            <div className="tech-badge-lime">
              <Droplets size={13} />
              <span>STAKED NIGHT LIQUIDITY</span>
            </div>
            <h2 className="tech-title">DUST Sponsorship Pool Engine</h2>
            <p className="tech-subtitle">
              Non-transferable DUST generated from NIGHT staking is pooled to front cross-chain gasless execution.
            </p>
          </div>

          <span className="epoch-pill font-mono">
            <Clock size={12} className="neon-purple" />
            <span>EPOCH #{stats.currentEpoch}</span>
          </span>
        </div>

        {/* Holographic Health Gauge */}
        <div className="pool-health-section">
          <div className="gauge-header">
            <span className="cyber-label">POOL CAPACITY &amp; SOLVENCY</span>
            <span className="gauge-percent font-mono neon-lime">
              {healthPercent.toFixed(1)}% SATURATED
            </span>
          </div>

          <div className="cyber-gauge-track">
            <div
              className={`cyber-gauge-fill ${isLow ? 'low' : ''}`}
              style={{ width: `${healthPercent}%` }}
            />
            <div className="gauge-glow-point" style={{ left: `${healthPercent}%` }} />
          </div>

          <div className="gauge-sub-row font-mono text-xs text-muted">
            <span>0 DUST</span>
            <span>CAPACITY: 1,000,000,000 DUST</span>
          </div>
        </div>

        {/* Dynamic Metric Boxes */}
        <div className="pool-metric-boxes-grid">
          <div className="pool-stat-box">
            <div className="stat-box-label font-mono">ACTIVE DUST RESERVE</div>
            <div className="stat-box-value font-mono neon-lime">
              {stats.reserveDust.toLocaleString()}
            </div>
            <div className="stat-box-sub text-xs text-muted">
              ~{(stats.reserveDust / 35000).toFixed(0)} Txs Buffer
            </div>
          </div>

          <div className="pool-stat-box">
            <div className="stat-box-label font-mono">PROTOCOL STAKED NIGHT</div>
            <div className="stat-box-value font-mono neon-purple">
              {stats.stakedNight.toLocaleString()}
            </div>
            <div className="stat-box-sub text-xs text-muted">
              +120,000 DUST/hr Yield
            </div>
          </div>
        </div>

        {/* Deposit NIGHT Staking Yield Form */}
        <div className="cyber-input-box pool-deposit-box">
          <label className="cyber-label">DEPOSIT NIGHT STAKING YIELD (DUST)</label>
          <div className="deposit-input-flex">
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="cyber-amount-input font-mono"
              placeholder="500000"
            />
            <button
              onClick={() => onDepositDust(parseFloat(depositAmount) || 0)}
              className="cyber-mini-btn"
            >
              <PlusCircle size={16} />
              <span>DEPOSIT</span>
            </button>
          </div>
        </div>
      </CyberCard3D>

      {/* Right Card: Exponential Decay Curve Simulator */}
      <CyberCard3D glowColor="purple" className="pool-card-decay">
        <div className="card-header-flex">
          <div>
            <div className="tech-badge-magenta">
              <Flame size={13} />
              <span>MIDNIGHT HALF-LIFE</span>
            </div>
            <h3 className="tech-title-sm">Exponential Decay Curve: R(t) = R₀ · e^(-λt)</h3>
          </div>
          <div className="decay-equation-tag font-mono text-xs">
            λ = {decayLambda}
          </div>
        </div>

        {/* Decay Simulation Interactive Histogram */}
        <div className="decay-histogram-box">
          <div className="histogram-bars-wrapper">
            {epochTimeline.map((item, idx) => (
              <div key={idx} className="hist-col">
                <div className="hist-val-tooltip font-mono">
                  {(item.dustVal / 1000).toFixed(0)}k
                </div>
                <div
                  className="hist-bar"
                  style={{
                    height: `${item.height}%`,
                    background:
                      idx === 0
                        ? 'linear-gradient(180deg, #ccff00, #10b981)'
                        : 'linear-gradient(180deg, #9d4edd, #6366f1)',
                  }}
                />
                <span className="hist-label font-mono">E{item.epoch}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Decay Simulator Interactive Controls */}
        <div className="decay-controls-box">
          <div className="decay-slider-row">
            <div className="slider-label-flex">
              <span className="cyber-label">DECAY COEFFICIENT (λ)</span>
              <span className="font-mono text-cyan text-xs">{decayLambda} / epoch</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.15"
              step="0.01"
              value={decayLambda}
              onChange={(e) => setDecayLambda(e.target.value)}
              className="cyber-range-slider"
            />
          </div>

          <div className="simulate-action-row">
            <div className="cyber-input-box flex-1">
              <label className="cyber-label">EPOCH DECAY AMOUNT</label>
              <input
                type="number"
                value={decaySimAmount}
                onChange={(e) => setDecaySimAmount(e.target.value)}
                className="cyber-text-input font-mono"
              />
            </div>
            <button
              onClick={() => onSimulateDecay(parseFloat(decaySimAmount) || 0)}
              className="cyber-decay-trigger-btn"
            >
              <Flame size={16} />
              <span>APPLY DECAY</span>
            </button>
          </div>
        </div>

        <div className="decay-formula-footer font-mono text-xs text-muted">
          Midnight Network periodically applies DUST decay to discourage token hoarding and maintain steady gas liquidity.
        </div>
      </CyberCard3D>
    </div>
  );
};
