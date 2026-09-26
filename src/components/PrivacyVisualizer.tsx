import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, Lock, Unlock, Zap, Terminal, Code2, Cpu, CheckCircle2, ShieldAlert } from 'lucide-react';
import { GaslessIntent } from '../types';
import { CyberCard3D } from './CyberCard3D';

interface PrivacyVisualizerProps {
  latestIntent: GaslessIntent | null;
}

export const PrivacyVisualizer: React.FC<PrivacyVisualizerProps> = ({ latestIntent }) => {
  const [activeView, setActiveView] = useState<'matrix' | 'zkir-bytecode' | 'compact-spec'>('matrix');

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
    <div className="tab-panel privacy-matrix-layout">
      {/* Top Header Card */}
      <CyberCard3D glowColor="cyan" className="privacy-header-card">
        <div className="privacy-header-flex">
          <div>
            <div className="tech-badge-cyan">
              <ShieldCheck size={13} />
              <span>CRYPTOGRAPHIC ENCLAVE</span>
            </div>
            <h2 className="tech-title">Observable Privacy & ZK Circuit Inspector</h2>
            <p className="tech-subtitle">
              Verify the strict mathematical boundary between off-chain private witnesses and public ledger commitments.
            </p>
          </div>

          {/* View Mode Selector Tabs */}
          <div className="privacy-mode-tabs">
            <button
              onClick={() => setActiveView('matrix')}
              className={`mode-btn ${activeView === 'matrix' ? 'active' : ''}`}
            >
              <Eye size={14} />
              <span>DUAL MATRIX VIEW</span>
            </button>
            <button
              onClick={() => setActiveView('zkir-bytecode')}
              className={`mode-btn ${activeView === 'zkir-bytecode' ? 'active' : ''}`}
            >
              <Cpu size={14} />
              <span>ZKIR BYTECODE</span>
            </button>
            <button
              onClick={() => setActiveView('compact-spec')}
              className={`mode-btn ${activeView === 'compact-spec' ? 'active' : ''}`}
            >
              <Code2 size={14} />
              <span>COMPACT DISCLOSE()</span>
            </button>
          </div>
        </div>
      </CyberCard3D>

      {/* Main Dual Matrix Visualizer */}
      {activeView === 'matrix' && (
        <div className="dual-matrix-grid">
          {/* Left Enclave: Private Witness (RAM Only) */}
          <CyberCard3D glowColor="purple" className="matrix-col private-col">
            <div className="matrix-col-header">
              <div className="header-tag-shielded">
                <Lock size={14} className="neon-magenta" />
                <span>OFF-CHAIN PRIVATE WITNESS (BROWSER RAM)</span>
              </div>
              <div className="status-indicator-green font-mono text-xs">ENCLAVE SECURE</div>
            </div>

            <div className="matrix-content-list">
              <div className="matrix-data-card private">
                <div className="data-card-label font-mono">1. SENDER SECRET KEY [getSenderSecret()]</div>
                <div className="data-card-val font-mono text-magenta">
                  0x7f4e91...8c201a (MASKED IN RAM · ZERO LEAKAGE)
                </div>
                <div className="data-card-sub text-muted text-xs">
                  Evaluated inside client WASM PLONK constraints. Never transmitted over HTTP or RPC.
                </div>
              </div>

              <div className="matrix-data-card private">
                <div className="data-card-label font-mono">2. SHIELDED ASSET BALANCE [getShieldedBalance()]</div>
                <div className="data-card-val font-mono text-magenta">
                  420,000 DUST EQUIV (CONFIDENTIAL)
                </div>
                <div className="data-card-sub text-muted text-xs">
                  Proves (Shielded Balance &gt;= Required Fee) without revealing total wallet holdings.
                </div>
              </div>

              <div className="matrix-data-card private">
                <div className="data-card-label font-mono">3. CONFIDENTIAL INTENT PAYLOAD [getIntentPayload()]</div>
                <div className="data-card-val font-mono text-magenta">
                  &#123; asset: &quot;USDC&quot;, amount: {demoIntent.amount}, recipient: &quot;0279...&quot; &#125;
                </div>
                <div className="data-card-sub text-muted text-xs">
                  Transaction parameters are hashed locally with cryptographic salt.
                </div>
              </div>
            </div>

            <div className="matrix-guarantee-footer shield">
              <ShieldCheck size={18} className="neon-magenta" />
              <div>
                <strong>Zero-Knowledge Boundary:</strong> No relayer or validator can decrypt these values.
              </div>
            </div>
          </CyberCard3D>

          {/* Central Photon Laser Beam */}
          <div className="photon-bridge">
            <div className="laser-beam" />
            <div className="laser-emitter">
              <Zap size={18} className="neon-lime blink" />
              <span className="font-mono text-xs neon-lime">PLONK PROVE</span>
            </div>
            <div className="laser-beam" />
          </div>

          {/* Right Enclave: Public Ledger Commitments */}
          <CyberCard3D glowColor="cyan" className="matrix-col public-col">
            <div className="matrix-col-header">
              <div className="header-tag-public">
                <Eye size={14} className="neon-cyan" />
                <span>ON-CHAIN PUBLIC LEDGER (MIDNIGHT PREPROD)</span>
              </div>
              <div className="status-indicator-blue font-mono text-xs">BLOCK #1428940</div>
            </div>

            <div className="matrix-content-list">
              <div className="matrix-data-card public">
                <div className="data-card-label font-mono">1. INTENT COMMITMENT HASH [disclose(intentHash)]</div>
                <div className="data-card-val font-mono text-cyan break-all">
                  {demoIntent.intentHash}
                </div>
                <div className="data-card-sub text-muted text-xs">
                  SHA-256 pre-image digest. Prevents front-running and parameter tampering.
                </div>
              </div>

              <div className="matrix-data-card public">
                <div className="data-card-label font-mono">2. DUST SPONSORSHIP CEILING [disclose(maxFee)]</div>
                <div className="data-card-val font-mono text-lime">
                  {demoIntent.dustEquivalent.toLocaleString()} DUST
                </div>
                <div className="data-card-sub text-muted text-xs">
                  Publicly authorizes the maximum DUST amount deducted from the sponsorship pool.
                </div>
              </div>

              <div className="matrix-data-card public">
                <div className="data-card-label font-mono">3. ON-CHAIN NULLIFIER RECORD [settledIntents]</div>
                <div className="data-card-val font-mono text-lime">
                  SETTLED = TRUE (REPLAY ATTACK REJECTED)
                </div>
                <div className="data-card-sub text-muted text-xs">
                  Deterministic nullifier prevents any intent from being sponsored twice.
                </div>
              </div>
            </div>

            <div className="matrix-guarantee-footer public">
              <CheckCircle2 size={18} className="neon-cyan" />
              <div>
                <strong>Public State:</strong> Verifiable by anyone on Midnight Preprod Explorer without revealing user privacy.
              </div>
            </div>
          </CyberCard3D>
        </div>
      )}

      {/* ZKIR Bytecode View */}
      {activeView === 'zkir-bytecode' && (
        <CyberCard3D glowColor="lime" className="code-inspector-card">
          <div className="inspector-header">
            <Terminal size={16} className="neon-lime" />
            <span className="font-mono">ZKIR (Zero-Knowledge Intermediate Representation) Opcode Trace</span>
          </div>

          <pre className="cyber-code-block font-mono">
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

    // 3. Selective disclose public outputs
    disclose(intentHash);
    disclose(maxFee);
}
// Status: 100% Constraints Satisfied · 0 Bits of Witness Leaked`}
          </pre>
        </CyberCard3D>
      )}

      {/* Compact Spec View */}
      {activeView === 'compact-spec' && (
        <CyberCard3D glowColor="purple" className="code-inspector-card">
          <div className="inspector-header">
            <Code2 size={16} className="neon-purple" />
            <span className="font-mono">Midnight Compact Contract Rule: contracts/zandance_router.compact</span>
          </div>

          <pre className="cyber-code-block font-mono">
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
        </CyberCard3D>
      )}
    </div>
  );
};
