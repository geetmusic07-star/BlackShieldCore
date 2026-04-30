"use client";

import { motion } from "motion/react";

// 14 columns × 4 rows of MITRE technique coverage cells
const cells = Array.from({ length: 14 * 4 }, (_, i) => {
  // Pseudo-random but deterministic distribution
  const seed = (i * 1103515245 + 12345) & 0x7fffffff;
  const v = (seed % 100) / 100;
  if (v < 0.45) return "covered";
  if (v < 0.7) return "partial";
  if (v < 0.92) return "dim";
  return "alert";
});

const cellStyles: Record<string, string> = {
  covered: "bg-[color-mix(in_oklch,var(--bsc-accent)_45%,transparent)]",
  partial: "bg-[color-mix(in_oklch,var(--bsc-accent)_18%,transparent)]",
  dim: "bg-white/[0.04]",
  alert: "bg-[color-mix(in_oklch,var(--bsc-rose)_45%,transparent)]",
};

export function CoverageMiniPanel() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[color-mix(in_oklch,var(--bsc-surface)_55%,transparent)] p-5 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.55)]">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[color:var(--bsc-text-3)]">
          Technique Coverage · MITRE ATT&amp;CK
        </span>
        <span className="text-[10px] font-mono text-[color:var(--bsc-text-2)]">
          82% covered · 7 alerts
        </span>
      </div>
      <div className="mt-3 grid grid-cols-[repeat(14,minmax(0,1fr))] gap-[3px]">
        {cells.map((kind, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.6 + i * 0.012, ease: [0.22, 1, 0.36, 1] }}
            className={`block aspect-square rounded-[2px] ${cellStyles[kind]}`}
          />
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3 text-[10px] font-mono text-[color:var(--bsc-text-3)]">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-[2px] bg-[color-mix(in_oklch,var(--bsc-accent)_45%,transparent)]" />
          Covered
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-[2px] bg-[color-mix(in_oklch,var(--bsc-accent)_18%,transparent)]" />
          Partial
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-[2px] bg-[color-mix(in_oklch,var(--bsc-rose)_45%,transparent)]" />
          Open alert
        </span>
      </div>
    </div>
  );
}
