"use client";

import React, { useState } from "react";
import { Search, X, Check, ShieldCheck } from "lucide-react";

export interface TokenOption {
  symbol: string;
  name: string;
  rate: number;
  icon: string;
  color: string;
  balance: number;
}

interface SearchableTokenSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  selectedToken: string;
  onSelectToken: (symbol: string) => void;
  tokens: TokenOption[];
}

export const SearchableTokenSelector: React.FC<SearchableTokenSelectorProps> = ({
  isOpen,
  onClose,
  selectedToken,
  onSelectToken,
  tokens,
}) => {
  const [query, setQuery] = useState("");

  if (!isOpen) return null;

  const filtered = tokens.filter(
    (t) =>
      t.symbol.toLowerCase().includes(query.toLowerCase()) ||
      t.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[9500] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

      {/* Modal Box */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-scale-up">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <h3 className="text-base font-semibold font-syne text-foreground">Select Sponsorship Fee Token</h3>
          <button onClick={onClose} className="p-1 rounded-full text-muted-foreground hover:text-foreground">
            <X size={16} />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative my-4">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search token name or symbol..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-muted/40 font-mono text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-cyan-400"
            autoFocus
          />
        </div>

        {/* Token List */}
        <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
          {filtered.map((t) => {
            const isSelected = selectedToken === t.symbol;
            return (
              <button
                key={t.symbol}
                onClick={() => {
                  onSelectToken(t.symbol);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                  isSelected
                    ? "border-cyan-400/60 bg-cyan-500/10"
                    : "border-transparent hover:border-border hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="size-8 rounded-full bg-muted flex items-center justify-center text-sm">
                    {t.icon}
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-foreground flex items-center gap-1.5">
                      <span>{t.symbol}</span>
                      {isSelected && <span className="size-1.5 rounded-full bg-cyan-400" />}
                    </div>
                    <div className="text-[10px] text-muted-foreground">{t.name}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-semibold text-foreground">{t.balance}</div>
                  <div className="text-[10px] font-mono text-muted-foreground">
                    1 {t.symbol} = {t.rate.toLocaleString()} DUST
                  </div>
                </div>
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-6 text-xs text-muted-foreground font-mono">
              No matching fee tokens found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
