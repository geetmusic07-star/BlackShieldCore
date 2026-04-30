"use client";

import { motion } from "motion/react";

const stages = [
  { id: 1, x: 40, y: 110, label: "Initial Access", tag: "T1566" },
  { id: 2, x: 150, y: 50, label: "Persistence", tag: "T1547" },
  { id: 3, x: 270, y: 110, label: "Priv Esc", tag: "T1068" },
  { id: 4, x: 380, y: 60, label: "Lateral", tag: "T1021" },
  { id: 5, x: 490, y: 130, label: "Exfiltration", tag: "T1041" },
];
const edges = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
];

export function AttackGraphPanel() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[color-mix(in_oklch,var(--bsc-surface)_60%,transparent)] p-5 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.55)]">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-[0.16em] text-[color:var(--bsc-text-3)]">
            Attack Path · campaign-0241
          </div>
          <div className="mt-1 text-[13px] font-medium text-[color:var(--bsc-text-1)]">
            Lateral movement via WMIC observed
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_oklch,var(--bsc-rose)_14%,transparent)] px-2 py-0.5 text-[10px] font-mono text-[color:var(--bsc-rose)]">
          <span className="size-1 rounded-full bg-current animate-pulse" />
          ACTIVE
        </span>
      </div>

      <svg viewBox="0 0 540 180" className="mt-4 w-full" aria-hidden="true">
        <defs>
          <linearGradient id="edge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--bsc-accent)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--bsc-violet)" stopOpacity="0.7" />
          </linearGradient>
          <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--bsc-accent)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--bsc-accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Edges */}
        {edges.map(([from, to], i) => {
          const a = stages[from];
          const b = stages[to];
          return (
            <motion.line
              key={`e-${i}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="url(#edge)"
              strokeWidth="1.4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
            />
          );
        })}

        {/* Nodes */}
        {stages.map((s, i) => (
          <motion.g
            key={s.id}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.4 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <circle cx={s.x} cy={s.y} r="22" fill="url(#node-glow)" />
            <circle
              cx={s.x}
              cy={s.y}
              r="9"
              fill="color-mix(in oklch, var(--bsc-surface) 60%, transparent)"
              stroke="color-mix(in oklch, var(--bsc-accent) 60%, transparent)"
              strokeWidth="1"
            />
            <circle cx={s.x} cy={s.y} r="3" fill="var(--bsc-accent)" />
            <text
              x={s.x}
              y={s.y - 18}
              textAnchor="middle"
              className="fill-[color:var(--bsc-text-2)]"
              style={{ font: "500 10px var(--font-sans)" }}
            >
              {s.label}
            </text>
            <text
              x={s.x}
              y={s.y + 26}
              textAnchor="middle"
              className="fill-[color:var(--bsc-text-3)]"
              style={{ font: "500 9px var(--font-mono)" }}
            >
              {s.tag}
            </text>
          </motion.g>
        ))}

        {/* Pulse along the active edge */}
        <motion.circle
          r="3"
          fill="var(--bsc-accent)"
          initial={{ offsetDistance: "0%", opacity: 0 }}
          animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, delay: 2 }}
          style={{
            offsetPath: `path("M${stages[0].x},${stages[0].y} L${stages[1].x},${stages[1].y} L${stages[2].x},${stages[2].y} L${stages[3].x},${stages[3].y} L${stages[4].x},${stages[4].y}")`,
          }}
        />
      </svg>
    </div>
  );
}
