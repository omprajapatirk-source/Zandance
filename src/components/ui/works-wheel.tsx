"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface WheelItem {
  id: string;
  title: string;
  subtitle?: string;
  category?: string;
  description?: string;
  image: string;
  href?: string;
  tag?: string;
  stats?: { label: string; value: string };
}

interface WorksWheelProps {
  items: WheelItem[];
  className?: string;
  onItemSelect?: (item: WheelItem, index: number) => void;
  radius?: number;
  initialIndex?: number;
  showIndexList?: boolean;
}

export const WorksWheel: React.FC<WorksWheelProps> = ({
  items,
  className,
  onItemSelect,
  radius = 420,
  initialIndex = 0,
  showIndexList = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const drumRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const currentTurn = useRef(initialIndex);
  const targetTurn = useRef(initialIndex);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const lastY = useRef(0);
  const velocity = useRef(0);
  const animFrameId = useRef<number | null>(null);

  const itemCount = items.length;
  const anglePerItem = 360 / itemCount;
  const EASE = 0.12;

  // Initialize cardRefs array
  cardRefs.current = items.map((_, i) => cardRefs.current[i] || null);

  const updateCardTransforms = useCallback(
    (turnValue: number) => {
      if (!drumRef.current) return;

      const normIndex = ((Math.round(turnValue) % itemCount) + itemCount) % itemCount;
      if (normIndex !== activeIndex) {
        setActiveIndex(normIndex);
      }

      items.forEach((_, i) => {
        const cardEl = cardRefs.current[i];
        if (!cardEl) return;

        // Calculate angular difference relative to center
        let diff = i - turnValue;
        // Normalize diff into [-itemCount/2, itemCount/2]
        while (diff < -itemCount / 2) diff += itemCount;
        while (diff > itemCount / 2) diff -= itemCount;

        const angle = diff * anglePerItem;
        const rad = (angle * Math.PI) / 180;
        const cos = Math.cos(rad);

        // Visibility and z-sorting
        const isFacing = cos > -0.1;
        const distanceToCenter = Math.abs(diff);
        const opacity = Math.max(0.12, Math.pow(Math.max(0, cos), 1.6));
        const scale = Math.max(0.75, 1 - distanceToCenter * 0.08);

        cardEl.style.transform = `rotateX(${-angle}deg) translateZ(${radius}px) scale(${scale})`;
        cardEl.style.opacity = isFacing ? `${opacity}` : "0";
        cardEl.style.pointerEvents = Math.abs(diff) < 0.6 ? "auto" : "none";
        cardEl.style.filter = `blur(${Math.min(8, distanceToCenter * 2.2)}px)`;
        cardEl.style.zIndex = `${Math.round(cos * 100)}`;
      });
    },
    [items, itemCount, anglePerItem, radius, activeIndex]
  );

  // Physics loop with requestAnimationFrame
  useEffect(() => {
    let isRunning = true;

    const loop = () => {
      if (!isRunning) return;

      if (!isDragging.current) {
        // Smooth lerp toward target
        currentTurn.current += (targetTurn.current - currentTurn.current) * EASE;

        // Apply snapping when close to stationary
        if (Math.abs(targetTurn.current - currentTurn.current) < 0.001) {
          currentTurn.current = targetTurn.current;
        }
      } else {
        // Follow dragging directly
        currentTurn.current += (targetTurn.current - currentTurn.current) * 0.4;
      }

      updateCardTransforms(currentTurn.current);
      animFrameId.current = requestAnimationFrame(loop);
    };

    animFrameId.current = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [updateCardTransforms]);

  // Jump to specific index smoothly
  const jumpToIndex = useCallback(
    (index: number) => {
      let current = targetTurn.current;
      let diff = index - (current % itemCount);
      if (diff > itemCount / 2) diff -= itemCount;
      if (diff < -itemCount / 2) diff += itemCount;

      targetTurn.current = Math.round(current + diff);
      if (onItemSelect) {
        onItemSelect(items[index], index);
      }
    },
    [itemCount, items, onItemSelect]
  );

  // Wheel interaction (non-locking, smooth delta)
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      // Small delta scaling for tactile precision
      const delta = e.deltaY * 0.0022;
      targetTurn.current += delta;
    },
    []
  );

  // Mouse & Touch Drag interactions
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startY.current = e.clientY;
    lastY.current = e.clientY;
    velocity.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const currentY = e.clientY;
    const dy = lastY.current - currentY;
    lastY.current = currentY;

    // Convert pixel delta to wheel turn
    const sensitivity = 0.0035;
    targetTurn.current += dy * sensitivity;
    velocity.current = dy * sensitivity;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Pointer already released
    }

    // Apply inertia and snap to nearest index
    targetTurn.current = Math.round(targetTurn.current + velocity.current * 4);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      targetTurn.current = Math.round(targetTurn.current + 1);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      targetTurn.current = Math.round(targetTurn.current - 1);
    }
  };

  const activeItem = items[activeIndex] || items[0];

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="listbox"
      aria-label="Works Wheel 3D Carousel"
      aria-activedescendant={`wheel-item-${activeItem.id}`}
      className={cn(
        "relative w-full min-h-[580px] sm:min-h-[680px] flex items-center justify-between overflow-hidden select-none outline-none focus-visible:ring-1 focus-visible:ring-cyan-500/40 rounded-3xl bg-background/50 py-8 px-4 sm:px-8 md:px-12",
        className
      )}
      style={{ touchAction: "none" }}
    >
      {/* Background Soft Glow Ambience */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-transparent blur-[120px] opacity-70" />
      </div>

      {/* Left Side: Editorial Typography Information */}
      <div className="relative z-20 flex-1 max-w-sm sm:max-w-md pointer-events-auto pr-4 sm:pr-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-mono tracking-widest uppercase text-cyan-400 font-semibold px-2.5 py-0.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 backdrop-blur-md">
            {activeItem.category || "PROTOCOL PILLAR"}
          </span>
          {activeItem.tag && (
            <span className="text-[11px] font-mono text-muted-foreground px-2 py-0.5 rounded-md bg-muted/40">
              {activeItem.tag}
            </span>
          )}
        </div>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-normal tracking-tight text-foreground font-syne leading-snug transition-all duration-300">
          {activeItem.title}
        </h2>

        {activeItem.subtitle && (
          <p className="text-xs sm:text-sm font-space text-muted-foreground mt-2 leading-relaxed transition-all duration-300">
            {activeItem.subtitle}
          </p>
        )}

        {activeItem.description && (
          <p className="text-xs sm:text-sm font-space text-muted-foreground/80 mt-2 leading-relaxed line-clamp-3">
            {activeItem.description}
          </p>
        )}

        {activeItem.stats && (
          <div className="mt-5 p-3.5 rounded-xl border border-border/50 bg-muted/30 backdrop-blur-md inline-flex items-center gap-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                {activeItem.stats.label}
              </div>
              <div className="text-base sm:text-lg font-mono font-semibold text-foreground">
                {activeItem.stats.value}
              </div>
            </div>
          </div>
        )}

        {activeItem.href && (
          <div className="mt-6">
            <a
              href={activeItem.href}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium px-4 py-2 rounded-full border border-foreground/15 bg-foreground/5 hover:bg-foreground hover:text-background text-foreground transition-all duration-300 shadow-sm"
            >
              <span>Explore Pillar</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        )}

        {/* Stepper buttons for accessibility */}
        <div className="flex items-center gap-2 mt-6 text-muted-foreground">
          <button
            onClick={() => jumpToIndex((activeIndex - 1 + itemCount) % itemCount)}
            className="p-2 rounded-full border border-border/60 hover:border-foreground/40 hover:text-foreground transition-all"
            aria-label="Previous card"
          >
            <ChevronUp size={16} />
          </button>
          <button
            onClick={() => jumpToIndex((activeIndex + 1) % itemCount)}
            className="p-2 rounded-full border border-border/60 hover:border-foreground/40 hover:text-foreground transition-all"
            aria-label="Next card"
          >
            <ChevronDown size={16} />
          </button>
          <span className="text-xs font-mono ml-2">
            0{activeIndex + 1} / 0{itemCount}
          </span>
        </div>
      </div>

      {/* Center 3D Cylinder Drum */}
      <div
        className="relative flex-1 h-[460px] sm:h-[540px] flex items-center justify-center"
        style={{ perspective: "1200px" }}
      >
        <div
          ref={drumRef}
          className="relative w-[280px] sm:w-[340px] md:w-[380px] h-[340px] sm:h-[400px]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {items.map((item, index) => {
            const isCenter = index === activeIndex;
            return (
              <div
                key={item.id}
                id={`wheel-item-${item.id}`}
                ref={(el) => (cardRefs.current[index] = el)}
                onClick={() => jumpToIndex(index)}
                role="option"
                aria-selected={isCenter}
                className={cn(
                  "absolute inset-0 rounded-2xl overflow-hidden cursor-pointer transition-shadow duration-300",
                  "border border-white/15 dark:border-white/10 bg-card/90 shadow-2xl shadow-black/40",
                  isCenter
                    ? "ring-1 ring-cyan-500/50 shadow-[0_15px_40px_rgba(0,240,255,0.15)]"
                    : "hover:border-white/30"
                )}
                style={{
                  willChange: "transform, opacity, filter",
                  backfaceVisibility: "hidden",
                }}
              >
                {/* Card Cover Image */}
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white/90 border border-white/15">
                      {item.tag || `0${index + 1}`}
                    </span>
                    <div className="size-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f0ff]" />
                  </div>

                  {/* Card Bottom Hover / Details Pill */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold font-syne text-white tracking-tight leading-snug">
                        {item.title}
                      </h3>
                      {item.subtitle && (
                        <p className="text-xs font-space text-white/70 line-clamp-1">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                    <div className="p-2 rounded-full bg-white/15 backdrop-blur-md text-white border border-white/20 hover:bg-white/30 transition-all">
                      <ArrowUpRight size={14} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Side: Index Navigation List */}
      {showIndexList && (
        <div className="hidden lg:flex flex-col gap-2 relative z-20 pl-6 border-l border-border/40">
          <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest mb-1">
            INDEX
          </span>
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={item.id}
                onClick={() => jumpToIndex(index)}
                className={cn(
                  "group flex items-center gap-3 text-left py-1 text-xs font-mono transition-all duration-200",
                  isActive
                    ? "text-cyan-400 font-bold translate-x-1"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full transition-all duration-300",
                    isActive
                      ? "bg-cyan-400 shadow-[0_0_8px_#00f0ff] scale-125"
                      : "bg-muted-foreground/40 group-hover:bg-foreground/60"
                  )}
                />
                <span className="opacity-60 text-[10px]">0{index + 1}</span>
                <span className="tracking-tight">{item.title}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WorksWheel;
