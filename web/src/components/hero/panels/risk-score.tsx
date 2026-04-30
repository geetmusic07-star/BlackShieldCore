"use client";

import { motion, animate, useMotionValue, useTransform } from "motion/react";
import { useEffect } from "react";

export function RiskScorePanel() {
  const value = useMotionValue(0);
  const display = useTransform(value, (v) => Math.round(v));

  useEffect(() => {
    const controls = animate(value, 73, { duration: 1.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] });
    return () => controls.stop();
  }, [value]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[color-mix(in_oklch,var(--bsc-surface)_55%,transparent)] p-5 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.55)]">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[color:var(--bsc-text-3)]">
          Risk Score
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_oklch,var(--bsc-amber)_12%,transparent)] px-2 py-0.5 text-[10px] font-mono text-[color:var(--bsc-amber)]">
          <span className="size-1 rounded-full bg-current" />
          ELEVATED
        </span>
      </div>
      <div className="mt-3 flex items-end gap-2">
        <motion.span className="text-[44px] font-semibold leading-none tracking-[-0.028em] text-[color:var(--bsc-text-1)]">
          {display}
        </motion.span>
        <span className="mb-1 text-[12px] font-mono text-[color:var(--bsc-text-3)]">/ 100</span>
        <span className="mb-1 ml-auto text-[11px] font-mono text-[color:var(--bsc-amber)]">
          ↑ 12 wk/wk
        </span>
      </div>
      {/* Sparkline */}
      <svg viewBox="0 0 200 40" className="mt-4 size-full max-h-12 w-full">
        <defs>
          <linearGradient id="sparkfill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--bsc-accent)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--bsc-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d="M0,28 L20,24 L40,30 L60,22 L80,26 L100,18 L120,14 L140,18 L160,12 L180,8 L200,10 L200,40 L0,40 Z"
          fill="url(#sparkfill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
        <motion.path
          d="M0,28 L20,24 L40,30 L60,22 L80,26 L100,18 L120,14 L140,18 L160,12 L180,8 L200,10"
          fill="none"
          stroke="var(--bsc-accent)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </div>
  );
}
