"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";

const InferenceMeshScene = dynamic(
  () => import("./inference-mesh-scene").then((m) => m.InferenceMeshScene),
  { ssr: false, loading: () => <div className="size-full" aria-hidden="true" /> },
);

export function InferenceMesh() {
  return (
    <div className="relative aspect-[5/4] w-full">
      <div
        aria-hidden="true"
        className="absolute -inset-10 -z-10 opacity-90"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, color-mix(in oklch, var(--bsc-violet) 16%, transparent), transparent 65%)",
        }}
      />
      <div className="absolute inset-0 overflow-hidden rounded-[24px] border border-white/[0.08] bg-gradient-to-br from-[color-mix(in_oklch,var(--bsc-violet)_8%,transparent)] to-[color-mix(in_oklch,var(--bsc-surface)_60%,transparent)] backdrop-blur-xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">
        <InferenceMeshScene />
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-[color-mix(in_oklch,var(--bsc-void)_60%,transparent)] px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.16em] text-[color:var(--bsc-violet)] backdrop-blur"
        >
          <Diamond />
          Inference mesh · adversarial
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute bottom-5 right-5 rounded-xl border border-white/[0.08] bg-[color-mix(in_oklch,var(--bsc-void)_60%,transparent)] px-3 py-1.5 text-right backdrop-blur"
        >
          <div className="text-[9px] font-mono uppercase tracking-[0.14em] text-[color:var(--bsc-text-3)]">
            Layer F1
          </div>
          <div className="text-[14px] font-semibold tracking-[-0.018em] text-[color:var(--bsc-text-1)]">
            0.962
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
