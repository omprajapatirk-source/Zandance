"use client";

import React, { useEffect, useState } from "react";
import { Zap, Check, RotateCw, AlertTriangle, Sparkles, Command } from "lucide-react";
import { cn } from "@/lib/utils";

interface GenerateButtonProps {
  onClick: () => void;
  status: "idle" | "loading" | "success" | "error";
  disabled?: boolean;
  disabledReason?: string;
  className?: string;
  label?: string;
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  onClick,
  status,
  disabled = false,
  disabledReason = "Please fill all required parameters",
  className,
  label = "Generate ZK Proof & Sponsor",
}) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const [showTooltip, setShowTooltip] = useState(false);

  // Trigger particle burst on success
  useEffect(() => {
    if (status === "success") {
      const newParticles = Array.from({ length: 16 }, (_, i) => {
        const angle = (i / 16) * 360 * (Math.PI / 180);
        const distance = 40 + Math.random() * 50;
        return {
          id: i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
        };
      });
      setParticles(newParticles);
      const timer = setTimeout(() => setParticles([]), 1200);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Keyboard shortcut: Cmd+Enter or Ctrl+Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        if (!disabled && status === "idle") {
          e.preventDefault();
          onClick();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [disabled, status, onClick]);

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Tooltip on disabled hover */}
      {disabled && showTooltip && (
        <div className="absolute -top-10 z-30 px-3 py-1.5 rounded-lg border border-border bg-card/95 text-foreground text-xs font-mono backdrop-blur-md shadow-lg animate-fade-in pointer-events-none whitespace-nowrap">
          {disabledReason}
        </div>
      )}

      {/* Button Wrapper with Rotating Conic-Gradient Border */}
      <div
        className={cn(
          "relative group w-full rounded-full p-[1.5px] overflow-hidden transition-all duration-300",
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:shadow-[0_0_30px_rgba(0,240,255,0.25)]",
          status === "error" ? "animate-shake ring-2 ring-red-500/50" : ""
        )}
        onMouseEnter={() => disabled && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Animated Conic Gradient Border */}
        {!disabled && (
          <div
            className="absolute inset-[-100%] animate-spin-slow bg-[conic-gradient(from_0deg,#00f0ff,#9d4edd,#ffffff,#00f0ff)] opacity-70 group-hover:opacity-100 transition-opacity"
            style={{ animationDuration: "4s" }}
          />
        )}

        {/* Inner Button Body */}
        <button
          type="button"
          onClick={() => {
            if (!disabled && status !== "loading") {
              onClick();
            }
          }}
          disabled={disabled || status === "loading"}
          data-cursor="button"
          className={cn(
            "relative w-full py-4 px-6 sm:px-8 rounded-full flex items-center justify-between gap-3 text-sm sm:text-base font-semibold transition-all duration-200 outline-none",
            "bg-background hover:bg-muted/60 text-foreground active:scale-[0.98]",
            status === "success" ? "bg-emerald-500 text-black font-bold shadow-[0_0_25px_rgba(16,185,129,0.5)]" : "",
            status === "error" ? "bg-red-950/80 text-red-200 border border-red-500/50" : "",
            className
          )}
        >
          {/* Status Content */}
          <div className="flex items-center gap-3">
            {status === "idle" && (
              <div className="p-1.5 rounded-full bg-cyan-400/10 text-cyan-400 group-hover:scale-110 transition-transform">
                <Zap size={18} />
              </div>
            )}

            {status === "loading" && (
              <div className="relative size-5">
                <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20" />
                <div className="absolute inset-0 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
              </div>
            )}

            {status === "success" && (
              <div className="p-1.5 rounded-full bg-black/20 text-black">
                <Check size={18} strokeWidth={3} />
              </div>
            )}

            {status === "error" && (
              <div className="p-1.5 rounded-full bg-red-500/20 text-red-400">
                <AlertTriangle size={18} />
              </div>
            )}

            {/* Label Text */}
            <span className="font-syne tracking-tight font-medium">
              {status === "idle" && label}
              {status === "loading" && "Generating ZK Proof Privately..."}
              {status === "success" && "Sponsored & Verified on Preprod!"}
              {status === "error" && "Generation Failed — Retry"}
            </span>
          </div>

          {/* Shortcut Badge Hint (⌘+Enter) */}
          {status === "idle" && (
            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full border border-border/80 bg-muted/40 text-[10px] font-mono text-muted-foreground group-hover:text-foreground transition-colors">
              <Command size={11} />
              <span>Enter</span>
            </div>
          )}

          {/* Shimmer overlay when loading */}
          {status === "loading" && (
            <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 animate-shimmer" />
            </div>
          )}
        </button>
      </div>

      {/* Particle Burst on Success */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute pointer-events-none size-1.5 rounded-full bg-emerald-400 animate-particle-burst"
          style={{
            transform: `translate(${p.x}px, ${p.y}px)`,
            opacity: 0,
            transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      ))}
    </div>
  );
};
