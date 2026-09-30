"use client";

import React, { useEffect, useRef, useState } from "react";

export type CursorState =
  | "default"
  | "hover-link"
  | "hover-card"
  | "hover-button"
  | "dragging"
  | "text";

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  const mouseX = useRef(-100);
  const mouseY = useRef(-100);
  const ringX = useRef(-100);
  const ringY = useRef(-100);
  const dotX = useRef(-100);
  const dotY = useRef(-100);

  const [cursorState, setCursorState] = useState<CursorState>("default");
  const [cursorLabel, setCursorLabel] = useState<string>("");
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const magneticTarget = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    // Check if touch device or reduced motion
    const touchMatch = window.matchMedia("(hover: none)");
    const motionMatch = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (touchMatch.matches || motionMatch.matches) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Check hovered element
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check if inside input / textarea / select
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      ) {
        setCursorState("text");
        setCursorLabel("");
        magneticTarget.current = null;
        return;
      }

      // Check for magnetic button
      const buttonEl = target.closest<HTMLElement>("button, [data-cursor='button']");
      if (buttonEl) {
        const rect = buttonEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        // Magnetic pull (20% toward center)
        magneticTarget.current = {
          x: mouseX.current + (centerX - mouseX.current) * 0.25,
          y: mouseY.current + (centerY - mouseY.current) * 0.25,
        };
        setCursorState("hover-button");
        setCursorLabel("");
        return;
      }

      magneticTarget.current = null;

      // Check for interactive card or draggable wheel
      const cardEl = target.closest<HTMLElement>("[data-cursor='card'], .wheel-card, [role='option']");
      if (cardEl) {
        setCursorState("hover-card");
        setCursorLabel(cardEl.dataset.cursorLabel || "Drag");
        return;
      }

      // Check for link / anchor
      const linkEl = target.closest<HTMLElement>("a, [data-cursor='link'], .cursor-pointer");
      if (linkEl) {
        setCursorState("hover-link");
        setCursorLabel("");
        return;
      }

      // Default state
      setCursorState("default");
      setCursorLabel("");
    };

    const handleMouseDown = () => {
      setCursorState("dragging");
    };

    const handleMouseUp = () => {
      setCursorState("default");
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Continuous requestAnimationFrame physics loop (Lerp Easing: 0.15)
    let animId: number;
    const loop = () => {
      const targetX = magneticTarget.current ? magneticTarget.current.x : mouseX.current;
      const targetY = magneticTarget.current ? magneticTarget.current.y : mouseY.current;

      // Dot follows immediately with high responsive lerp
      dotX.current += (targetX - dotX.current) * 0.45;
      dotY.current += (targetY - dotY.current) * 0.45;

      // Ring follows with smooth 0.15 lerp
      ringX.current += (targetX - ringX.current) * 0.15;
      ringY.current += (targetY - ringY.current) * 0.15;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotX.current}px, ${dotY.current}px, 0) translate(-50%, -50%)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX.current}px, ${ringY.current}px, 0) translate(-50%, -50%)`;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [isVisible]);

  if (isTouchDevice) return null;

  // Dynamic scale and styles based on cursorState
  let ringScaleClass = "scale-100 border-white/70";
  let dotScaleClass = "scale-100";

  if (cursorState === "hover-link") {
    ringScaleClass = "scale-[1.65] border-cyan-400 bg-cyan-400/10";
    dotScaleClass = "scale-75 opacity-80";
  } else if (cursorState === "hover-card") {
    ringScaleClass = "scale-[1.8] border-white/80 bg-white/20";
    dotScaleClass = "opacity-0";
  } else if (cursorState === "hover-button") {
    ringScaleClass = "scale-[1.3] border-cyan-400 bg-cyan-400/20";
    dotScaleClass = "scale-125 bg-cyan-400";
  } else if (cursorState === "dragging") {
    ringScaleClass = "scale-75 border-white";
    dotScaleClass = "scale-50";
  } else if (cursorState === "text") {
    ringScaleClass = "scale-0 opacity-0";
    dotScaleClass = "h-4 w-[2px] rounded-none bg-cyan-400";
  }

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[9999] overflow-hidden transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{ mixBlendMode: "difference" }}
    >
      {/* 8px Inner Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 size-2 rounded-full bg-white transition-transform duration-75 ease-out ${dotScaleClass}`}
      />

      {/* 40px Outer Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 size-10 rounded-full border border-white flex items-center justify-center transition-all duration-200 ease-out ${ringScaleClass}`}
      >
        {cursorLabel && (
          <span
            ref={labelRef}
            className="text-[9px] font-mono font-bold tracking-tighter uppercase text-white select-none animate-fade-in"
          >
            {cursorLabel}
          </span>
        )}
      </div>
    </div>
  );
};
