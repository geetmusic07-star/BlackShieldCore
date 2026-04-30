"use client";

import { motion } from "motion/react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

const stages = [
  { id: "src", x: 60, y: 200, label: "Asset surface", tag: "16,420 assets" },
  { id: "n1", x: 200, y: 90, label: "Identity", tag: "T1078" },
  { id: "n2", x: 200, y: 200, label: "Endpoint", tag: "T1059" },
  { id: "n3", x: 200, y: 310, label: "Workload", tag: "T1611" },
  { id: "n4", x: 360, y: 145, label: "AD / Tier-0", tag: "T1003" },
  { id: "n5", x: 360, y: 255, label: "Data plane", tag: "T1530" },
  { id: "exf", x: 520, y: 200, label: "Exfil", tag: "T1041" },
] as const;

const edges: [number, number, "warm" | "cold"][] = [
  [0, 1, "warm"], [0, 2, "warm"], [0, 3, "cold"],
  [1, 4, "warm"], [2, 4, "warm"], [3, 5, "warm"],
  [4, 6, "warm"], [5, 6, "cold"],
];

export function AttackHypervisorSection() {
  return (
    <section className="relative py-28 md:py-40">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-[1fr_1.15fr]">
          {/* Copy */}
          <div className="max-w-lg">
            <Reveal>
              <div className="mb-4 text-[10px] font-mono uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
                Attack Hypervisor
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="text-[clamp(34px,4vw,52px)] font-semibold leading-[1.05] tracking-[-0.024em] text-[color:var(--bsc-text-1)]">
                One graph for the whole attack surface.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 text-[15px] leading-relaxed text-[color:var(--bsc-text-2)]">
                Continuously model identity, endpoint, workload, AD, and data-plane
                relationships into a single live attack graph. Every simulation,
                detection, and AI inference operates on the same shared topology -
                so coverage gaps are visible, not assumed.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <ul className="mt-7 space-y-3 text-[14px] text-[color:var(--bsc-text-2)]">
                {[
                  "Asset graph reconciled every 90 seconds across cloud + on-prem",
                  "Identity-to-asset privilege paths surfaced as first-class edges",
                  "Each detection rule scored against actual technique reachability",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-[color:var(--bsc-accent)]" />
                    {line}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Visual */}
          <Reveal delay={0.1}>
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[color-mix(in_oklch,var(--bsc-surface)_55%,transparent)] p-5 backdrop-blur-xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
              <div className="mb-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.16em] text-[color:var(--bsc-text-3)]">
                <span>Mapped Attack Graph</span>
                <span className="text-[color:var(--bsc-text-2)]">7 nodes · 8 edges · 2 hot paths</span>
              </div>
              <svg viewBox="0 0 600 400" className="w-full" aria-hidden="true">
                <defs>
                  <linearGradient id="warmEdge" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--bsc-accent)" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="var(--bsc-rose)" stopOpacity="0.85" />
                  </linearGradient>
                  <radialGradient id="hotNode" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="var(--bsc-accent)" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="var(--bsc-accent)" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Background grid */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <line
                    key={`vg-${i}`}
                    x1={i * 50}
                    y1={0}
                    x2={i * 50}
                    y2={400}
                    stroke="white"
                    strokeOpacity="0.025"
                  />
                ))}
                {Array.from({ length: 8 }).map((_, i) => (
                  <line
                    key={`hg-${i}`}
                    x1={0}
                    y1={i * 50}
                    x2={600}
                    y2={i * 50}
                    stroke="white"
                    strokeOpacity="0.025"
                  />
                ))}

                {/* Edges */}
                {edges.map(([a, b, kind], i) => {
                  const A = stages[a];
                  const B = stages[b];
                  return (
                    <motion.line
                      key={`e-${i}`}
                      x1={A.x}
                      y1={A.y}
                      x2={B.x}
                      y2={B.y}
                      stroke={kind === "warm" ? "url(#warmEdge)" : "white"}
                      strokeOpacity={kind === "warm" ? 1 : 0.2}
                      strokeWidth={kind === "warm" ? 1.5 : 1}
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.9, delay: 0.05 + i * 0.07 }}
                    />
                  );
                })}

                {/* Nodes */}
                {stages.map((s, i) => (
                  <motion.g
                    key={s.id}
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.07 }}
                  >
                    <circle cx={s.x} cy={s.y} r="28" fill="url(#hotNode)" />
                    <circle
                      cx={s.x}
                      cy={s.y}
                      r="11"
                      fill="color-mix(in oklch, var(--bsc-surface) 90%, transparent)"
                      stroke="color-mix(in oklch, var(--bsc-accent) 65%, transparent)"
                      strokeWidth="1"
                    />
                    <circle cx={s.x} cy={s.y} r="3.5" fill="var(--bsc-accent)" />
                    <text
                      x={s.x}
                      y={s.y - 22}
                      textAnchor="middle"
                      className="fill-[color:var(--bsc-text-1)]"
                      style={{ font: "500 11px var(--font-sans)" }}
                    >
                      {s.label}
                    </text>
                    <text
                      x={s.x}
                      y={s.y + 28}
                      textAnchor="middle"
                      className="fill-[color:var(--bsc-text-3)]"
                      style={{ font: "500 9.5px var(--font-mono)" }}
                    >
                      {s.tag}
                    </text>
                  </motion.g>
                ))}
              </svg>
              <div className="mt-2 flex items-center justify-between border-t border-white/[0.05] pt-3 text-[10px] font-mono uppercase tracking-[0.14em] text-[color:var(--bsc-text-3)]">
                <span>graph · synced 14s ago</span>
                <span className="text-[color:var(--bsc-accent)]">2 paths reach Tier-0</span>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
