import React, { useRef, useState } from 'react';

interface CyberCard3DProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'purple' | 'lime' | 'cyan' | 'magenta';
  style?: React.CSSProperties;
}

export const CyberCard3D: React.FC<CyberCard3DProps> = ({
  children,
  className = '',
  glowColor = 'purple',
  style = {},
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [lightPos, setLightPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -6; // max 6 deg
    const rY = ((x - centerX) / centerX) * 6;

    setRotX(rX);
    setRotY(rY);
    setLightPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotX(0);
    setRotY(0);
  };

  const glowColorsMap = {
    purple: 'rgba(157, 78, 221, 0.25)',
    lime: 'rgba(204, 255, 0, 0.25)',
    cyan: 'rgba(0, 240, 255, 0.25)',
    magenta: 'rgba(255, 0, 127, 0.25)',
  };

  return (
    <div
      ref={cardRef}
      className={`cyber-3d-card ${className} ${isHovered ? 'hovered' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) ${
          isHovered ? 'translateZ(10px)' : 'translateZ(0px)'
        }`,
        transition: isHovered
          ? 'transform 0.08s ease-out, box-shadow 0.2s ease'
          : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease',
        ...style,
      }}
    >
      {/* Specular Radial Spotlight Layer */}
      {isHovered && (
        <div
          className="cyber-specular-light"
          style={{
            background: `radial-gradient(circle at ${lightPos.x}% ${lightPos.y}%, ${glowColorsMap[glowColor]}, transparent 70%)`,
          }}
        />
      )}

      {/* Cyber Corner Neo-Brutalist Brackets */}
      <div className="corner-bracket top-left" />
      <div className="corner-bracket top-right" />
      <div className="corner-bracket bottom-left" />
      <div className="corner-bracket bottom-right" />

      {/* Content Container */}
      <div className="cyber-card-content">{children}</div>
    </div>
  );
};
