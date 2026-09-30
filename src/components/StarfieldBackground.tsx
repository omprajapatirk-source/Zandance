"use client";

import React, { useEffect, useRef } from "react";

interface StarfieldBackgroundProps {
  isDark?: boolean;
}

export const StarfieldBackground: React.FC<StarfieldBackgroundProps> = ({ isDark = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Star colors depend on theme: multi-color in light/aurora mode, monochrome white/silver in dark OLED mode
    const starColors = isDark
      ? ['rgba(255,255,255,', 'rgba(241,245,249,', 'rgba(226,232,240,', 'rgba(203,213,225,']
      : [
          'rgba(255,255,255,',
          'rgba(0,240,255,',
          'rgba(168,85,247,',
          'rgba(56,189,248,',
          'rgba(52,211,153,',
          'rgba(244,114,182,'
        ];

    const starCount = Math.min(320, Math.floor((width * height) / (isDark ? 7000 : 6000)));
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * (isDark ? 1.5 : 1.7) + 0.35,
      alpha: Math.random() * (isDark ? 0.65 : 0.75) + (isDark ? 0.2 : 0.25),
      color: starColors[Math.floor(Math.random() * starColors.length)],
      twinkleSpeed: (Math.random() * 0.02 + 0.006) * (Math.random() > 0.5 ? 1 : -1),
      vx: (Math.random() - 0.5) * (isDark ? 0.12 : 0.16),
      vy: (Math.random() - 0.5) * (isDark ? 0.12 : 0.16),
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((star) => {
        // Update twinkling
        star.alpha += star.twinkleSpeed;
        if (star.alpha > (isDark ? 0.9 : 0.98) || star.alpha < 0.15) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }

        // Slow drift
        star.x += star.vx;
        star.y += star.vy;
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        ctx.fillStyle = `${star.color}${Math.max(0, Math.min(1, star.alpha))})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, [isDark]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden transition-opacity duration-700">
      {/* Aurora Nebulae: Render vibrant colored auroras in Light Mode; subtle obsidian dark in Dark Mode */}
      {!isDark ? (
        <>
          <div className="absolute top-[5%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-cyan-500/25 blur-[140px] pointer-events-none animate-pulse-glow" />
          <div className="absolute top-[15%] right-[-12%] w-[65vw] h-[65vw] rounded-full bg-purple-600/30 blur-[150px] pointer-events-none" />
          <div className="absolute top-[55%] left-[-5%] w-[50vw] h-[50vw] rounded-full bg-teal-500/15 blur-[130px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[10%] w-[55vw] h-[55vw] rounded-full bg-indigo-600/25 blur-[140px] pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute top-[5%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-white/[0.015] blur-[140px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-white/[0.01] blur-[140px] pointer-events-none" />
        </>
      )}

      {/* Canvas Starfield */}
      <canvas ref={canvasRef} className={`absolute inset-0 size-full ${isDark ? 'opacity-75' : 'opacity-90'}`} />

      {/* Subtle Noise Grain Filter */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
};
