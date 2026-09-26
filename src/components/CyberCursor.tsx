import React, { useEffect, useState, useRef } from 'react';

interface ClickWave {
  id: number;
  x: number;
  y: number;
}

export const CyberCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [targetPos, setTargetPos] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [clickWaves, setClickWaves] = useState<ClickWave[]>([]);
  const requestRef = useRef<number>(0);

  useEffect(() => {
    // Hide default cursor on desktop devices with fine pointers
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const onMouseMove = (e: MouseEvent) => {
      setTargetPos({ x: e.clientX, y: e.clientY });

      // Check if hovering over clickable element
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isClickable =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.getAttribute('role') === 'button' ||
        target.closest('button') !== null ||
        target.closest('a') !== null ||
        target.closest('.interactive-card') !== null ||
        target.closest('.tab-button') !== null ||
        target.classList.contains('clickable');

      setIsHovering(Boolean(isClickable));
    };

    const onMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      const newWave: ClickWave = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
      };
      setClickWaves((prev) => [...prev.slice(-3), newWave]);
      setTimeout(() => {
        setClickWaves((prev) => prev.filter((w) => w.id !== newWave.id));
      }, 700);
    };

    const onMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    // Smooth trailing animation loop
    let currentX = -100;
    let currentY = -100;

    const animate = () => {
      currentX += (targetPos.x - currentX) * 0.22;
      currentY += (targetPos.y - currentY) * 0.22;
      setPos({ x: currentX, y: currentY });
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(requestRef.current);
    };
  }, [targetPos.x, targetPos.y]);

  if (pos.x === -100) return null;

  return (
    <>
      {/* Central Cyber Point */}
      <div
        style={{
          position: 'fixed',
          top: targetPos.y,
          left: targetPos.x,
          width: '6px',
          height: '6px',
          backgroundColor: isHovering ? '#ccff00' : '#00f0ff',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 99999,
          boxShadow: isHovering
            ? '0 0 10px #ccff00, 0 0 20px #ccff00'
            : '0 0 10px #00f0ff, 0 0 20px #00f0ff',
          transition: 'transform 0.1s ease, background-color 0.2s ease',
        }}
      />

      {/* Outer Smooth Trailing Cyber Ring */}
      <div
        style={{
          position: 'fixed',
          top: pos.y,
          left: pos.x,
          width: isHovering ? '48px' : isClicking ? '26px' : '34px',
          height: isHovering ? '48px' : isClicking ? '26px' : '34px',
          border: isHovering
            ? '2px solid #ccff00'
            : '1.5px solid rgba(157, 78, 221, 0.7)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 99998,
          boxShadow: isHovering
            ? '0 0 20px rgba(204, 255, 0, 0.4), inset 0 0 10px rgba(204, 255, 0, 0.2)'
            : '0 0 15px rgba(157, 78, 221, 0.3)',
          transition:
            'width 0.25s cubic-bezier(0.16, 1, 0.3, 1), height 0.25s cubic-bezier(0.16, 1, 0.3, 1), border 0.2s ease, box-shadow 0.2s ease',
          backdropFilter: isHovering ? 'invert(0.1)' : 'none',
        }}
      />

      {/* Click Ripple Shockwaves */}
      {clickWaves.map((wave) => (
        <div
          key={wave.id}
          className="cyber-shockwave"
          style={{
            position: 'fixed',
            top: wave.y,
            left: wave.x,
            pointerEvents: 'none',
            zIndex: 99997,
          }}
        />
      ))}
    </>
  );
};
