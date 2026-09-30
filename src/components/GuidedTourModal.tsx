import React, { useState } from 'react';
import { 
  X, ChevronRight, ChevronLeft, Sparkles, Shield, Droplets, 
  Layers, Zap, CheckCircle2, Play, Compass, ArrowRight, ExternalLink 
} from 'lucide-react';

interface GuidedTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: 'router' | 'privacy' | 'pool' | 'explorer') => void;
  onOpenExplorerModal: () => void;
}

const TOUR_STEPS = [
  {
    step: 1,
    title: '1. Connect Lace Wallet (Enclave Ready)',
    badge: 'Step 1 of 4',
    tab: 'router' as const,
    icon: <Zap size={20} className="text-cyan-400" />,
    description: 'Zandance connects with Midnight Lace Browser Wallet via @midnight-ntwrk/dapp-connector-api. If Lace is not installed, it runs in an automatic Preprod Testnet simulated enclave.',
    actionLabel: 'Go to Fee Router',
    highlightTarget: 'Fee Router',
  },
  {
    step: 2,
    title: '2. Select Any Token for Zero Gas',
    badge: 'Step 2 of 4',
    tab: 'router' as const,
    icon: <Droplets size={20} className="text-emerald-400" />,
    description: 'Choose any multi-chain token (USDC, USDT, ETH, NIGHT, ADA) to pay transaction fees. Zandance automatically calculates the DUST conversion and sponsors 100% of user gas.',
    actionLabel: 'Try Transfer',
    highlightTarget: 'Zero-Gas Quote',
  },
  {
    step: 3,
    title: '3. Client-Side Zero-Knowledge Prover',
    badge: 'Step 3 of 4',
    tab: 'privacy' as const,
    icon: <Shield size={20} className="text-purple-400" />,
    description: 'Your sender key, shielded balance, and intent payload are computed exclusively inside your browser RAM via PLONK constraints. No relayers or public observers can see your confidential parameters.',
    actionLabel: 'Inspect Privacy Enclave',
    highlightTarget: 'Privacy Enclave',
  },
  {
    step: 4,
    title: '4. Verified Midnight Preprod Settlement',
    badge: 'Step 4 of 4',
    tab: 'explorer' as const,
    icon: <CheckCircle2 size={20} className="text-cyan-400" />,
    description: 'Transactions settle on Midnight Preprod Testnet at contract c16f00...07ec. Real-time explorers verify the mathematical commitment without revealing user identity.',
    actionLabel: 'Open Full Explorer',
    highlightTarget: 'Midnight Explorer',
  },
];

export const GuidedTourModal: React.FC<GuidedTourModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
  onOpenExplorerModal,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      onNavigateTab(TOUR_STEPS[nextIdx].tab);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      onNavigateTab(TOUR_STEPS[prevIdx].tab);
    }
  };

  const handleActionClick = () => {
    if (currentStep.step === 4) {
      onOpenExplorerModal();
    } else {
      onNavigateTab(currentStep.tab);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-950 border border-white/[0.1] shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-muted-foreground hover:text-foreground transition-all"
        >
          <X size={18} />
        </button>

        {/* Header Strip */}
        <div className="flex items-center justify-between pr-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono">
            <Compass size={13} />
            <span>Interactive Protocol Tour</span>
          </div>
          <span className="text-xs font-mono text-muted-foreground font-semibold">
            {currentStep.badge}
          </span>
        </div>

        {/* Step Content Card */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-white/[0.08] space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-white/[0.06] shadow-md">
              {currentStep.icon}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-syne text-foreground tracking-tight">
                {currentStep.title}
              </h3>
              <span className="text-[10px] font-mono text-cyan-400">
                Active Module: {currentStep.highlightTarget}
              </span>
            </div>
          </div>

          <p className="text-xs font-space text-muted-foreground leading-relaxed">
            {currentStep.description}
          </p>

          <button
            onClick={handleActionClick}
            className="w-full py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-white/[0.06] text-xs font-mono text-foreground flex items-center justify-center gap-1.5 transition-all"
          >
            <span>{currentStep.actionLabel}</span>
            <ArrowRight size={12} className="text-cyan-400" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="flex items-center justify-center gap-2">
          {TOUR_STEPS.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => {
                setCurrentStepIndex(idx);
                onNavigateTab(s.tab);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentStepIndex
                  ? 'w-8 bg-cyan-400 shadow-md shadow-cyan-400/30'
                  : 'w-2 bg-slate-800 hover:bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none text-foreground text-xs font-mono flex items-center gap-1.5 transition-all"
          >
            <ChevronLeft size={14} />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            className="py-2.5 px-5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-md"
          >
            <span>{currentStepIndex === TOUR_STEPS.length - 1 ? 'Finish Tour' : 'Next Step'}</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
