"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";

const CoreScene = dynamic(() => import("./core-scene").then((m) => m.CoreScene), {
  ssr: false,
  loading: () => <div className="size-full" aria-hidden="true" />,
});

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * AI-CORE - the signature hero visual.
 *
 * Frame: a soft glassmorphic vignette holds the WebGL scene with a subtle
 * gradient surround. Annotation chips overlay the core to read as a
 * working command surface, not a tech demo.
 */
export function AICore() {
  return (
    <div className="relative aspect-[1/1.05] w-full">
      {/* Outer halo */}
      <div
        aria-hidden="true"
        className="absolute -inset-10 -z-10 opacity-90"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 45%, color-mix(in oklch, var(--bsc-accent) 22%, transparent), transparent 65%)",
        }}
      />
      {/* Glass frame */}
      <div className="absolute inset-0 overflow-hidden rounded-[28px] border border-white/[0.08] bg-[color-mix(in_oklch,var(--bsc-surface)_45%,transparent)] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.7)] backdrop-blur-xl">
        <div className="absolute inset-0">
          <CoreScene />
        </div>

        {/* Edge inner highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.45)",
          }}
        />

        {/* Top-left label */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
          className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-[color-mix(in_oklch,var(--bsc-void)_60%,transparent)] px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.16em] text-[color:var(--bsc-text-2)] backdrop-blur"
        >
          <span className="size-1.5 rounded-full bg-[color:var(--bsc-accent)]" />
          AI-Core · learning
        </motion.div>

        {/* Top-right metric chip */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75, ease: EASE }}
          className="absolute right-5 top-5 flex items-center gap-3 rounded-xl border border-white/[0.08] bg-[color-mix(in_oklch,var(--bsc-void)_60%,transparent)] px-3 py-1.5 text-[11px] font-mono backdrop-blur"
        >
          <div>
            <div className="text-[9px] uppercase tracking-[0.14em] text-[color:var(--bsc-text-3)]">
              Inference
            </div>
            <div className="text-[color:var(--bsc-text-1)]">2.4k tps</div>
          </div>
          <div className="h-7 w-px bg-white/10" />
          <div>
            <div className="text-[9px] uppercase tracking-[0.14em] text-[color:var(--bsc-text-3)]">
              Drift
            </div>
            <div className="text-[color:var(--bsc-accent)]">stable</div>
          </div>
        </motion.div>

        {/* Bottom-left status pill */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
          className="absolute bottom-5 left-5 max-w-[80%] rounded-xl border border-white/[0.08] bg-[color-mix(in_oklch,var(--bsc-void)_60%,transparent)] p-3 backdrop-blur"
        >
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.14em] text-[color:var(--bsc-violet)]">
              <Diamond />
              Adaptive
            </span>
            <span className="text-[10px] font-mono text-[color:var(--bsc-text-3)]">
              cycle 0241 · 14:32:08
            </span>
          </div>
          <div className="mt-1.5 text-[12px] text-[color:var(--bsc-text-1)]">
            Adversarial pattern absorbed. Classifier weights updated.
          </div>
        </motion.div>

        {/* Bottom-right grid coordinates */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.05, ease: EASE }}
          className="absolute bottom-5 right-5 rounded-xl border border-white/[0.08] bg-[color-mix(in_oklch,var(--bsc-void)_60%,transparent)] px-3 py-1.5 text-right backdrop-blur"
        >
          <div className="text-[9px] font-mono uppercase tracking-[0.14em] text-[color:var(--bsc-text-3)]">
            Coverage
          </div>
          <div className="text-[14px] font-semibold tracking-[-0.018em] text-[color:var(--bsc-text-1)]">
            96.4%
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Diamond() {
  return (
    <svg viewBox="0 0 12 12" className="size-2.5 fill-current">
      <path d="M6 0 L12 6 L6 12 L0 6 Z" />
    </svg>
  );
}
