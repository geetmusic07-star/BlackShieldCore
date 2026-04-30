"use client";

import { motion } from "motion/react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

export function DashboardPreviewSection() {
  return (
    <section className="relative py-28 md:py-40">
      <Container>
        <div className="mb-14 max-w-2xl">
          <Reveal>
            <div className="mb-4 text-[10px] font-mono uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
              Reports & Dashboards
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-[clamp(32px,4vw,48px)] font-semibold leading-[1.06] tracking-[-0.022em]">
              Built for security teams.
              <br />
              <span className="text-[color:var(--bsc-text-3)]">Readable in a meeting.</span>
            </h2>
          </Reveal>
        </div>

        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[color-mix(in_oklch,var(--bsc-surface)_55%,transparent)] p-3 backdrop-blur-xl shadow-[0_40px_120px_-40px_rgba(0,0,0,0.7)] md:p-5">
            {/* fake window chrome */}
            <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[color-mix(in_oklch,var(--bsc-void)_65%,transparent)] px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-[color-mix(in_oklch,var(--bsc-rose)_70%,transparent)]" />
                <span className="size-2.5 rounded-full bg-[color-mix(in_oklch,var(--bsc-amber)_70%,transparent)]" />
                <span className="size-2.5 rounded-full bg-[color-mix(in_oklch,var(--bsc-accent)_70%,transparent)]" />
              </div>
              <div className="font-mono text-[11px] text-[color:var(--bsc-text-3)]">
                operations.blackshieldcore.com / dashboards / soc-overview
              </div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--bsc-text-3)]">
                v0.1
              </span>
            </div>

            <div className="mt-3 grid gap-3 md:grid-cols-12">
              {/* KPI rail */}
              <div className="md:col-span-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["73", "Risk score", "↑ 12"],
                  ["1,284", "Findings 7d", "↓ 4%"],
                  ["18m", "MTTD", "↓ 6m"],
                  ["96.4%", "Coverage", "↑ 2pt"],
                ].map(([v, l, d]) => (
                  <div
                    key={l}
                    className="rounded-xl border border-white/[0.06] bg-[color-mix(in_oklch,var(--bsc-surface)_70%,transparent)] p-4"
                  >
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
                      {l}
                    </div>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-[26px] font-semibold tracking-[-0.022em] text-[color:var(--bsc-text-1)]">
                        {v}
                      </span>
                      <span className="text-[11px] font-mono text-[color:var(--bsc-accent)]">
                        {d}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Big chart */}
              <div className="rounded-xl border border-white/[0.06] bg-[color-mix(in_oklch,var(--bsc-surface)_70%,transparent)] p-5 md:col-span-8">
                <div className="flex items-center justify-between">
                  <div className="text-[12px] font-medium text-[color:var(--bsc-text-1)]">
                    Detection volume - last 30 days
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
                    <span><span className="mr-1.5 inline-block size-1.5 rounded-full bg-[color:var(--bsc-accent)]" />Detections</span>
                    <span><span className="mr-1.5 inline-block size-1.5 rounded-full bg-[color:var(--bsc-violet)]" />AI flagged</span>
                  </div>
                </div>
                <svg viewBox="0 0 600 220" className="mt-4 w-full">
                  <defs>
                    <linearGradient id="dpAreaA" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--bsc-accent)" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="var(--bsc-accent)" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="dpAreaB" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--bsc-violet)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="var(--bsc-violet)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* axes */}
                  {Array.from({ length: 5 }).map((_, i) => (
                    <line key={i} x1={0} y1={40 + i * 40} x2={600} y2={40 + i * 40} stroke="white" strokeOpacity="0.04" />
                  ))}
                  <motion.path
                    d="M0,160 C40,140 80,150 120,120 C160,90 200,110 240,80 C280,50 320,70 360,55 C400,45 440,75 480,60 C520,50 560,70 600,40 L600,220 L0,220 Z"
                    fill="url(#dpAreaA)"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                  />
                  <motion.path
                    d="M0,160 C40,140 80,150 120,120 C160,90 200,110 240,80 C280,50 320,70 360,55 C400,45 440,75 480,60 C520,50 560,70 600,40"
                    fill="none"
                    stroke="var(--bsc-accent)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <motion.path
                    d="M0,180 C40,170 80,165 120,150 C160,140 200,135 240,125 C280,115 320,118 360,108 C400,100 440,110 480,98 C520,90 560,95 600,85 L600,220 L0,220 Z"
                    fill="url(#dpAreaB)"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.15 }}
                  />
                </svg>
              </div>

              {/* Side stack: top techniques */}
              <div className="rounded-xl border border-white/[0.06] bg-[color-mix(in_oklch,var(--bsc-surface)_70%,transparent)] p-5 md:col-span-4">
                <div className="text-[12px] font-medium text-[color:var(--bsc-text-1)]">
                  Top techniques (7d)
                </div>
                <ul className="mt-4 space-y-3.5">
                  {[
                    ["T1078", "Valid accounts", 86],
                    ["T1059", "Command interpreter", 71],
                    ["T1003", "OS credential dumping", 64],
                    ["T1021", "Remote services", 49],
                    ["T1486", "Data encrypted for impact", 28],
                  ].map(([id, name, pct]) => (
                    <li key={id as string} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-[color:var(--bsc-text-2)]">
                          <span className="text-[color:var(--bsc-text-3)]">{id}</span>{" "}
                          {name}
                        </span>
                        <span className="text-[color:var(--bsc-text-1)]">{pct}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true, margin: "-80px" }}
                          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                          className="h-full rounded-full bg-gradient-to-r from-[color:var(--bsc-accent)] to-[color:var(--bsc-violet)]"
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
