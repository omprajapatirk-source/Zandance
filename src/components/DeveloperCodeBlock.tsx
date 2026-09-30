import React, { useState } from 'react';
import { Copy, Check, Terminal, Code2, Cpu, Sliders, Sparkles, Download, ArrowRight } from 'lucide-react';

export const DeveloperCodeBlock: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sdk' | 'compact' | 'relayer'>('sdk');
  const [selectedToken, setSelectedToken] = useState('USDC');
  const [amount, setAmount] = useState('250');
  const [sourceChain, setSourceChain] = useState('polygon');
  const [copied, setCopied] = useState(false);
  const [copiedNpm, setCopiedNpm] = useState(false);

  const getCodeSnippet = () => {
    if (activeTab === 'sdk') {
      return `// 📦 Install: npm install @zandance/sdk
import { ZandanceClient } from '@zandance/sdk';

// 1. Initialize Midnight Preprod zero-gas client
const client = new ZandanceClient({ 
  network: 'midnight-preprod',
  contractAddress: 'c16f00430277712f9470c4b4cc5ed31f3c3e6dab6bb815d50c4a82cca607ec'
});

// 2. Execute Zero-Knowledge gasless transfer
const receipt = await client.executeGaslessTransfer({
  sourceChain: '${sourceChain}',
  asset: '${selectedToken}',
  amount: ${amount},
  feeToken: '${selectedToken}', // Pay fee in ${selectedToken} (No native DUST/NIGHT needed!)
  recipient: '0289fd103a74ef9081bcde541289ae301824ab8912efc4019a8234bc8912304f'
});

console.log('✅ Settled Tx Hash:', receipt.txHash);
console.log('🛡️ Intent Commitment:', receipt.intentHash);
console.log('⛽ Gas Paid by User: $0.00');`;
    }

    if (activeTab === 'compact') {
      return `// 📜 contracts/zandance_router.compact (Midnight Network v0.24)
pragma language_version >= 0.23;
import CompactStandardLibrary;

export ledger dustPoolReserve: Uint<64>;
export ledger intentCommitments: Map<Bytes<32>, Uint<64>>;

// Zero-Knowledge Circuit for ${selectedToken} Fee Sponsorship
export circuit sponsorFeeIntent(
  witness senderSecret: Bytes<32>,
  witness intentPayload: Bytes<64>,
  witness shieldedBalance: Uint<64>,
  intentHash: Bytes<32>,
  maxFee: Uint<64>
): [] {
  // 1. Enforce witness constraint in client RAM
  assert(shieldedBalance >= maxFee, "Insufficient shielded funds");
  assert(dustPoolReserve >= maxFee, "Insufficient DUST pool reserve");
  
  // 2. Disclose only blind commitment to public ledger
  intentCommitments.insert(disclose(intentHash), disclose(maxFee));
  dustPoolReserve = dustPoolReserve - maxFee;
}`;
    }

    return `// ⚡ Relayer Solver JSON-RPC POST /api/v1/relayer/sponsor-intent
POST https://rpc.preprod.midnight.network/v1/sponsor
Headers: { "Authorization": "Bearer RELAYER_API_KEY", "Content-Type": "application/json" }

Request Payload:
{
  "sourceChain": "${sourceChain}",
  "asset": "${selectedToken}",
  "amount": ${amount},
  "feeToken": "${selectedToken}",
  "dustSponsored": ${(parseInt(amount, 10) || 100) * 140},
  "intentHash": "0x9a8f4c2e5b7190d3a6c8e54721bf901ea2b4c810d7e635ab921c459e0a12f384"
}

Response 200 OK:
{
  "status": "settled",
  "blockHeight": 1428940,
  "relayerAddress": "025c276e4ee2938b9ded19e9ae2e70181f97009f641b68bfe2f4ee6104ed0a5b",
  "txHash": "0x8a2a67e1505d4eccab980c9f6a80a62e88bc363e93a97f89c26f1af3ae3bf5e7"
}`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyNpm = () => {
    navigator.clipboard.writeText('npm install @zandance/sdk');
    setCopiedNpm(true);
    setTimeout(() => setCopiedNpm(false), 2000);
  };

  return (
    <div className="w-full rounded-3xl bg-slate-900/90 border border-white/[0.08] backdrop-blur-2xl overflow-hidden shadow-2xl space-y-0">
      {/* Interactive Parameter Controls */}
      <div className="p-4 sm:p-5 border-b border-white/[0.06] bg-slate-950/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
            <Sliders size={13} className="text-cyan-400" />
            <span>Interactive Sandbox:</span>
          </div>

          {/* Token Selector */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-900 border border-white/[0.06]">
            {['USDC', 'USDT', 'ETH', 'NIGHT', 'ADA'].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedToken(t)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-mono transition-all ${
                  selectedToken === t ? 'bg-foreground text-background font-bold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Amount Selector */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-900 border border-white/[0.06]">
            {['100', '250', '1000'].map((a) => (
              <button
                key={a}
                onClick={() => setAmount(a)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-mono transition-all ${
                  amount === a ? 'bg-foreground text-background font-bold' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* NPM Command */}
        <button
          onClick={handleCopyNpm}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/[0.06] text-xs font-mono text-cyan-300 transition-all shadow-sm"
        >
          <span>npm i @zandance/sdk</span>
          {copiedNpm ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
        </button>
      </div>

      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-slate-950/60">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-red-500/80" />
            <span className="size-2.5 rounded-full bg-amber-500/80" />
            <span className="size-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="h-4 w-[1px] bg-white/[0.08] mx-2" />
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('sdk')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                activeTab === 'sdk'
                  ? 'bg-slate-900 text-cyan-400 font-bold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              TypeScript SDK
            </button>
            <button
              onClick={() => setActiveTab('compact')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                activeTab === 'compact'
                  ? 'bg-slate-900 text-cyan-400 font-bold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Compact Circuit
            </button>
            <button
              onClick={() => setActiveTab('relayer')}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                activeTab === 'relayer'
                  ? 'bg-slate-900 text-cyan-400 font-bold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Relayer API
            </button>
          </div>
        </div>

        <button
          onClick={handleCopyCode}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-mono text-muted-foreground hover:text-foreground transition-all shadow-sm"
        >
          {copied ? (
            <>
              <Check size={13} className="text-emerald-400" />
              <span className="text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <div className="p-5 sm:p-7 overflow-x-auto font-mono text-xs sm:text-sm text-foreground/90 leading-relaxed bg-slate-950/40">
        <pre className="selection:bg-cyan-500/30 selection:text-cyan-200">
          <code>{getCodeSnippet()}</code>
        </pre>
      </div>
    </div>
  );
};
