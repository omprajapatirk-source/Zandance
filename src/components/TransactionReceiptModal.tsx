import React, { useState } from 'react';
import { 
  X, ShieldCheck, CheckCircle2, Copy, Check, ExternalLink, 
  Share2, ArrowRight, Zap, Download, Sparkles 
} from 'lucide-react';
import { GaslessIntent } from '../types';

interface TransactionReceiptModalProps {
  intent: GaslessIntent | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenExplorer?: () => void;
}

export const TransactionReceiptModal: React.FC<TransactionReceiptModalProps> = ({
  intent,
  isOpen,
  onClose,
  onOpenExplorer,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !intent) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(id);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const tweetText = encodeURIComponent(
    `Just executed a zero-gas transfer of ${intent.amount} ${intent.asset} on @MidnightNtwrk with $0.00 gas via @ZandanceFi! 🌌⚡\n\nPrivacy-preserving fee abstraction powered by Zero-Knowledge proofs.\n\nTry it: https://zandance.vercel.app`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-950 border border-white/[0.1] shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-muted-foreground hover:text-foreground transition-all"
        >
          <X size={18} />
        </button>

        {/* Receipt Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="size-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="size-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <CheckCircle2 size={24} className="text-emerald-400" />
            </div>
          </div>

          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold uppercase tracking-wider">
            Settled &amp; Shielded
          </span>

          <h3 className="text-xl sm:text-2xl font-bold font-syne text-foreground tracking-tight">
            Gasless Transfer Receipt
          </h3>
          <p className="text-xs font-space text-muted-foreground">
            Midnight Preprod Zero-Knowledge Fee Sponsorship
          </p>
        </div>

        {/* Amount & Gas Card */}
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <span className="text-xs font-mono text-muted-foreground uppercase">Transferred Asset</span>
            <div className="text-right">
              <div className="text-lg font-mono font-bold text-foreground">
                {intent.amount} {intent.asset}
              </div>
              <div className="text-[11px] font-space text-muted-foreground">
                From {intent.sourceChain.toUpperCase()} ➔ MIDNIGHT
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <span className="text-xs font-mono text-muted-foreground uppercase">User Gas Paid</span>
            <div className="text-right">
              <div className="text-base font-mono font-bold text-emerald-400">
                $0.00 Gas
              </div>
              <div className="text-[10px] font-mono text-muted-foreground">
                100% Sponsored ({intent.dustEquivalent.toLocaleString()} DUST)
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-muted-foreground uppercase">ZK Privacy Guarantee</span>
            <span className="px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-500/25 text-purple-300 text-[10px] font-mono font-semibold flex items-center gap-1">
              <ShieldCheck size={12} />
              Zero Witness Leakage
            </span>
          </div>
        </div>

        {/* Cryptographic Hashes */}
        <div className="space-y-2.5 font-mono text-xs">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.04] space-y-1">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>DISCLOSED INTENT HASH:</span>
              <button
                onClick={() => copyToClipboard(intent.intentHash, 'intent')}
                className="hover:text-cyan-400 transition-colors"
              >
                {copiedField === 'intent' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
              </button>
            </div>
            <div className="text-[11px] text-cyan-400 truncate">{intent.intentHash}</div>
          </div>

          {intent.txHash && (
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.04] space-y-1">
              <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>ON-CHAIN RELAYER TX HASH:</span>
                <button
                  onClick={() => copyToClipboard(intent.txHash!, 'tx')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  {copiedField === 'tx' ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                </button>
              </div>
              <div className="text-[11px] text-foreground truncate">{intent.txHash}</div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
          <a
            href={`https://twitter.com/intent/tweet?text=${tweetText}`}
            target="_blank"
            rel="noreferrer"
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <Share2 size={13} />
            <span>Share on X</span>
          </a>

          {onOpenExplorer && (
            <button
              onClick={() => {
                onClose();
                onOpenExplorer();
              }}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-foreground text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all border border-white/[0.08]"
            >
              <ExternalLink size={13} />
              <span>View in Explorer</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
