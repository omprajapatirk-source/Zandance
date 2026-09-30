"use client";

import React, { useState } from "react";
import { CheckCircle2, Shield, Zap, ExternalLink, Copy, Check, Radio } from "lucide-react";
import { GaslessIntent } from "@/types";

interface LiveTransactionsFeedProps {
  intents: GaslessIntent[];
}

export const LiveTransactionsFeed: React.FC<LiveTransactionsFeedProps> = ({ intents }) => {
  const [copiedTx, setCopiedTx] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTx(id);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  return (
    <div className="w-full rounded-3xl bg-slate-900/90 backdrop-blur-2xl p-6 sm:p-7 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="font-syne font-semibold text-sm sm:text-base text-foreground">
            Live Sponsored Intent Feed
          </h3>
        </div>
        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/15 px-2.5 py-0.5 rounded-full">
          Preprod Live Stream
        </span>
      </div>

      {/* Transaction List */}
      <div className="divide-y divide-white/[0.04] mt-2 max-h-80 overflow-y-auto pr-1">
        {intents.map((intent, idx) => (
          <div
            key={intent.id || idx}
            className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-950/40 px-3 rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-xl bg-slate-950/80 flex items-center justify-center text-xs font-bold shrink-0">
                <Zap size={14} className="text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-foreground">
                    {intent.amount} {intent.asset}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">
                    Gas: $0.00
                  </span>
                </div>
                <div className="text-[10px] font-mono text-muted-foreground flex items-center gap-1 mt-0.5">
                  <span className="uppercase">{intent.sourceChain}</span>
                  <span>➔</span>
                  <span className="text-purple-300">Midnight Shielded</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <div className="text-right">
                <div className="text-xs font-mono text-cyan-400 flex items-center gap-1">
                  <span>{(intent.txHash || intent.intentHash).slice(0, 8)}...</span>
                  <button
                    onClick={() => copyToClipboard(intent.txHash || intent.intentHash, intent.id)}
                    className="text-muted-foreground hover:text-foreground"
                    title="Copy Hash"
                  >
                    {copiedTx === intent.id ? (
                      <Check size={12} className="text-emerald-400" />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                </div>
                <div className="text-[10px] text-muted-foreground font-mono">
                  {intent.dustEquivalent.toLocaleString()} DUST Sponsored
                </div>
              </div>

              <a
                href={`https://midnightexplorer.com/contract/c16f00430277712f9470c4b4cc5ed31f3c3e6dab6bb815d50c4a82cca607ec`}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-xl bg-slate-950/60 hover:bg-slate-800 text-muted-foreground hover:text-foreground transition-all"
                title="View on Midnight Preprod Explorer"
              >
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
