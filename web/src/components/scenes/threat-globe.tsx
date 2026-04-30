"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";

const ThreatGlobeScene = dynamic(
  () => import("./threat-globe-scene").then((m) => m.ThreatGlobeScene),
  { ssr: false, loading: () => <div className="size-full" aria-hidden="true" /> },
);

export function ThreatGlobe() {
  return (
    <div className="relative aspect-square w-full max-w-[520px]">
      <div
        aria-hidden="true"
        className="absolute -inset-12 -z-10 opacity-90"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, color-mix(in oklch, var(--bsc-accent) 18%, transparent), transparent 65%)",
        }}
      />
      <div className="absolute inset-0 overflow-hidden rounded-[24px] border border-white/[0.08] bg-[color-mix(in_oklch,var(--bsc-surface)_45%,transparent)] backdrop-blur-xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">
        <ThreatGlobeScene />
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-[color-mix(in_oklch,var(--bsc-void)_60%,transparent)] px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.16em] text-[color:var(--bsc-text-2)] backdrop-blur"
        >
          <span className="size-1.5 rounded-full bg-[color:var(--bsc-accent)]" />
          Topology · 18 regions
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute bottom-5 right-5 rounded-xl border border-white/[0.08] bg-[color-mix(in_oklch,var(--bsc-void)_60%,transparent)] px-3 py-1.5 text-right backdrop-blur"
        >
          <div className="text-[9px] font-mono uppercase tracking-[0.14em] text-[color:var(--bsc-text-3)]">
            Active arcs
          </div>
          <div className="text-[14px] font-semibold tracking-[-0.018em] text-[color:var(--bsc-text-1)]">
            14 / 1.2k
          </div>
        </motion.div>
      </div>
    </div>
  );
}
