import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, Shield, TrendingUp, Droplets } from 'lucide-react';

interface LiveSavingsTickerProps {
  totalDustSponsored?: number;
  totalTxs?: number;
}

export const LiveSavingsTicker: React.FC<LiveSavingsTickerProps> = ({
  totalDustSponsored = 5250000,
  totalTxs = 148,
}) => {
  const [tickerOffset, setTickerOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerOffset((prev) => prev + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const totalSavedUsd = ((totalDustSponsored / 35000) * 1.4).toFixed(2);

  return (
    <div className="w-full bg-gradient-to-r from-cyan-950/30 via-slate-950/80 to-purple-950/30 py-2.5 px-4 overflow-hidden backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        {/* Left Metric Badge */}
        <div className="flex items-center gap-2 text-cyan-400">
          <span className="size-2 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400" />
          <span className="font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            LIVE PROTOCOL SPONSORSHIP
          </span>
        </div>

        {/* Dynamic Metric Tickers */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-muted-foreground text-[11px]">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10">
            <span className="text-muted-foreground">User Gas Saved:</span>
            <span className="text-emerald-400 font-bold">${totalSavedUsd} USD</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10">
            <span className="text-muted-foreground">DUST Liquidity:</span>
            <span className="text-cyan-300 font-bold">994.75M DUST</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/10">
            <span className="text-muted-foreground">Settled Gasless Txs:</span>
            <span className="text-purple-300 font-bold">{totalTxs}+ Verified</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10">
            <span className="text-muted-foreground">ZK Prover Latency:</span>
            <span className="text-indigo-300 font-bold">~18ms PLONK</span>
          </div>
        </div>
      </div>
    </div>
  );
};
