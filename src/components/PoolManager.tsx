import React, { useState, useMemo } from 'react';
import { PoolStats, WalletState } from '../types';
import { Flame, Droplets, TrendingUp, ShieldAlert, Award, Clock, Activity, Zap, PlusCircle, Sliders, ArrowUpRight, CheckCircle2 } from 'lucide-react';

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
  const [decayLambda, setDecayLambda] = useState('0.05');
  const [isDepositing, setIsDepositing] = useState(false);

  const maxCapacity = 1_000_000_000;
  const healthPercent = Math.min(100, (stats.reserveDust / maxCapacity) * 100);
  const isLow = healthPercent < 25;

  // Epoch decay curve bars
  const epochTimeline = useMemo(() => {
    const epochs: { epoch: number; heightPercent: number; dustVal: number }[] = [];
    const lambdaNum = parseFloat(decayLambda) || 0.05;

    for (let i = 0; i < 8; i++) {
      const decayFactor = Math.exp(-lambdaNum * i);
      const dustVal = Math.round(stats.reserveDust * decayFactor);
      epochs.push({
        epoch: stats.currentEpoch + i,
        heightPercent: Math.max(12, Math.round(decayFactor * 100)),
        dustVal,
      });
    }
    return epochs;
  }, [stats.currentEpoch, stats.reserveDust, decayLambda]);

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(depositAmount, 10);
    if (!isNaN(val) && val > 0) {
      setIsDepositing(true);
      setTimeout(() => {
        onDepositDust(val);
        setIsDepositing(false);
      }, 500);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-slate-950 border border-white/[0.08] backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-2">
              <Droplets size={14} />
              <span>STAKED NIGHT LIQUIDITY POOL</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold font-syne text-foreground tracking-tight">
              DUST Sponsorship Pool Engine
            </h2>
            <p className="text-xs sm:text-sm font-space text-muted-foreground mt-1 max-w-2xl leading-relaxed">
              Non-transferable DUST generated continuously from NIGHT staking is pooled to sponsor multi-token gasless transactions.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto px-3.5 py-1.5 rounded-2xl bg-slate-950/80 border border-white/[0.06] text-xs font-mono text-purple-300">
            <Clock size={13} className="text-purple-400" />
            <span>Epoch #{stats.currentEpoch}</span>
          </div>
        </div>
      </div>

      {/* Metrics & Interactive Gauges Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Pool Metrics & Deposit Actions (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Capacity Gauge Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                  POOL SOLVENCY &amp; CAPACITY
                </span>
                <div className="text-2xl font-mono font-bold text-foreground mt-0.5">
                  {stats.reserveDust.toLocaleString()}{' '}
                  <span className="text-xs font-normal text-muted-foreground">/ 1,000,000,000 DUST</span>
                </div>
              </div>
              <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full ${
                isLow ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {healthPercent.toFixed(1)}% SATURATED
              </span>
            </div>

            {/* Visual Bar Gauge */}
            <div className="w-full h-3.5 rounded-full bg-slate-950 p-0.5 overflow-hidden border border-white/[0.06]">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isLow
                    ? 'bg-gradient-to-r from-red-500 to-amber-500'
                    : 'bg-gradient-to-r from-cyan-500 via-emerald-400 to-emerald-300'
                }`}
                style={{ width: `${healthPercent}%` }}
              />
            </div>

            {/* Quick Stat Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/[0.04]">
                <div className="text-[10px] font-mono text-muted-foreground">ESTIMATED BUFFER</div>
                <div className="text-sm font-mono font-bold text-cyan-400 mt-0.5">
                  ~{(stats.reserveDust / 35000).toFixed(0)} Txs
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/[0.04]">
                <div className="text-[10px] font-mono text-muted-foreground">TOTAL SPONSORED</div>
                <div className="text-sm font-mono font-bold text-foreground mt-0.5">
                  {stats.totalSponsoredTxs.toLocaleString()} Txs
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/[0.04]">
                <div className="text-[10px] font-mono text-muted-foreground">SPONSORED GAS VALUE</div>
                <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5">
                  ${((stats.totalDustSponsored / 35000) * 1.4).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Yield Deposit & Drain Simulation Card */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-slate-900/90 to-slate-950 border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <PlusCircle size={16} className="text-emerald-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-foreground font-semibold">
                  DEPOSIT NIGHT STAKING YIELD (DUST)
                </span>
              </div>
              <span className="text-[11px] font-mono text-muted-foreground">
                Wallet Balance: <strong className="text-foreground">{wallet.dustBalance.toLocaleString()} DUST</strong>
              </span>
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-3.5">
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <div className="relative w-full flex-1">
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-950 border border-white/[0.08] text-sm font-mono text-foreground focus:outline-none focus:border-emerald-500/50"
                    placeholder="DUST amount"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-mono text-muted-foreground">
                    DUST
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isDepositing}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <PlusCircle size={14} />
                  <span>{isDepositing ? 'Depositing...' : 'Deposit DUST'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-muted-foreground">Preset Amounts:</span>
                {['100000', '500000', '1000000'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setDepositAmount(preset)}
                    className="px-2.5 py-1 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-white/[0.04] text-[10px] font-mono text-muted-foreground hover:text-foreground transition-all"
                  >
                    +{(parseInt(preset) / 1000).toLocaleString()}k
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Midnight Exponential Half-Life Decay Simulator (1 col) */}
        <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-purple-950/30 via-slate-900/90 to-slate-950 border border-purple-500/20 backdrop-blur-xl shadow-xl flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-purple-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-purple-300 font-bold">
                  MIDNIGHT HALF-LIFE
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                λ = {decayLambda}
              </span>
            </div>

            <p className="text-xs font-space text-muted-foreground mt-3 leading-relaxed">
              Midnight protocol enforces exponential DUST decay: <br />
              <code className="text-purple-300 font-mono text-[11px]">R(t) = R₀ · e^(-λt)</code>
            </p>

            {/* Visual Decay Bars */}
            <div className="mt-5 space-y-2">
              <div className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider mb-2">
                Projected Epoch Degradation:
              </div>
              <div className="h-32 flex items-end justify-between gap-1.5 pt-4 pb-1 px-2 rounded-2xl bg-slate-950/70 border border-white/[0.04]">
                {epochTimeline.map((item, idx) => (
                  <div key={item.epoch} className="flex-1 flex flex-col items-center gap-1 group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-7 hidden group-hover:block px-2 py-0.5 rounded bg-slate-900 border border-white/[0.1] text-[9px] font-mono text-foreground whitespace-nowrap shadow-md z-10">
                      {(item.dustVal / 1000).toFixed(0)}k DUST
                    </div>
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 ${
                        idx === 0
                          ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.4)]'
                          : 'bg-purple-500/60 group-hover:bg-purple-400'
                      }`}
                      style={{ height: `${item.heightPercent}%` }}
                    />
                    <span className="text-[9px] font-mono text-muted-foreground">
                      E{item.epoch}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.06]">
            <label className="flex items-center justify-between text-[11px] font-mono text-muted-foreground mb-1.5">
              <span>Decay Rate (λ):</span>
              <span className="text-foreground font-semibold">{decayLambda}</span>
            </label>
            <input
              type="range"
              min="0.01"
              max="0.20"
              step="0.01"
              value={decayLambda}
              onChange={(e) => setDecayLambda(e.target.value)}
              className="w-full accent-purple-400 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
