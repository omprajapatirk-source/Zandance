"use client";

import React, { useState, useEffect } from "react";
import { X, Key, Shield, Droplets, Copy, Check, ExternalLink, Power, Sparkles, RefreshCw, Zap } from "lucide-react";
import { WalletState } from "@/types";
import { isLaceWalletInstalled } from "@/midnight";

interface SlideInWalletPanelProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletState;
  onConnect: () => Promise<void> | void;
  onDisconnect: () => void;
  onFaucet: (token: string, amount: number) => void;
  onOpenExplorer?: () => void;
}

export const SlideInWalletPanel: React.FC<SlideInWalletPanelProps> = ({
  isOpen,
  onClose,
  wallet,
  onConnect,
  onDisconnect,
  onFaucet,
  onOpenExplorer,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [hasExtension, setHasExtension] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setHasExtension(isLaceWalletInstalled());
    }
  }, [isOpen]);

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleConnectClick = async () => {
    setIsConnecting(true);
    try {
      await onConnect();
    } finally {
      setIsConnecting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9000] flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      {/* Drawer Body */}
      <div className="relative z-10 w-full max-w-md h-full bg-slate-950/95 border-l border-white/[0.06] flex flex-col justify-between p-6 sm:p-7 overflow-y-auto shadow-2xl transition-transform animate-slide-left">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-white/[0.06]">
            <div className="flex items-center gap-2.5">
              <img src="/zandance_logo.jpg" alt="Logo" className="size-6 rounded-lg object-cover" />
              <h3 className="font-syne font-semibold text-lg text-foreground">
                Midnight Lace Wallet
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-muted-foreground hover:text-foreground transition-all"
            >
              <X size={16} />
            </button>
          </div>

          {/* Extension Detection Badge */}
          <div className="mt-4 p-3 rounded-2xl bg-slate-900/80 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className={`size-2 rounded-full ${hasExtension ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'}`} />
              <span className="text-foreground">
                {hasExtension ? 'Lace Extension Detected' : 'Preprod Testnet Mode'}
              </span>
            </div>
            {!hasExtension && (
              <a
                href="https://www.lace.io"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>Get Extension</span>
                <ExternalLink size={10} />
              </a>
            )}
          </div>

          {/* Connection Status Card */}
          <div className="mt-4 p-5 rounded-2xl bg-slate-900/90 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">NETWORK:</span>
                <span className="text-xs font-mono font-bold text-cyan-400">Midnight Preprod</span>
              </div>
              <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-medium ${
                wallet.isConnected ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
              }`}>
                {wallet.isConnected ? 'CONNECTED' : 'DISCONNECTED'}
              </span>
            </div>

            {/* Public Address */}
            <div className="mt-3">
              <div className="text-[10px] font-mono text-muted-foreground uppercase">Unshielded Address</div>
              <div className="flex items-center justify-between mt-1 p-2.5 rounded-xl bg-slate-950/70 font-mono text-xs">
                <span className="text-foreground truncate mr-2">{wallet.address}</span>
                <button
                  onClick={() => copyToClipboard(wallet.address, "addr")}
                  className="text-muted-foreground hover:text-foreground shrink-0"
                >
                  {copiedKey === "addr" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                </button>
              </div>
            </div>

            {/* Shielded Address */}
            <div className="mt-3">
              <div className="text-[10px] font-mono text-muted-foreground uppercase flex items-center gap-1">
                <Shield size={11} className="text-purple-400" />
                <span>Shielded Enclave Address</span>
              </div>
              <div className="flex items-center justify-between mt-1 p-2.5 rounded-xl bg-slate-950/70 font-mono text-xs">
                <span className="text-purple-300 truncate mr-2">{wallet.shieldedAddress}</span>
                <button
                  onClick={() => copyToClipboard(wallet.shieldedAddress, "shield")}
                  className="text-muted-foreground hover:text-foreground shrink-0"
                >
                  {copiedKey === "shield" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                </button>
              </div>
            </div>

            {/* Connect / Reconnect Button if needed */}
            {!wallet.isConnected && (
              <button
                onClick={handleConnectClick}
                disabled={isConnecting}
                className="mt-4 w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <Zap size={14} />
                <span>{isConnecting ? 'Connecting Lace...' : 'Connect Lace Extension'}</span>
              </button>
            )}
          </div>

          {/* DUST & NIGHT Reserves */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-slate-900/95 shadow-md">
              <div className="text-[10px] font-mono text-muted-foreground">DUST BALANCE</div>
              <div className="text-lg font-mono font-bold text-emerald-400 mt-0.5">
                {wallet.dustBalance.toLocaleString()}
              </div>
              <div className="text-[9px] text-muted-foreground">Zero Gas Gas Fuel</div>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900/90 to-slate-900/95 shadow-md">
              <div className="text-[10px] font-mono text-muted-foreground">STAKED NIGHT</div>
              <div className="text-lg font-mono font-bold text-purple-400 mt-0.5">
                {wallet.nightBalance.toLocaleString()}
              </div>
              <div className="text-[9px] text-muted-foreground">Governance Asset</div>
            </div>
          </div>

          {/* Token Balances List */}
          <div className="mt-5">
            <div className="text-xs font-mono text-muted-foreground uppercase mb-2">Available Token Balances</div>
            <div className="space-y-2">
              {Object.entries(wallet.tokenBalances).map(([token, balance]) => (
                <div
                  key={token}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-900 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="size-7 rounded-full bg-slate-950 flex items-center justify-center text-xs font-bold font-mono">
                      {token === "USDC" ? "💵" : token === "USDT" ? "💲" : token === "ETH" ? "🔷" : token === "SOL" ? "🟣" : "🔵"}
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-foreground">{token}</div>
                      <div className="text-[10px] text-muted-foreground">Multi-Chain Asset</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-foreground">{balance.toLocaleString()}</div>
                    <button
                      onClick={() => onFaucet(token, 100)}
                      className="text-[10px] font-mono text-cyan-400 hover:underline"
                    >
                      + Faucet
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-5 border-t border-white/[0.06] flex items-center gap-3">
          {wallet.isConnected ? (
            <button
              onClick={onDisconnect}
              className="flex-1 py-2.5 px-4 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Power size={13} />
              <span>Disconnect</span>
            </button>
          ) : (
            <button
              onClick={handleConnectClick}
              disabled={isConnecting}
              className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <Zap size={13} />
              <span>{isConnecting ? 'Connecting...' : 'Connect'}</span>
            </button>
          )}
          <button
            onClick={() => {
              onClose();
              if (onOpenExplorer) {
                onOpenExplorer();
              }
            }}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-foreground text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <ExternalLink size={13} />
            <span>Explorer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
