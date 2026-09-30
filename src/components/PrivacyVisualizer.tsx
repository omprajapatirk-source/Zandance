import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, Lock, Unlock, Zap, Terminal, Code2, Cpu, CheckCircle2, ShieldAlert, ArrowRight, Copy, Check } from 'lucide-react';
import { GaslessIntent } from '../types';

interface PrivacyVisualizerProps {
  latestIntent: GaslessIntent | null;
}

export const PrivacyVisualizer: React.FC<PrivacyVisualizerProps> = ({ latestIntent }) => {
  const [activeView, setActiveView] = useState<'matrix' | 'zkir-bytecode' | 'compact-spec'>('matrix');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(id);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const demoIntent = latestIntent || {
    id: 'int_demo_77',
    intentHash: '0x9a8f4c2e5b7190d3a6c8e54721bf901ea2b4c810d7e635ab921c459e0a12f384',
    txHash: '0x8a2a67e1505d4eccab980c9f6a80a62e88bc363e93a97f89c26f1af3ae3bf5e7',
    proofHex: '0xzkproof_snark_9f81a7b420e9817cd842901a5e4b7890',
    feeToken: 'USDC',
    quotedFee: 1.4,
    dustEquivalent: 35000,
    amount: 150,
    sourceChain: 'polygon',
    targetChain: 'midnight-preprod',
    status: 'settled',
    timestamp: Date.now()
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 via-slate-900/95 to-slate-950 border border-white/[0.08] backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-2">
              <ShieldCheck size={14} />
              <span>CRYPTOGRAPHIC ENCLAVE &amp; ZK PROVER</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold font-syne text-foreground tracking-tight">
              Observable Privacy &amp; ZK Circuit Inspector
            </h2>
            <p className="text-xs sm:text-sm font-space text-muted-foreground mt-1 max-w-2xl leading-relaxed">
              Verify the strict mathematical boundary between off-chain private witnesses and public ledger disclosures on Midnight Preprod.
            </p>
          </div>

          {/* View Mode Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/80 border border-white/[0.06] backdrop-blur-md self-start md:self-auto">
            <button
              onClick={() => setActiveView('matrix')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                activeView === 'matrix'
                  ? 'bg-foreground text-background shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Eye size={13} />
              <span>Dual Matrix View</span>
            </button>
            <button
              onClick={() => setActiveView('zkir-bytecode')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                activeView === 'zkir-bytecode'
                  ? 'bg-foreground text-background shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Cpu size={13} />
              <span>ZKIR Bytecode</span>
            </button>
            <button
              onClick={() => setActiveView('compact-spec')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                activeView === 'compact-spec'
                  ? 'bg-foreground text-background shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Code2 size={13} />
              <span>Compact disclose()</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Dual Matrix Visualizer */}
      {activeView === 'matrix' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative items-stretch">
          {/* Left Enclave: Private Witness (RAM Only) */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-purple-950/40 via-slate-900/90 to-slate-950 border border-purple-500/20 backdrop-blur-xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                    <Lock size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold block">
                      OFF-CHAIN PRIVATE WITNESS
                    </span>
                    <span className="text-[11px] text-muted-foreground font-space">
                      Client-Side Browser RAM Only
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-semibold">
                  ENCLAVE SECURE
                </span>
              </div>

              <div className="space-y-3.5">
                {/* Private Field 1 */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-purple-500/10 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-purple-300">
                    <span>1. SENDER SECRET KEY [getSenderSecret()]</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">Hidden</span>
                  </div>
                  <div className="text-xs font-mono text-foreground font-semibold bg-slate-900/80 px-3 py-2 rounded-xl border border-white/[0.04]">
                    0x7f4e91...8c201a (MASKED IN RAM · ZERO LEAKAGE)
                  </div>
                  <p className="text-[11px] font-space text-muted-foreground leading-normal">
                    Evaluated inside client WASM PLONK constraints. Never transmitted over network or RPC.
                  </p>
                </div>

                {/* Private Field 2 */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-purple-500/10 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-purple-300">
                    <span>2. SHIELDED ASSET BALANCE [getShieldedBalance()]</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">Confidential</span>
                  </div>
                  <div className="text-xs font-mono text-foreground font-semibold bg-slate-900/80 px-3 py-2 rounded-xl border border-white/[0.04]">
                    420,000 DUST EQUIV (CONFIDENTIAL)
                  </div>
                  <p className="text-[11px] font-space text-muted-foreground leading-normal">
                    Proves <code className="text-purple-300">Balance &gt;= Required Fee</code> without revealing total wallet holdings.
                  </p>
                </div>

                {/* Private Field 3 */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-purple-500/10 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-purple-300">
                    <span>3. CONFIDENTIAL INTENT PAYLOAD [getIntentPayload()]</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">Encrypted</span>
                  </div>
                  <div className="text-xs font-mono text-foreground font-semibold bg-slate-900/80 px-3 py-2 rounded-xl border border-white/[0.04]">
                    &#123; asset: &quot;{demoIntent.feeToken}&quot;, amount: {demoIntent.amount}, recipient: &quot;0279...&quot; &#125;
                  </div>
                  <p className="text-[11px] font-space text-muted-foreground leading-normal">
                    Transaction parameters are hashed locally with cryptographic salt prior to disclosure.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/20 flex items-center gap-3">
              <ShieldCheck size={18} className="text-purple-400 shrink-0" />
              <div className="text-xs font-space text-purple-200 leading-normal">
                <strong className="text-foreground">Zero-Knowledge Boundary:</strong> No relayer or validator can view or decrypt these off-chain values.
              </div>
            </div>
          </div>

          {/* Right Enclave: Public Ledger Commitments */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-slate-900/90 to-slate-950 border border-cyan-500/20 backdrop-blur-xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Eye size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold block">
                      ON-CHAIN PUBLIC LEDGER
                    </span>
                    <span className="text-[11px] text-muted-foreground font-space">
                      Midnight Preprod State
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-mono font-semibold">
                  BLOCK #1428940
                </span>
              </div>

              <div className="space-y-3.5">
                {/* Public Field 1 */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-cyan-500/10 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-cyan-300">
                    <span>1. INTENT COMMITMENT HASH [disclose(intentHash)]</span>
                    <button
                      onClick={() => copyText(demoIntent.intentHash, 'intentHash')}
                      className="text-muted-foreground hover:text-cyan-400 transition-colors"
                      title="Copy Hash"
                    >
                      {copiedField === 'intentHash' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    </button>
                  </div>
                  <div className="text-xs font-mono text-cyan-400 font-semibold bg-slate-900/80 px-3 py-2 rounded-xl border border-white/[0.04] break-all">
                    {demoIntent.intentHash}
                  </div>
                  <p className="text-[11px] font-space text-muted-foreground leading-normal">
                    SHA-256 pre-image digest. Prevents front-running and intent parameter tampering.
                  </p>
                </div>

                {/* Public Field 2 */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-cyan-500/10 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-cyan-300">
                    <span>2. DUST SPONSORSHIP CEILING [disclose(maxFee)]</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">Sponsored</span>
                  </div>
                  <div className="text-xs font-mono text-emerald-400 font-semibold bg-slate-900/80 px-3 py-2 rounded-xl border border-white/[0.04]">
                    {demoIntent.dustEquivalent.toLocaleString()} DUST (~${demoIntent.quotedFee.toFixed(2)})
                  </div>
                  <p className="text-[11px] font-space text-muted-foreground leading-normal">
                    Publicly authorizes the maximum DUST amount deducted from the liquidity pool.
                  </p>
                </div>

                {/* Public Field 3 */}
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-cyan-500/10 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-mono text-cyan-300">
                    <span>3. ON-CHAIN NULLIFIER RECORD [settledIntents]</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">Protected</span>
                  </div>
                  <div className="text-xs font-mono text-foreground font-semibold bg-slate-900/80 px-3 py-2 rounded-xl border border-white/[0.04]">
                    SETTLED = TRUE (REPLAY ATTACK REJECTED)
                  </div>
                  <p className="text-[11px] font-space text-muted-foreground leading-normal">
                    Deterministic nullifier prevents any intent from being executed or sponsored twice.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 p-3.5 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 flex items-center gap-3">
              <CheckCircle2 size={18} className="text-cyan-400 shrink-0" />
              <div className="text-xs font-space text-cyan-200 leading-normal">
                <strong className="text-foreground">Public State:</strong> Verifiable by any validator on Midnight Preprod without exposing sender identity.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ZKIR Bytecode View */}
      {activeView === 'zkir-bytecode' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-white/[0.08] backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold">
              <Terminal size={15} />
              <span>ZKIR (Zero-Knowledge Intermediate Representation) Opcode Trace</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              100% Constraints Satisfied
            </span>
          </div>

          <pre className="p-5 rounded-2xl bg-slate-900/80 border border-white/[0.04] font-mono text-xs text-foreground overflow-x-auto leading-relaxed">
{`// ZKIR Circuit: sponsorFeeIntent.zkir
// Target: PLONK constraint system over BLS12-381 scalar field

func sponsorFeeIntent(
    witness userSecret: [32]u8,
    witness shieldedBalance: u64,
    witness intentPayload: [64]u8,
    public intentHash: [32]u8,
    public maxFee: u64
) {
    // 1. Assert balance sufficiency in zero knowledge
    assert(shieldedBalance >= maxFee);

    // 2. Compute cryptographic commitment hash
    let computedDigest = sha256_combine(userSecret, intentPayload);
    assert(computedDigest == intentHash);

    // 3. Selective disclose public outputs to ledger
    disclose(intentHash);
    disclose(maxFee);
}
// Status: 100% Constraints Satisfied · 0 Bits of Witness Leaked`}
          </pre>
        </div>
      )}

      {/* Compact Spec View */}
      {activeView === 'compact-spec' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-white/[0.08] backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-semibold">
              <Code2 size={15} />
              <span>Midnight Compact Contract: contracts/zandance_router.compact</span>
            </div>
            <span className="text-[11px] font-mono text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
              compactc v0.24.1
            </span>
          </div>

          <pre className="p-5 rounded-2xl bg-slate-900/80 border border-white/[0.04] font-mono text-xs text-foreground overflow-x-auto leading-relaxed">
{`export circuit sponsorFeeIntent(
    witness senderSecret: Bytes<32>,
    witness intentPayload: Bytes<64>,
    witness shieldedBalance: Uint<64>,
    intentHash: Bytes<32>,
    maxFee: Uint<64>
): [] {
    assert(shieldedBalance >= maxFee, "Insufficient shielded funds");
    assert(dustPoolReserve >= maxFee, "Insufficient DUST liquidity pool reserve");
    
    // Explicit disclosure to public ledger
    intentCommitments.insert(disclose(intentHash), disclose(maxFee));
    dustPoolReserve = dustPoolReserve - maxFee;
    totalSponsoredTransactions = totalSponsoredTransactions + 1;
}`}
          </pre>
        </div>
      )}
    </div>
  );
};
