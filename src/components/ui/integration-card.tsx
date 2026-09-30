"use client";

import React, { useId } from "react";
import { motion } from "motion/react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Sparkles, ArrowRight, ExternalLink } from "lucide-react";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-cyan-500 text-black hover:bg-cyan-400 font-semibold shadow-lg shadow-cyan-500/20",
        outline:
          "border-white/10 bg-slate-900/60 hover:bg-slate-800 text-white aria-expanded:bg-muted aria-expanded:text-foreground dark:border-white/10 dark:bg-black/60 dark:hover:bg-slate-900",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-9 gap-2 px-4 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-11 gap-2 px-6 text-base font-semibold",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

interface VisualContainerProps {
  children: React.ReactNode;
  className?: string;
}

interface TeamCardProps {
  visual: React.ReactNode;
  title: string;
  description: string;
  url: string;
}

interface IntegrationItem {
  id: string;
  name: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  x: number;
  y: number;
  path: string;
  delay: number;
  color: string;
  glowColor: string;
}

// 1. Midnight Network Logo SVG
const MidnightLogo = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="mn-glow" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A855F7" />
          <stop offset="1" stopColor="#38BDF8" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="#181126" stroke="url(#mn-glow)" strokeWidth="1.5" />
      <path
        d="M10 22V10L16 17L22 10V22"
        stroke="url(#mn-glow)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="7" r="1.5" fill="#38BDF8" />
      <circle cx="7.5" cy="16" r="1.2" fill="#C084FC" />
      <circle cx="24.5" cy="16" r="1.2" fill="#C084FC" />
    </svg>
  );
};

// 2. Cardano ADA Logo SVG
const CardanoLogo = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="ada-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0033AD" />
          <stop offset="1" stopColor="#0098EA" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="#031538" stroke="#0098EA" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="3.8" fill="#0098EA" />
      {/* Inner ring dots */}
      <circle cx="16" cy="8" r="1.6" fill="#38BDF8" />
      <circle cx="22.9" cy="12" r="1.6" fill="#38BDF8" />
      <circle cx="22.9" cy="20" r="1.6" fill="#38BDF8" />
      <circle cx="16" cy="24" r="1.6" fill="#38BDF8" />
      <circle cx="9.1" cy="20" r="1.6" fill="#38BDF8" />
      <circle cx="9.1" cy="12" r="1.6" fill="#38BDF8" />
      {/* Outer smaller dots */}
      <circle cx="16" cy="4.5" r="1.1" fill="#93C5FD" />
      <circle cx="26" cy="10.2" r="1.1" fill="#93C5FD" />
      <circle cx="26" cy="21.8" r="1.1" fill="#93C5FD" />
      <circle cx="16" cy="27.5" r="1.1" fill="#93C5FD" />
      <circle cx="6" cy="21.8" r="1.1" fill="#93C5FD" />
      <circle cx="6" cy="10.2" r="1.1" fill="#93C5FD" />
    </svg>
  );
};

// 3. Ethereum Logo SVG
const EthereumLogo = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="16" cy="16" r="14" fill="#0B132B" stroke="#627EEA" strokeWidth="1.5" />
      <path d="M16 5.5L15.8 6.1V19.8L16 20L22.5 16.2L16 5.5Z" fill="#8C9EFF" fillOpacity="0.85" />
      <path d="M16 5.5L9.5 16.2L16 20V5.5Z" fill="#627EEA" />
      <path d="M16 21.2L15.9 21.4V26.5L16 26.7L22.5 17.5L16 21.2Z" fill="#8C9EFF" fillOpacity="0.85" />
      <path d="M16 26.7V21.2L9.5 17.5L16 26.7Z" fill="#627EEA" />
      <path d="M16 20L22.5 16.2L16 13.2V20Z" fill="#BAC8FF" />
      <path d="M9.5 16.2L16 20V13.2L9.5 16.2Z" fill="#8C9EFF" />
    </svg>
  );
};

// 4. Solana Logo SVG
const SolanaLogo = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="sol-grad-bg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00FFA3" />
          <stop offset="0.5" stopColor="#DC1FFF" />
          <stop offset="1" stopColor="#00E0FF" />
        </linearGradient>
        <linearGradient id="sol-b1" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#00FFA3" />
          <stop offset="1" stopColor="#DC1FFF" />
        </linearGradient>
        <linearGradient id="sol-b2" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#DC1FFF" />
          <stop offset="1" stopColor="#00FFA3" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="#0D1117" stroke="url(#sol-grad-bg)" strokeWidth="1.5" />
      <path d="M9 10.2C9.2 9.8 9.6 9.5 10.1 9.5H23C23.4 9.5 23.6 10 23.3 10.3L21.2 12.8C21 13.2 20.6 13.5 20.1 13.5H7.2C6.8 13.5 6.6 13 6.9 12.7L9 10.2Z" fill="url(#sol-b1)" />
      <path d="M6.9 17.7C6.6 17.4 6.8 16.9 7.2 16.9H20.1C20.6 16.9 21 17.2 21.2 17.6L23.3 20.1C23.6 20.4 23.4 20.9 23 20.9H10.1C9.6 20.9 9.2 20.6 9 20.2L6.9 17.7Z" fill="url(#sol-b2)" />
      <path d="M9 22.2C9.2 21.8 9.6 21.5 10.1 21.5H23C23.4 21.5 23.6 22 23.3 22.3L21.2 24.8C21 25.2 20.6 25.5 20.1 25.5H7.2C6.8 25.5 6.6 25 6.9 24.7L9 22.2Z" fill="url(#sol-b1)" />
    </svg>
  );
};

// 5. Polygon Logo SVG
const PolygonLogo = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="poly-grad-bg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8247E5" />
          <stop offset="1" stopColor="#C084FC" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="#140B24" stroke="url(#poly-grad-bg)" strokeWidth="1.5" />
      <path
        d="M20.5 13.5L16 11L11.5 13.5V18.5L16 21L20.5 18.5V13.5Z"
        stroke="#C084FC"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill="#8247E5"
        fillOpacity="0.25"
      />
      <path
        d="M16 11V21M11.5 13.5L20.5 18.5M20.5 13.5L11.5 18.5"
        stroke="#C084FC"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
};

// 6. Lace Wallet Logo SVG
const LaceLogo = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="lace-grad-bg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F5A623" />
          <stop offset="1" stopColor="#FFD166" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="#201505" stroke="url(#lace-grad-bg)" strokeWidth="1.5" />
      <path
        d="M16 6L23 13L16 20L9 13L16 6Z"
        fill="#F5A623"
        fillOpacity="0.3"
        stroke="#FFD166"
        strokeWidth="1.8"
      />
      <path
        d="M16 12L23 19L16 26L9 19L16 12Z"
        fill="#F5A623"
        fillOpacity="0.65"
        stroke="#FFD166"
        strokeWidth="1.8"
      />
      <circle cx="16" cy="16" r="2.2" fill="#FFF" />
    </svg>
  );
};

// 7. Compact ZK Prover Logo SVG
const CompactZkLogo = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="zk-grad-bg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#06B6D4" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="#041E28" stroke="url(#zk-grad-bg)" strokeWidth="1.5" />
      <path
        d="M16 7L23 10V16C23 20.5 20 24 16 25.5C12 24 9 20.5 9 16V10L16 7Z"
        stroke="#22D3EE"
        strokeWidth="1.6"
        fill="#06B6D4"
        fillOpacity="0.2"
      />
      <circle cx="16" cy="14.5" r="2.2" fill="#E0F2FE" />
      <path d="M15 16.5H17L17.5 20H14.5L15 16.5Z" fill="#E0F2FE" />
    </svg>
  );
};

// 7 Multi-Chain & Cryptographic Integrations connecting into Zandance Core (Center is 282, 205)
const integrations: IntegrationItem[] = [
  {
    id: "cardano", // Top-Left
    name: "Cardano Preprod",
    badge: "ADA UTXO",
    icon: CardanoLogo,
    x: 110,
    y: 80,
    path: "M 260 205 V 95 Q 260 80 245 80 H 110",
    delay: 0.1,
    color: "#0098EA",
    glowColor: "shadow-sky-500/30 ring-sky-500/40",
  },
  {
    id: "midnight", // Top-Right
    name: "Midnight Network",
    badge: "Shielded ZK",
    icon: MidnightLogo,
    x: 454,
    y: 80,
    path: "M 304 205 V 95 Q 304 80 319 80 H 454",
    delay: 0.2,
    color: "#A855F7",
    glowColor: "shadow-purple-500/30 ring-purple-500/40",
  },
  {
    id: "ethereum", // Mid-Left
    name: "Ethereum EVM",
    badge: "ERC-4337",
    icon: EthereumLogo,
    x: 74,
    y: 205,
    path: "M 252 205 H 74",
    delay: 0.3,
    color: "#627EEA",
    glowColor: "shadow-indigo-500/30 ring-indigo-500/40",
  },
  {
    id: "solana", // Mid-Right
    name: "Solana SVM",
    badge: "High TPS",
    icon: SolanaLogo,
    x: 490,
    y: 205,
    path: "M 312 205 H 490",
    delay: 0.4,
    color: "#14F195",
    glowColor: "shadow-emerald-500/30 ring-emerald-500/40",
  },
  {
    id: "polygon", // Bottom-Left
    name: "Polygon PoS",
    badge: "AggLayer",
    icon: PolygonLogo,
    x: 110,
    y: 330,
    path: "M 260 205 V 315 Q 260 330 245 330 H 110",
    delay: 0.5,
    color: "#8247E5",
    glowColor: "shadow-purple-500/30 ring-purple-500/40",
  },
  {
    id: "lace", // Bottom-Right
    name: "Lace Wallet",
    badge: "DApp API",
    icon: LaceLogo,
    x: 454,
    y: 330,
    path: "M 304 205 V 315 Q 304 330 319 330 H 454",
    delay: 0.6,
    color: "#F5A623",
    glowColor: "shadow-amber-500/30 ring-amber-500/40",
  },
  {
    id: "compact", // Bottom-Center
    name: "Compact Circuits",
    badge: "PLONK WASM",
    icon: CompactZkLogo,
    x: 282,
    y: 345,
    path: "M 282 235 V 345",
    delay: 0.7,
    color: "#06B6D4",
    glowColor: "shadow-cyan-500/30 ring-cyan-500/40",
  },
];

const AnimatedPath = ({ d, id, color }: { d: string; id: string; color: string }) => {
  return (
    <>
      <path
        d={d}
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        className="text-slate-700/40 dark:text-white/10"
      />
      <motion.path
        d={d}
        stroke={`url(#${id})`}
        strokeWidth="2.5"
        fill="none"
        strokeDasharray="40 160"
        initial={{ strokeDashoffset: 200 }}
        animate={{ strokeDashoffset: -200 }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "linear",
          delay: Math.random() * 2,
        }}
      />
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="transparent" />
          <stop
            offset="50%"
            stopColor={color}
            stopOpacity="0.9"
          />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </>
  );
};

export function Integration() {
  const containerId = useId();

  return (
    <div className="relative h-full w-full select-none">
      {/* SVG Connecting Paths with Laser Particles */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 564 410"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {integrations.map((integration) => (
          <AnimatedPath
            key={integration.id}
            d={integration.path}
            color={integration.color}
            id={`${containerId}-${integration.id}`}
          />
        ))}
      </svg>

      {/* Center Hub: Zandance Protocol Moon Emblem */}
      <div className="absolute top-1/2 left-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center">
        <div className="relative flex items-center justify-center rounded-2xl border border-cyan-400/30 bg-slate-950/90 p-1.5 shadow-2xl shadow-cyan-500/20 ring-2 ring-cyan-500/20 backdrop-blur-xl group">
          <div className="relative p-1 rounded-xl bg-gradient-to-br from-cyan-950/60 via-slate-900/90 to-purple-950/60 border border-white/10">
            <img
              src="/zandance_logo.jpg"
              alt="Zandance Protocol Hub"
              className="size-9 sm:size-12 rounded-lg object-cover shadow-inner group-hover:scale-105 transition-transform"
            />
            {/* Glowing Active Status Beacon */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500 border border-slate-900"></span>
            </span>
          </div>

          {/* Holographic Pulse Waves */}
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-cyan-400/40 pointer-events-none"
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-purple-500/30 pointer-events-none"
            animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
        </div>

        {/* Center Sub-badge */}
        <span className="mt-1.5 px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider uppercase bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 rounded-full shadow-xs">
          ZANDANCE HUB
        </span>
      </div>

      {/* Peripheral Multi-Chain & Cryptographic Icons */}
      {integrations.map((integration) => {
        const Icon = integration.icon;
        return (
          <motion.div
            key={integration.id}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: integration.delay, duration: 0.4 }}
            style={{
              left: `${(integration.x / 564) * 100}%`,
              top: `${(integration.y / 410) * 100}%`,
            }}
            className="absolute z-10 flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
          >
            {/* Logo Badge Container */}
            <div
              className={cn(
                "relative flex h-10 w-10 sm:h-13 sm:w-13 items-center justify-center rounded-xl sm:rounded-2xl border border-white/10 bg-slate-900/90 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:scale-115 group-hover:border-white/30",
                integration.glowColor
              )}
            >
              <Icon className="h-6 w-6 sm:h-8 sm:w-8 transition-transform group-hover:rotate-6" />
            </div>

            {/* Micro Badge / Tooltip Label */}
            <div className="absolute -bottom-5 sm:-bottom-6 whitespace-nowrap opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none">
              <span className="px-1.5 py-0.5 text-[8px] sm:text-[9px] font-mono tracking-tight font-medium bg-slate-950/80 text-slate-300 border border-white/10 rounded shadow-xs backdrop-blur-xs">
                {integration.name}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function VisualContainer({ children, className }: VisualContainerProps) {
  return (
    <div
      className={cn(
        "relative flex aspect-564/460 w-full items-center justify-center overflow-hidden rounded-none bg-slate-950/80 p-8 sm:aspect-564/410 border-b border-white/[0.08]",
        className,
      )}
    >
      {/* Midnight Starry Cosmic Dot Grid Background */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "radial-gradient(circle, #38bdf8 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Radiant Glowing Nebula Glows */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 left-1/3 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl" />
      
      {/* Gradient Vignette Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-slate-950/60 via-transparent to-slate-950/80" />
      
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}

const IntegrationCard = ({
  visual,
  title,
  description,
  url,
}: TeamCardProps) => {
  return (
    <Card className="mx-auto flex w-full flex-col sm:max-w-141 rounded-2xl overflow-hidden p-0 ring-1 ring-white/10 border-white/[0.08] bg-slate-900/70 backdrop-blur-xl shadow-2xl shadow-black/50 gap-0">
      <VisualContainer>{visual}</VisualContainer>

      <CardContent className="p-6 sm:p-8 flex flex-col gap-6 sm:gap-8 bg-gradient-to-b from-slate-900/90 to-slate-950/90">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium text-cyan-400 bg-cyan-500/10 border border-cyan-500/20">
              <Sparkles className="size-3" />
              Cross-Chain Infrastructure
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-syne tracking-tight text-white mt-1">
            {title}
          </h3>
          <p className="text-sm sm:text-base leading-relaxed text-slate-300 font-space">
            {description}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <Button
            nativeButton={false}
            className="h-10 rounded-xl px-5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-lg shadow-cyan-500/25 cursor-pointer flex items-center gap-2"
            render={
              <a
                href={url}
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('fee-router') || document.getElementById('showcase');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              />
            }
          >
            Launch Fee Router
            <ArrowRight className="size-4" />
          </Button>

          <a
            href="#developers"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('developers');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-300 px-3 py-2 rounded-lg border border-white/10 hover:border-cyan-500/30 transition-colors"
          >
            <ExternalLink className="size-3.5" />
            Compact SDK Docs
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export function IntegrationCardDemo() {
  return (
    <div className="flex items-center justify-center w-full min-h-96 p-2 sm:p-6">
      <IntegrationCard
        visual={<Integration />}
        title="Universal Multi-Chain Integrations"
        description="Unified zero-gas fee abstraction and shielded witness proofs connecting Cardano, EVM, Solana, and Midnight smart contracts."
        url="#fee-router"
      />
    </div>
  );
}

export default IntegrationCardDemo;
export { IntegrationCard };
