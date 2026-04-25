"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

const stream = [
  { t: "00:14:32", src: "EDR", msg: "process injection on host-04", tone: "warn" },
  { t: "00:14:33", src: "SIEM", msg: "rule SR-219 fired (T1055)", tone: "info" },
  { t: "00:14:34", src: "CTI", msg: "IOC match: actor APT-Iridium", tone: "alert" },
  { t: "00:14:35", src: "WAF", msg: "blocked 3 SSRF attempts /api/proxy", tone: "info" },
  { t: "00:14:36", src: "AI", msg: "lateral movement confidence 0.92", tone: "warn" },
  { t: "00:14:37", src: "EDR", msg: "service account escalation host-04", tone: "alert" },
  { t: "00:14:38", src: "SIEM", msg: "correlation chain CC-118 closed", tone: "info" },
] as const;

const toneColor = {
  info: "text-[color:var(--bsc-text-2)]",
  warn: "text-[color:var(--bsc-amber)]",
  alert: "text-[color:var(--bsc-rose)]",
} as const;

export function TelemetryFeedPanel() {
  const [head, setHead] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setHead((h) => (h + 1) % stream.length), 2200);
    return () => clearInterval(id);
  }, []);

  // Build the visible window (4 lines) starting at head, wrapping
  const view = Array.from({ length: 4 }, (_, i) => stream[(head + i) % stream.length]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[color-mix(in_oklch,var(--bsc-surface)_55%,transparent)] p-5 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.55)]">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase tracking-[0.16em] text-[color:var(--bsc-text-3)]">
          Live Telemetry
        </span>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[color:var(--bsc-accent)]">
          <span className="size-1 rounded-full bg-current animate-pulse" />
          STREAMING
        </span>
      </div>
      <div className="mt-3 space-y-1.5 font-mono text-[11px] leading-[1.6]">
        <AnimatePresence initial={false} mode="popLayout">
          {view.map((line, i) => (
            <motion.div
              key={`${head}-${i}`}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: i === 0 ? 1 : 0.85 - i * 0.18, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-baseline gap-2.5 truncate"
            >
              <span className="text-[color:var(--bsc-text-3)]">{line.t}</span>
              <span className="rounded-sm border border-white/[0.06] bg-white/[0.02] px-1 text-[10px] tracking-wider text-[color:var(--bsc-text-3)]">
                {line.src}
              </span>
              <span className={toneColor[line.tone]}>{line.msg}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
