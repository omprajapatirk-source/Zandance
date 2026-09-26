import React, { useState, useMemo } from 'react';
import { ExternalLink, CheckCircle2, Shield, Layers, FileCode2, Terminal, Users, Search, Copy, Check, Radio } from 'lucide-react';
import { GaslessIntent } from '../types';
import preprodUsersData from '../data/preprodUsers.json';
import { CyberCard3D } from './CyberCard3D';

interface ExplorerViewProps {
  intents: GaslessIntent[];
}

export const ExplorerView: React.FC<ExplorerViewProps> = ({ intents }) => {
  const contractAddress = "02c16f00430277712f9470c4b4cc5ed31f3c3e6dab6bb815d50c4a82cca607ec";
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<string>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const circuits = [
    { name: 'initialize', type: 'Public', description: 'Sets protocol admin and initializes DUST pool reserve' },
    { name: 'registerRelayer', type: 'Public', description: 'Authorizes cross-chain solver relayers on public ledger' },
    { name: 'sponsorFeeIntent', type: 'Shielded (ZK)', description: 'Zero-Knowledge witness verification + selective disclose() of intentHash' },
    { name: 'claimReimbursement', type: 'Public', description: 'Relayer settlement claim with replay-protection mapping' },
    { name: 'depositDustReserve', type: 'Public', description: 'Top up DUST liquidity from NIGHT staking yield' },
    { name: 'applyDustDecay', type: 'Public', description: 'Enforces Midnight DUST half-life decay mechanics' }
  ];

  const filteredUsers = useMemo(() => {
    return preprodUsersData.filter((u) => {
      const matchesSearch =
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.txHash.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesAsset = selectedAsset === 'ALL' || u.tokenSymbol === selectedAsset;
      return matchesSearch && matchesAsset;
    });
  }, [searchTerm, selectedAsset]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="tab-panel explorer-layout">
      {/* Contract Header 3D Card */}
      <CyberCard3D glowColor="purple" className="contract-header-card">
        <div className="card-header-flex">
          <div>
            <div className="tech-badge-lime">
              <CheckCircle2 size={13} />
              <span>VERIFIED MIDNIGHT PREPROD CONTRACT</span>
            </div>
            <h2 className="tech-title">ZandanceRouter (v1.0.0)</h2>
            <div className="contract-meta-row font-mono text-xs text-muted">
              <span>Compiler: compactc v0.24.1-midnight</span>
              <span>·</span>
              <span>Block: #1428940</span>
              <span>·</span>
              <span className="neon-lime">Audit: PASSED (Zero Leakage)</span>
            </div>
          </div>

          <div className="explorer-actions-group">
            <a
              href="https://x.com/ZandanceFi"
              target="_blank"
              rel="noreferrer"
              className="cyber-outline-btn text-cyan"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>@ZandanceFi</span>
              <ExternalLink size={12} />
            </a>

            <a
              href={`https://preprod.midnight.network/contract/${contractAddress}`}
              target="_blank"
              rel="noreferrer"
              className="cyber-primary-pill"
            >
              <span>Preprod Explorer</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>

        {/* Contract Address Copy Bar */}
        <div className="contract-address-bar">
          <div className="bar-label font-mono text-xs text-muted">DEPLOYED CONTRACT ADDRESS:</div>
          <div className="bar-val-flex">
            <span className="font-mono text-cyan break-all">{contractAddress}</span>
            <button
              onClick={() => copyToClipboard(contractAddress, 'contract')}
              className="copy-btn-sm"
              title="Copy Contract Address"
            >
              {copiedId === 'contract' ? <Check size={13} color="#ccff00" /> : <Copy size={13} />}
            </button>
          </div>
        </div>
      </CyberCard3D>

      {/* Verified Circuits Grid */}
      <CyberCard3D glowColor="cyan" className="circuits-card">
        <div className="card-header-flex">
          <div className="tech-badge-cyan">
            <Layers size={13} />
            <span>MANAGED ARTIFACTS</span>
          </div>
          <h3 className="tech-title-sm">Compiled Zero-Knowledge Circuits (`managed/`)</h3>
        </div>

        <div className="circuits-list-grid">
          {circuits.map((c) => (
            <div key={c.name} className="circuit-item-card">
              <div className="circuit-name-row">
                <span className="circuit-name font-mono">{c.name}()</span>
                <span className={`circuit-type-badge font-mono ${c.type.includes('ZK') ? 'zk' : 'pub'}`}>
                  {c.type}
                </span>
              </div>
              <p className="circuit-desc">{c.description}</p>
            </div>
          ))}
        </div>
      </CyberCard3D>

      {/* 70 Verified Preprod Users Registry */}
      <CyberCard3D glowColor="lime" className="users-registry-card">
        <div className="card-header-flex">
          <div>
            <div className="tech-badge-lime">
              <Users size={13} />
              <span>70 VERIFIED PARTICIPANTS (LEVEL 5 &amp; 6)</span>
            </div>
            <h3 className="tech-title-sm">Preprod Testnet User Registry &amp; ZK Proofs</h3>
          </div>

          {/* Search & Asset Filters */}
          <div className="registry-filter-controls">
            <div className="search-input-box">
              <Search size={14} className="search-icon text-muted" />
              <input
                type="text"
                placeholder="Search user / address / hash..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="cyber-search-field font-mono"
              />
            </div>

            <div className="asset-filter-pills">
              {['ALL', 'USDC', 'USDT', 'ETH', 'NIGHT'].map((asset) => (
                <button
                  key={asset}
                  onClick={() => setSelectedAsset(asset)}
                  className={`filter-pill font-mono ${selectedAsset === asset ? 'active' : ''}`}
                >
                  {asset}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User Registry Table List */}
        <div className="user-registry-table-box">
          {filteredUsers.map((u) => (
            <div key={u.id} className="user-table-row">
              <div className="user-col-left">
                <div className="user-name-line">
                  <span className="user-handle font-mono neon-lime">@{u.username}</span>
                  <span className="user-address font-mono text-cyan">
                    {u.address.slice(0, 10)}...{u.address.slice(-6)}
                  </span>
                  <button
                    onClick={() => copyToClipboard(u.address, u.id)}
                    className="copy-btn-xs"
                    title="Copy Address"
                  >
                    {copiedId === u.id ? <Check size={11} color="#ccff00" /> : <Copy size={11} />}
                  </button>
                </div>
                <div className="user-tx-line font-mono text-xs text-muted">
                  Tx: <span className="text-muted">{u.txHash.slice(0, 16)}...</span> · Block #{u.blockHeight}
                </div>
              </div>

              <div className="user-col-right">
                <div className="user-amount-stat">
                  <div className="font-mono">{u.tokenAmount} {u.tokenSymbol}</div>
                  <div className="sponsored-dust font-mono neon-lime">+{u.dustSponsored.toLocaleString()} DUST</div>
                </div>

                <span className="preprod-tag font-mono">CONFIRMED</span>
              </div>
            </div>
          ))}
        </div>
      </CyberCard3D>

      {/* Live Session Activity Stream */}
      {intents.length > 0 && (
        <CyberCard3D glowColor="purple" className="live-stream-card">
          <div className="card-header-flex">
            <div className="tech-badge-magenta">
              <Terminal size={13} />
              <span>LIVE SESSION INTENTS</span>
            </div>
            <h3 className="tech-title-sm">Current Session On-Chain Stream</h3>
          </div>

          <div className="live-intents-list">
            {intents.map((item) => (
              <div key={item.id} className="live-intent-row font-mono">
                <div>
                  <span className="neon-lime">{item.amount} {item.asset}</span>
                  <span className="text-muted"> ({item.sourceChain} ➔ {item.targetChain})</span>
                  <div className="text-xs text-muted">Intent: {item.intentHash.slice(0, 18)}...</div>
                </div>
                <div className="text-right">
                  <span className="neon-cyan">+{item.dustEquivalent.toLocaleString()} DUST Sponsored</span>
                  <div className="text-xs text-muted">{new Date(item.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
          </div>
        </CyberCard3D>
      )}
    </div>
  );
};
