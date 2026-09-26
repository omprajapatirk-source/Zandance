import React from 'react';
import { ArrowRightLeft, Shield, Droplets, Layers, Sparkles } from 'lucide-react';

interface CyberDockProps {
  activeTab: 'router' | 'privacy' | 'pool' | 'explorer';
  setActiveTab: (tab: 'router' | 'privacy' | 'pool' | 'explorer') => void;
}

export const CyberDock: React.FC<CyberDockProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    {
      id: 'router' as const,
      label: 'Fee Router',
      icon: <ArrowRightLeft size={18} />,
      badge: 'Zero Gas',
      color: '#ccff00',
    },
    {
      id: 'privacy' as const,
      label: 'Privacy Matrix',
      icon: <Shield size={18} />,
      badge: 'ZK-SNARK',
      color: '#00f0ff',
    },
    {
      id: 'pool' as const,
      label: 'DUST Pool',
      icon: <Droplets size={18} />,
      badge: 'Decay Engine',
      color: '#9d4edd',
    },
    {
      id: 'explorer' as const,
      label: 'Preprod Explorer',
      icon: <Layers size={18} />,
      badge: '70 Users',
      color: '#ff007f',
    },
  ];

  return (
    <div className="cyber-dock-wrapper">
      <nav className="cyber-dock">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`cyber-dock-item ${isActive ? 'active' : ''}`}
              style={
                isActive
                  ? ({
                      '--active-color': tab.color,
                    } as React.CSSProperties)
                  : {}
              }
            >
              <div className="dock-icon-wrapper">{tab.icon}</div>
              <span className="dock-label">{tab.label}</span>
              <span className="dock-badge">{tab.badge}</span>

              {isActive && <span className="dock-active-glow" />}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
