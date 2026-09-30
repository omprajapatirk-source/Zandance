import React, { useState } from 'react';
import { 
  ArrowRight, ShieldCheck, Zap, Layers, Lock, Droplets, CheckCircle2, 
  Cpu, Globe, Sparkles 
} from 'lucide-react';

interface CrossChainRouteMapProps {
  sourceChain?: string;
  asset?: string;
  feeToken?: string;
}

export const CrossChainRouteMap: React.FC<CrossChainRouteMapProps> = ({
  sourceChain = 'polygon',
  asset = 'USDC',
  feeToken = 'USDC',
}) => {
  const [activeStep, setActiveStep] = useState<number>(2);

  const steps = [
    {
      id: 1,
      title: '1. Source Deposit',
      subtitle: `${sourceChain.toUpperCase()} Network`,
      desc: `User locks ${asset} on ${sourceChain} and signs fee intent using ${feeToken}.`,
      badge: 'Zero Native Gas',
      badgeColor: 'text-cyan-400 bg-cyan-500/20',
      icon: <Lock size={15} className="text-cyan-400" />,
      glowColor: 'shadow-cyan-500/20 text-cyan-400',
      bgGradient: 'bg-gradient-to-br from-cyan-950/50 via-slate-900/90 to-slate-950',
    },
    {
      id: 2,
      title: '2. ZK Witness in RAM',
      subtitle: 'Browser PLONK Enclave',
      desc: 'Secret key, balances, and payload hashed off-chain with 0% data leakage.',
      badge: '18ms WASM Prover',
      badgeColor: 'text-purple-300 bg-purple-500/20',
      icon: <Cpu size={15} className="text-purple-400" />,
      glowColor: 'shadow-purple-500/20 text-purple-400',
      bgGradient: 'bg-gradient-to-br from-purple-950/50 via-slate-900/90 to-slate-950',
    },
    {
      id: 3,
      title: '3. Relayer Sponsorship',
      subtitle: 'Midnight DUST Pool',
      desc: 'Decentralized solvers sponsor network DUST without seeing your private identity.',
      badge: '994M DUST Liquid',
      badgeColor: 'text-emerald-300 bg-emerald-500/20',
      icon: <Zap size={15} className="text-emerald-400" />,
      glowColor: 'shadow-emerald-500/20 text-emerald-400',
      bgGradient: 'bg-gradient-to-br from-emerald-950/50 via-slate-900/90 to-slate-950',
    },
    {
      id: 4,
      title: '4. Preprod Settlement',
      subtitle: 'Contract c16f00...07ec',
      desc: 'Transaction committed on Midnight ledger. Nullifier registered & replay protected.',
      badge: 'Verified On-Chain',
      badgeColor: 'text-indigo-300 bg-indigo-500/20',
      icon: <ShieldCheck size={15} className="text-indigo-400" />,
      glowColor: 'shadow-indigo-500/20 text-indigo-400',
      bgGradient: 'bg-gradient-to-br from-indigo-950/50 via-slate-900/90 to-slate-950',
    },
  ];

  return (
    <div className="w-full p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 backdrop-blur-2xl shadow-2xl space-y-5">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.04]">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400 shadow-inner">
            <Globe size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-foreground font-bold">
                INTERACTIVE CROSS-CHAIN ROUTE MAP
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-300 font-bold">
                LIVE VISUALIZER
              </span>
            </div>
            <span className="text-xs text-muted-foreground font-space">
              Complete zero-knowledge solver &amp; DUST fee abstraction pipeline
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 shadow-md">
          <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-emerald-400 font-semibold">
            14 Active Relayers Online
          </span>
        </div>
      </div>

      {/* 4-Node Interactive Diagram with Rich Jewel-Tone Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 relative">
        {steps.map((step, idx) => {
          const isSelected = activeStep === step.id;
          return (
            <div
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`p-4 sm:p-5 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-3 ${step.bgGradient} ${
                isSelected
                  ? `shadow-2xl ${step.glowColor} -translate-y-1 ring-1 ring-white/10`
                  : 'hover:-translate-y-0.5 hover:shadow-lg opacity-90 hover:opacity-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 ${step.badgeColor}`}>
                    {step.icon}
                    <span>{step.badge}</span>
                  </span>
                  <span className="text-xs font-mono text-muted-foreground font-bold">
                    STEP 0{step.id}
                  </span>
                </div>

                <h4 className="text-sm font-bold font-syne text-foreground tracking-tight">
                  {step.title}
                </h4>
                <div className="text-[11px] font-mono font-medium mb-1.5 opacity-90">
                  {step.subtitle}
                </div>
                <p className="text-xs font-space text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span className={isSelected ? 'text-cyan-400 font-bold' : ''}>
                  {isSelected ? '● Active Step' : 'Click to inspect'}
                </span>
                {idx < steps.length - 1 && (
                  <ArrowRight size={13} className="hidden lg:block text-muted-foreground/40" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
