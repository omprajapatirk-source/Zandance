"use client";

import React, { useEffect, useState } from "react";
import { Key, Radio, Sparkles, Sun, Moon, Palette } from "lucide-react";
import { WalletState } from "@/types";

interface SmartNavbarProps {
  wallet: WalletState;
  onOpenWallet: () => void;
  onConnectWallet?: () => void;
  onOpenExplorer?: () => void;
  onOpenTour?: () => void;
  onSelectTab?: (tab: 'router' | 'privacy' | 'pool' | 'explorer' | 'integrations') => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const SmartNavbar: React.FC<SmartNavbarProps> = ({
  wallet,
  onOpenWallet,
  onConnectWallet,
  onOpenExplorer,
  onOpenTour,
  onSelectTab,
  theme = 'dark',
  onToggleTheme,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 60) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 120) {
        // Scrolling down -> hide navbar
        setIsVisible(false);
      } else {
        // Scrolling up -> show navbar
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const isLight = theme === 'light';

  const handleWalletButtonClick = () => {
    if (!wallet.isConnected && onConnectWallet) {
      onConnectWallet();
    } else {
      onOpenWallet();
    }
  };

  const handleNavClick = (
    e: React.MouseEvent,
    targetId: string,
    tabName?: 'router' | 'privacy' | 'pool' | 'explorer' | 'integrations'
  ) => {
    e.preventDefault();
    if (tabName && onSelectTab) {
      onSelectTab(tabName);
    }
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-3 transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="max-w-7xl mx-auto backdrop-blur-2xl bg-slate-900/90 dark:bg-black/90 rounded-2xl px-4 sm:px-6 py-2 flex items-center justify-between shadow-2xl shadow-black/30 border border-white/[0.08] dark:border-white/[0.05]">
        {/* Left: Brand Wordmark */}
        <a href="#" className="flex items-center gap-2.5 group shrink-0">
          <img
            src="/zandance_logo.jpg"
            alt="Zandance Logo"
            className="size-8 rounded-xl object-cover group-hover:scale-105 transition-transform shadow-md ring-1 ring-cyan-400/30"
          />
          <div className="flex flex-col">
            <span className="font-syne font-bold tracking-tight text-sm sm:text-base leading-none text-white">
              ZANDANCE
            </span>
            <span className="text-[9px] font-mono text-cyan-300 dark:text-slate-400 tracking-wider uppercase mt-0.5">
              Midnight Network
            </span>
          </div>
        </a>

        {/* Center: Perfectly Centered Navigation Links */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-5 sm:gap-7 text-xs font-mono text-slate-300 dark:text-slate-400">
          <a
            href="#showcase"
            onClick={(e) => handleNavClick(e, 'showcase')}
            className="hover:text-white transition-colors"
          >
            Pillars
          </a>
          <a
            href="#how-it-works"
            onClick={(e) => handleNavClick(e, 'how-it-works')}
            className="hover:text-white transition-colors"
          >
            How It Works
          </a>
          <button
            onClick={(e) => handleNavClick(e, 'fee-router', 'router')}
            className="hover:text-cyan-400 text-slate-300 dark:text-slate-400 transition-colors font-mono cursor-pointer"
          >
            Fee Router
          </button>
          <button
            onClick={(e) => handleNavClick(e, 'fee-router', 'pool')}
            className="hover:text-cyan-400 text-slate-300 dark:text-slate-400 transition-colors font-mono cursor-pointer"
          >
            DUST Pool
          </button>
          <a
            href="#developers"
            onClick={(e) => handleNavClick(e, 'developers')}
            className="hover:text-white transition-colors"
          >
            Developers
          </a>
          {onOpenExplorer && (
            <button
              onClick={onOpenExplorer}
              className="hover:text-cyan-400 text-slate-300 dark:text-slate-400 transition-colors flex items-center gap-1 font-mono cursor-pointer"
            >
              <span>Explorer</span>
            </button>
          )}
        </div>

        {/* Right: Vertical Controls Stack + X Link + Connect Button */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          {/* Vertical Stack for Dark Mode, Tour, and Preprod Live */}
          <div className="hidden sm:flex flex-col items-end justify-center gap-1 py-0.5">
            {/* 1. Theme Switcher */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold transition-all border shadow-sm ${
                  isLight
                    ? 'bg-gradient-to-r from-purple-500/15 via-cyan-500/15 to-teal-500/15 border-cyan-400/30 text-cyan-300 hover:border-cyan-300'
                    : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white'
                }`}
                title={isLight ? 'Switch to Dark OLED Mode' : 'Switch to Light Aurora Mode'}
              >
                {isLight ? (
                  <>
                    <Palette size={10} className="text-cyan-400 animate-pulse" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={10} className="text-zinc-400" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            )}

            {/* 2. Tour Trigger */}
            {onOpenTour && (
              <button
                onClick={onOpenTour}
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/25 text-[9px] font-mono font-bold text-cyan-300 transition-all shadow-sm"
                title="Start Interactive Protocol Tour"
              >
                <Sparkles size={10} />
                <span>Tour</span>
              </button>
            )}

            {/* 3. Preprod Live Status Badge */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-[9px] font-mono text-emerald-400 border border-emerald-500/20">
              <span className="size-1 rounded-full bg-emerald-400 animate-pulse" />
              <span>Preprod Live</span>
            </div>
          </div>

          {/* Official X / Twitter Link */}
          <a
            href="https://x.com/ZandanceFi"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-full bg-slate-950/80 dark:bg-zinc-900/80 hover:bg-slate-800 dark:hover:bg-zinc-800 text-slate-300 hover:text-cyan-400 transition-all flex items-center justify-center border border-white/[0.06] dark:border-white/[0.04]"
            title="Follow @ZandanceFi on X"
          >
            <svg viewBox="0 0 24 24" className="size-3.5 fill-current">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {/* Wallet Drawer Trigger Button */}
          <button
            onClick={handleWalletButtonClick}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all shadow-lg ${
              wallet.isConnected
                ? 'bg-white text-black hover:bg-slate-100'
                : 'bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 text-slate-950 hover:opacity-95 shadow-cyan-500/20 animate-pulse'
            }`}
          >
            <Key size={13} />
            <span>
              {wallet.isConnected
                ? `LACE: ${wallet.address.slice(0, 4)}...${wallet.address.slice(-3)}`
                : "Connect Lace"}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};
