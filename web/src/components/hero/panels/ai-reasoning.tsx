"use client";

import { motion } from "motion/react";

export function AIReasoningPanel() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[color-mix(in_oklch,var(--bsc-violet)_8%,transparent)] to-[color-mix(in_oklch,var(--bsc-surface)_60%,transparent)] p-5 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.55)]">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.16em] text-[color:var(--bsc-violet)]">
          <Diamond />
          AI Analyst
        </span>
        <span className="text-[10px] font-mono text-[color:var(--bsc-text-3)]">
          confidence 0.92
        </span>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.4 }}
        className="mt-3 text-[13px] leading-[1.55] text-[color:var(--bsc-text-2)]"
      >
        Aligned with stage 3 of the chain. Lateral movement via{" "}
        <code className="rounded-sm bg-white/[0.05] px-1 py-0.5 font-mono text-[11.5px] text-[color:var(--bsc-text-1)]">
          wmic.exe
        </code>{" "}
        observed on{" "}
        <code className="rounded-sm bg-white/[0.05] px-1 py-0.5 font-mono text-[11.5px] text-[color:var(--bsc-text-1)]">
          host-04
        </code>
        . Recommend isolating the host and rotating service accounts in scope.
      </motion.p>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9, duration: 0.6 }}
        className="mt-4 flex items-center gap-2"
      >
        <button
          type="button"
          className="rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-[color:var(--bsc-text-1)] hover:bg-white/[0.06]"
        >
          Isolate host
        </button>
        <button
          type="button"
          className="rounded-md border border-white/10 bg-white/[0.02] px-2.5 py-1 text-[11px] font-medium text-[color:var(--bsc-text-2)] hover:bg-white/[0.05]"
        >
          Rotate creds
        </button>
        <span className="ml-auto text-[10px] font-mono text-[color:var(--bsc-text-3)]">
          generated 14s ago
        </span>
      </motion.div>
    </div>
  );
}

function Diamond() {
  return (
    <svg viewBox="0 0 12 12" className="size-3 fill-current">
      <path d="M6 0 L12 6 L6 12 L0 6 Z" />
    </svg>
  );
}
