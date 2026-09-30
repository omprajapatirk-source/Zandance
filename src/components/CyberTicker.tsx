import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, Zap, Radio, Volume2, Cpu } from 'lucide-react';

export const CyberTicker: React.FC = () => {
  const [blockHeight, setBlockHeight] = useState(1429488);
  const [activeRelayers] = useState(14);
  const [proofTime] = useState('17.4ms');

  // Increment simulated block height periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setBlockHeight((prev) => prev + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="cyber-hud-bar">
      <div className="hud-container">
        {/* Left: Network Node Pulse */}
        <div className="hud-group">
          <div className="pulse-indicator">
            <span className="pulse-dot" />
            <span className="pulse-wave" />
          </div>
          <div className="hud-badge-primary">
            <span className="hud-label">NETWORK:</span>
            <span className="hud-value neon-lime">MIDNIGHT PREPROD</span>
          </div>
          <div className="hud-badge">
            <Cpu size={12} className="neon-purple" />
            <span className="hud-label">BLOCK:</span>
            <span className="hud-value font-mono">#{blockHeight.toLocaleString()}</span>
          </div>
        </div>

        {/* Center: Live Audio/Signal Waveform Visualizer */}
        <div className="hud-waveform-group">
          <div className="waveform-label">
            <Radio size={11} className="neon-cyan blink" />
            <span>ZK-SNARK ENGINE: LIVE</span>
          </div>
          <div className="waveform-bars">
            {[65, 30, 85, 45, 95, 25, 75, 50, 90, 40, 80, 60, 100, 35, 70].map((h, i) => (
              <span
                key={i}
                className="wave-bar"
                style={{
                  height: `${h}%`,
                  animationDelay: `${(i * 0.08).toFixed(2)}s`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Right: Telemetry Metrics */}
        <div className="hud-group">
          <div className="hud-badge">
            <Zap size={12} className="neon-amber" />
            <span className="hud-label">PROOF LATENCY:</span>
            <span className="hud-value neon-cyan font-mono">{proofTime}</span>
          </div>
          <div className="hud-badge">
            <ShieldCheck size={12} className="neon-magenta" />
            <span className="hud-label">WITNESS LEAK:</span>
            <span className="hud-value neon-lime font-mono">0.00%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
