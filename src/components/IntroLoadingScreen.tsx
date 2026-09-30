"use client";

import React, { useEffect, useState } from "react";

export const IntroLoadingScreen: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Check session storage to only show once per session if desired
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => setIsVisible(false), 600);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      onClick={() => {
        setIsFading(true);
        setTimeout(() => setIsVisible(false), 400);
      }}
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black text-white transition-opacity duration-600 ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Nyx Crescent Animated Emblem */}
      <div className="relative flex items-center justify-center size-24 sm:size-28 mb-6">
        {/* Orbital Ring Pulse */}
        <div className="absolute inset-0 rounded-full border border-cyan-500/30 animate-ping opacity-60" />
        <div className="absolute inset-[-8px] rounded-full border border-purple-500/20 animate-pulse" />

        {/* Crescent Moon SVG */}
        <svg
          viewBox="0 0 100 100"
          className="size-16 sm:size-20 text-cyan-400 filter drop-shadow-[0_0_15px_rgba(0,240,255,0.7)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M50 10 C30 10 15 25 15 50 C15 75 30 90 50 90 C35 78 30 62 30 50 C30 38 35 22 50 10 Z"
            fill="currentColor"
          />
          <circle cx="68" cy="32" r="3.5" fill="#ccff00" className="animate-pulse" />
        </svg>
      </div>

      {/* Brand Title */}
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-light tracking-widest font-syne text-white uppercase">
          ZANDANCE
        </h1>
        <div className="text-xs font-mono text-cyan-400/80 mt-1 tracking-wider uppercase">
          Nyx Shielded Protocol
        </div>
      </div>

      {/* Progress Line */}
      <div className="w-36 h-[1.5px] bg-white/10 rounded-full mt-6 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-cyan-400 to-purple-400 animate-shimmer" />
      </div>

      <div className="text-[10px] font-mono text-white/40 mt-3">
        Midnight Preprod ZK-SNARK Enclave
      </div>
    </div>
  );
};
