import React from 'react';

interface CyberCard3DProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'purple' | 'lime' | 'cyan' | 'magenta';
  style?: React.CSSProperties;
}

export const CyberCard3D: React.FC<CyberCard3DProps> = ({
  children,
  className = '',
  glowColor = 'cyan',
  style = {},
}) => {
  const colorBg = {
    cyan: 'bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-cyan-950/30',
    purple: 'bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-purple-950/30',
    lime: 'bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-emerald-950/30',
    magenta: 'bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-indigo-950/30',
  }[glowColor || 'cyan'] || 'bg-slate-900/90';

  return (
    <div
      className={`rounded-3xl ${colorBg} backdrop-blur-2xl p-6 sm:p-7 shadow-2xl transition-all duration-300 ${className}`}
      style={style}
    >
      <div className="w-full">{children}</div>
    </div>
  );
};
