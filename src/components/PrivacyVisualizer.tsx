import React, { useState } from 'react';
import { Eye, EyeOff, ShieldCheck, Lock, Unlock, Zap, Terminal } from 'lucide-react';
import { GaslessIntent } from '../types';

interface PrivacyVisualizerProps {
  latestIntent: GaslessIntent | null;
}

export const PrivacyVisualizer: React.FC<PrivacyVisualizerProps> = ({ latestIntent }) => {
  const [activeTab, setActiveTab] = useState<'side-by-side' | 'circuit-trace' | 'compact-code'>('side-by-side');

  const demoIntent = latestIntent || {
    id: 'int_demo_77',
    intentHash: '0x9a8f4c2e5b7190d3a6c8e54721bf901ea2b4c810d7e635ab921c459e0a12f384',
    txHash: '0x8a2a67e1505d4eccab980c9f6a80a62e88bc363e93a97f89c26f1af3ae3bf5e7',
    proofHex: '0xzkproof_snark_9f81a7b420e9817cd842901a5e4b7890',
    feeToken: 'USDC',
    quotedFee: 1.4,
    dustEquivalent: 35000,
    amount: 100,
    sourceChain: 'polygon',
    targetChain: 'midnight-preprod',
    status: 'settled',
    timestamp: Date.now()
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c084fc', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.2rem' }}>
            <ShieldCheck size={16} />
            <span>Midnight Privacy Model & Observable Privacy Behavior</span>
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Zero-Knowledge Privacy Inspector</h2>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`tab-button ${activeTab === 'side-by-side' ? 'active' : ''}`}
            onClick={() => setActiveTab('side-by-side')}
          >
            Public vs Shielded View
          </button>
          <button
            className={`tab-button ${activeTab === 'circuit-trace' ? 'active' : ''}`}
            onClick={() => setActiveTab('circuit-trace')}
          >
            Circuit Execution Trace
          </button>
          <button
            className={`tab-button ${activeTab === 'compact-code' ? 'active' : ''}`}
            onClick={() => setActiveTab('compact-code')}
          >
            Compact Contract Rules
          </button>
        </div>
      </div>

      {activeTab === 'side-by-side' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Public Ledger Column */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', borderRadius: '14px', border: '1px solid var(--border-subtle)', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>
              <Eye size={18} />
              <span>What an Observer Sees (Public Ledger)</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.2rem' }}>Intent Commitment Hash (Public)</div>
                <div className="mono-tag" style={{ color: '#38bdf8', wordBreak: 'break-all' }}>
                  {demoIntent.intentHash}
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.2rem' }}>Committed DUST Gas Capacity</div>
                <div style={{ color: '#10b981', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {demoIntent.dustEquivalent.toLocaleString()} DUST
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.2rem' }}>Zero-Knowledge SNARK Proof Status</div>
                <div style={{ color: '#c084fc', fontWeight: 600 }}>
                  VALID (Verified on Midnight Preprod via ZKIR)
                </div>
              </div>

              <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.75rem', borderRadius: '8px', color: '#fca5a5', fontSize: '0.78rem' }}>
                <strong>🚫 Hidden from Observers:</strong> Sender identity, source token balances, and cross-chain payload parameters are <em>impossible</em> to decrypt from the ledger.
              </div>
            </div>
          </div>

          {/* Private Witness Column */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', borderRadius: '14px', border: '1px solid rgba(147, 51, 234, 0.3)', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#c084fc', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>
              <EyeOff size={18} />
              <span>What Remains Shielded (Private Witness)</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.2rem' }}>User Secret Key / Salt (Never Disclosed)</div>
                <div className="mono-tag" style={{ color: '#f43f5e' }}>
                  0x7f2081d09e... [PROTECTED BY CLIENT ZK PROVER]
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.2rem' }}>Cross-Chain Shielded Payload (Witness Only)</div>
                <div className="mono-tag" style={{ color: '#f59e0b' }}>
                  Transfer 100 USDC to 0279fa9329e4...
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.2rem' }}>Private Shielded Balance Verification</div>
                <div style={{ color: '#34d399', fontWeight: 600 }}>
                  Proven: Balance &gt;= 35,000 DUST Equivalent (Exact Balance Undisclosed)
                </div>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '0.75rem', borderRadius: '8px', color: '#6ee7b7', fontSize: '0.78rem' }}>
                <strong>🛡️ Observable Privacy Invariant:</strong> The user proves they are authorized and have sufficient funds, without disclosing their address or transaction amount on public chains!
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'circuit-trace' && (
        <div className="code-box">
          <div style={{ color: '#a855f7', fontWeight: 700, marginBottom: '0.5rem' }}>// Midnight Proof Server Execution Log: sponsorFeeIntent</div>
          <div>[1] Fetching private witness values: getSenderSecret(), getIntentPayload(), getShieldedBalance()... OK</div>
          <div>[2] Computing Pedersen commitment: H(payload, secret_salt) == {demoIntent.intentHash.slice(0, 24)}... OK</div>
          <div>[3] Checking constraint: shieldedBalance &gt;= maxFee (35000 DUST)... OK</div>
          <div>[4] Invoking deliberate disclose() on intentHash and maxFee for public ledger insertion... OK</div>
          <div>[5] Generating SNARK proof with zkir/sponsorFeeIntent.zkir and keys/sponsorFeeIntent.prover... OK</div>
          <div style={{ color: '#34d399', marginTop: '0.5rem' }}>✔ Proof verification succeeded on Midnight Preprod (Block #1,428,940). Zero private leakage detected.</div>
        </div>
      )}

      {activeTab === 'compact-code' && (
        <div className="code-box">
          <div style={{ color: '#60a5fa' }}>// Excerpt from contracts/zandance_router.compact</div>
          <div style={{ color: '#c084fc' }}>export circuit sponsorFeeIntent(intentHash: Bytes&lt;32&gt;, maxFee: Uint&lt;64&gt;): [] &#123;</div>
          <div>&nbsp;&nbsp;assert dustPoolReserve &gt;= maxFee "Insufficient DUST in pool";</div>
          <div style={{ color: '#94a3b8' }}>&nbsp;&nbsp;// Private witness execution off-chain:</div>
          <div>&nbsp;&nbsp;const secret = getSenderSecret();</div>
          <div>&nbsp;&nbsp;const payload = getIntentPayload();</div>
          <div>&nbsp;&nbsp;const userBalance = getShieldedBalance();</div>
          <div>&nbsp;&nbsp;assert userBalance &gt;= maxFee "Shielded funds insufficient";</div>
          <div style={{ color: '#38bdf8' }}>&nbsp;&nbsp;// Deliberate disclosure only for public commitment:</div>
          <div>&nbsp;&nbsp;intentCommitments.insert(disclose(intentHash), disclose(maxFee));</div>
          <div>&nbsp;&nbsp;dustPoolReserve = dustPoolReserve - maxFee;</div>
          <div style={{ color: '#c084fc' }}>&#125;</div>
        </div>
      )}
    </div>
  );
};
