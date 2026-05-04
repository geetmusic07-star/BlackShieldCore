"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { ThreatMap2D, type AttackKey } from "@/components/visualization/threat-map-2d";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, PanelRightClose, PanelRightOpen } from "lucide-react";

type Timeframe = "1h" | "6h" | "12h" | "24h" | "1m";

const CATEGORIES: { label: string; key: AttackKey; color: string }[] = [
  { label: "Web Attackers", key: "web", color: "#ff2a6d" },
  { label: "DDoS Attackers", key: "ddos", color: "#ffb300" },
  { label: "Intruders", key: "intruder", color: "#00e5ff" },
  { label: "Scanners", key: "scanner", color: "#0080ff" },
  { label: "Anonymizers", key: "anon", color: "#a020f0" },
];

const TF_LABEL: Record<Timeframe, string> = {
  "1h": "1 hour",
  "6h": "6 hours",
  "12h": "12 hours",
  "24h": "24 hours",
  "1m": "1 month",
};

const TF_BASE_TOTAL: Record<Timeframe, number> = {
  "1h": 142873,
  "6h": 814234,
  "12h": 1623410,
  "24h": 3108442,
  "1m": 91204881,
};

// Sub-vector mapping per attack type. Each spawn picks a sub-vector weighted by
// the relative likelihood — this keeps the "Top Network Attack Vectors" and
// "Top Application Violations" widgets distributed across realistic categories.
const NET_VECTOR_DEFS = ["TCP Flood", "UDP Flood", "Low and Slow Attack", "IP Flood", "DNS Flood", "Port Scan"];
const APP_VIOLATION_DEFS = ["Access violations", "Injections", "Cross-site scripting", "Exploits", "Data theft", "Protocol Violations"];

// type → list of sub-vectors with weights, split between net & app
const TYPE_TO_NET: Record<AttackKey, [string, number][]> = {
  ddos: [["TCP Flood", 6], ["UDP Flood", 3], ["DNS Flood", 1.2], ["IP Flood", 0.6], ["Low and Slow Attack", 0.4]],
  scanner: [["Port Scan", 4], ["TCP Flood", 0.4]],
  intruder: [["TCP Flood", 0.3]],
  web: [],
  anon: [["UDP Flood", 0.2]],
};
const TYPE_TO_APP: Record<AttackKey, [string, number][]> = {
  web: [["Access violations", 5], ["Injections", 2], ["Cross-site scripting", 1.2], ["Protocol Violations", 0.4]],
  intruder: [["Exploits", 4], ["Access violations", 1]],
  anon: [["Data theft", 3], ["Access violations", 0.8]],
  ddos: [],
  scanner: [["Access violations", 0.5]],
};

function pickWeighted(table: [string, number][]): string | null {
  if (!table.length) return null;
  const sum = table.reduce((s, [, w]) => s + w, 0);
  let r = Math.random() * sum;
  for (const [name, w] of table) {
    r -= w;
    if (r <= 0) return name;
  }
  return table[0][0];
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function generateTimeline(tf: Timeframe) {
  const points = 60;
  const mult = { "1h": 1, "6h": 6, "12h": 12, "24h": 24, "1m": 720 }[tf];
  return Array.from({ length: points }, (_, i) => ({
    ts: i,
    web: Math.floor((10 + Math.random() * 30) * mult),
    ddos: Math.floor((20 + Math.random() * 50) * mult),
    intruder: Math.floor((5 + Math.random() * 15) * mult),
    scanner: Math.floor((15 + Math.random() * 25) * mult),
    anon: Math.floor((2 + Math.random() * 10) * mult),
  }));
}

const STATIC_PORTS = {
  udp: [
    { port: 6881, w: 6, h: 2 },
    { port: 11211, w: 4, h: 2 },
    { port: 500, w: 2, h: 2 },
    { port: 5060, w: 6, h: 2 },
    { port: 161, w: 3, h: 1 },
    { port: 65476, w: 2, h: 1 },
    { port: 111, w: 1, h: 1 },
    { port: 389, w: 2, h: 1 },
    { port: 1900, w: 3, h: 1 },
    { port: 1194, w: 2, h: 1 },
  ],
  tcp: [
    { port: 5900, w: 6, h: 2 },
    { port: 5902, w: 3, h: 2 },
    { port: 5901, w: 3, h: 2 },
    { port: 23, w: 4, h: 1 },
    { port: 80, w: 4, h: 1 },
    { port: 443, w: 4, h: 1 },
  ],
};

// ── Sidebar primitives ───────────────────────────────────────────────────────
function SidebarWidget({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-7 last:mb-0">
      <h3 className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35 mb-3 border-b border-white/5 pb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

function StatRow({ name, pct, col, animate }: { name: string; pct: number; col: string; animate: boolean }) {
  const display = Math.max(0, Math.min(100, Math.round(pct * 10) / 10));
  return (
    <div className="mb-2.5 last:mb-0 group cursor-default">
      <div className="flex items-baseline justify-between gap-2 mb-1">
        <span className="text-[11px] font-semibold truncate" style={{ color: col }}>
          {name}
        </span>
        <span className="text-[10px] font-mono text-white/45 tabular-nums">{display.toFixed(1)} %</span>
      </div>
      <div className="h-[2px] bg-white/[0.04] overflow-hidden">
        <motion.div
          animate={{ width: `${display}%` }}
          initial={animate ? { width: `${display}%` } : false}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="h-full"
          style={{ background: col }}
        />
      </div>
    </div>
  );
}

// ── Port treemap ─────────────────────────────────────────────────────────────
function PortTreemap({ ports }: { ports: { port: number; w: number; h: number }[] }) {
  return (
    <div
      className="grid gap-[2px] bg-[#0b1320]"
      style={{ gridTemplateColumns: "repeat(12, minmax(0, 1fr))", gridAutoRows: "34px" }}
    >
      {ports.map((p, i) => {
        const fontSize = Math.min(28, 10 + p.w * 1.6 + p.h * 2);
        return (
          <div
            key={`${p.port}-${i}`}
            className="flex items-center justify-center bg-[#0a1530] hover:bg-[#0e1b3d] transition-colors"
            style={{
              gridColumn: `span ${p.w} / span ${p.w}`,
              gridRow: `span ${p.h} / span ${p.h}`,
            }}
          >
            <span
              className="font-mono font-black text-[#7e84ff] leading-none"
              style={{ fontSize: `${fontSize}px` }}
            >
              {p.port}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Live counter accumulator (ref-backed; flushed to state at fixed cadence) ─
type Counters = {
  total: number;
  byType: Record<AttackKey, number>;
  net: Record<string, number>;
  app: Record<string, number>;
};

function emptyCounters(): Counters {
  return {
    total: 0,
    byType: { web: 0, ddos: 0, intruder: 0, scanner: 0, anon: 0 },
    net: Object.fromEntries(NET_VECTOR_DEFS.map((n) => [n, 0])),
    app: Object.fromEntries(APP_VIOLATION_DEFS.map((n) => [n, 0])),
  };
}

function pctMap(counts: Record<string, number>): Record<string, number> {
  const total = Object.values(counts).reduce((s, v) => s + v, 0);
  if (total === 0) return Object.fromEntries(Object.keys(counts).map((k) => [k, 0]));
  return Object.fromEntries(Object.entries(counts).map(([k, v]) => [k, (v / total) * 100]));
}

// ── Main dashboard ───────────────────────────────────────────────────────────
export function ThreatDashboard() {
  const [tf, setTf] = useState<Timeframe>("1h");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTimelineOpen, setIsTimelineOpen] = useState(true);
  const [timeline, setTimeline] = useState(() => generateTimeline("1h"));

  // Live counters — accumulate in a ref, flush to state every 120ms.
  const liveRef = useRef<Counters>(emptyCounters());
  const [live, setLive] = useState<Counters>(() => emptyCounters());
  const [baseTotal, setBaseTotal] = useState<number>(TF_BASE_TOTAL["1h"]);
  const [pulseCounter, setPulseCounter] = useState(0);

  // Per-type pulse trigger (used to flash legend dots when an attack of that
  // type spawns). Stored as ref so the map's onAttack callback identity stays
  // stable and doesn't re-trigger spawn loops in the child.
  const lastTypeRef = useRef<{ type: AttackKey | null; ts: number }>({ type: null, ts: 0 });

  useEffect(() => {
    setTimeline(generateTimeline(tf));
    setBaseTotal(TF_BASE_TOTAL[tf]);
  }, [tf]);

  // Stable onAttack callback — bumps the live counter ref synchronously so the
  // counter ticks the moment a comet spawns; the visible state catches up on
  // the next flush.
  const handleAttack = useCallback((type: AttackKey) => {
    const c = liveRef.current;
    c.total += 1;
    c.byType[type] += 1;
    const net = pickWeighted(TYPE_TO_NET[type]);
    if (net) c.net[net] = (c.net[net] || 0) + 1;
    const app = pickWeighted(TYPE_TO_APP[type]);
    if (app) c.app[app] = (c.app[app] || 0) + 1;
    lastTypeRef.current = { type, ts: performance.now() };
  }, []);

  // Flush accumulator to render state at ~8Hz — fast enough to feel instant,
  // throttled enough to avoid flooding React with state updates.
  useEffect(() => {
    const id = setInterval(() => {
      setLive({
        total: liveRef.current.total,
        byType: { ...liveRef.current.byType },
        net: { ...liveRef.current.net },
        app: { ...liveRef.current.app },
      });
      setPulseCounter((p) => p + 1);
    }, 120);
    return () => clearInterval(id);
  }, []);

  const timeTicks = useMemo(() => {
    const now = new Date();
    const fmt = (mins: number) => {
      const d = new Date(now.getTime() - mins * 60_000);
      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    };
    return { t40: fmt(40), t20: fmt(20) };
  }, [tf]);

  const netPct = useMemo(() => pctMap(live.net), [live]);
  const appPct = useMemo(() => pctMap(live.app), [live]);
  const typePct = useMemo(() => pctMap(live.byType), [live]);

  // Sorted lists for the widgets
  const netRows = useMemo(
    () =>
      NET_VECTOR_DEFS.map((n) => ({ name: n, pct: netPct[n] || 0 }))
        .sort((a, b) => b.pct - a.pct)
        .slice(0, 5),
    [netPct],
  );
  const appRows = useMemo(
    () =>
      APP_VIOLATION_DEFS.map((n) => ({ name: n, pct: appPct[n] || 0 }))
        .sort((a, b) => b.pct - a.pct)
        .slice(0, 5),
    [appPct],
  );

  const totalAttacks = baseTotal + live.total;

  // Pulse signal: a category lit recently if its counter increased in the last
  // 700ms. We re-derive on each flush by tracking the previous live snapshot.
  const prevByTypeRef = useRef<Record<AttackKey, number>>({ ...live.byType });
  const recentTypes = useMemo(() => {
    const recent: Record<AttackKey, boolean> = { web: false, ddos: false, intruder: false, scanner: false, anon: false };
    (Object.keys(live.byType) as AttackKey[]).forEach((k) => {
      if (live.byType[k] > prevByTypeRef.current[k]) recent[k] = true;
    });
    prevByTypeRef.current = { ...live.byType };
    return recent;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pulseCounter]);

  return (
    <div className="flex flex-col h-[82vh] min-h-[680px] bg-[#000103] text-white select-none overflow-hidden rounded-xl border border-white/10 shadow-[0_30px_120px_-30px_rgba(0,0,0,0.9)]">

      {/* ── Top Navigation ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#050608] z-10">
        <div className="flex flex-col">
          <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-white/90">Live Cyber Threat Map</h2>
          <p className="text-[8px] font-bold text-white/25 uppercase tracking-[0.22em] mt-1">
            Powered by BlackShield Threat Intelligence
          </p>
        </div>

        <button
          onClick={() => setIsSidebarOpen(v => !v)}
          className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white border border-white/5 hover:border-white/15 rounded transition-colors"
        >
          {isSidebarOpen ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
          {isSidebarOpen ? "Collapse" : "Expand"}
        </button>
      </div>

      {/* ── Main Workspace ───────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 relative">

        {/* Map Area */}
        <div className="flex-1 relative bg-black min-w-0">
          <ThreatMap2D onAttack={handleAttack} />

          {/* Attack Types Overlay — dots flash when their type spawns */}
          <div className="absolute top-8 left-8 space-y-3 z-10 backdrop-blur-sm bg-black/30 px-4 py-4 rounded-lg border border-white/5">
            <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-white/35 mb-2">Attack Types</h4>
            {CATEGORIES.map(c => {
              const lit = recentTypes[c.key];
              return (
                <div key={c.key} className="flex items-center gap-3 group cursor-default">
                  <div className="w-4 h-4 rounded-full border border-white/15 flex items-center justify-center p-[3px]">
                    <div
                      className="w-full h-full rounded-full transition-shadow duration-150"
                      style={{
                        background: c.color,
                        boxShadow: lit ? `0 0 14px ${c.color}, 0 0 4px ${c.color}` : `0 0 4px ${c.color}66`,
                      }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-white/65 group-hover:text-white transition-colors">
                    {c.label}
                  </span>
                  <span className="ml-auto text-[10px] font-mono text-white/40 tabular-nums">
                    {(typePct[c.key] || 0).toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bottom Timeline ─────────────────────────────────────────── */}
          <AnimatePresence initial={false}>
            {isTimelineOpen ? (
              <motion.div
                key="timeline"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 180, opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/85 to-transparent backdrop-blur-sm border-t border-white/5"
              >
                <div className="h-full flex flex-col px-6 pt-3 pb-4">
                  <div className="flex items-center justify-between mb-1 text-[9px] font-mono text-white/30 tracking-[0.15em]">
                    <span>{timeTicks.t40}</span>
                    <span>{timeTicks.t20}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-white/60 font-bold">NOW</span>
                      <button
                        onClick={() => setIsTimelineOpen(false)}
                        className="flex items-center gap-1.5 px-2 py-0.5 text-white/40 hover:text-white border border-white/10 hover:border-white/25 rounded transition-colors"
                      >
                        <span>✕</span>
                        <span>COLLAPSE</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 flex items-stretch gap-4 min-h-0">
                    <div className="flex-1 min-w-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={timeline} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                          <CartesianGrid stroke="#ffffff08" vertical={false} />
                          <XAxis dataKey="ts" hide />
                          <YAxis hide />
                          <Tooltip
                            contentStyle={{
                              background: "#0a0d12",
                              border: "1px solid #ffffff14",
                              borderRadius: 4,
                              fontSize: 10,
                            }}
                            labelStyle={{ display: "none" }}
                            cursor={{ stroke: "#ffffff20", strokeWidth: 1 }}
                          />
                          {CATEGORIES.map(c => (
                            <Line
                              key={c.key}
                              type="monotone"
                              dataKey={c.key}
                              stroke={c.color}
                              strokeWidth={1.2}
                              dot={false}
                              isAnimationActive={false}
                            />
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="flex flex-col justify-around py-1 w-[140px] shrink-0">
                      {CATEGORIES.map(c => (
                        <div
                          key={c.key}
                          className="text-[9px] font-black uppercase tracking-[0.18em]"
                          style={{ color: c.color }}
                        >
                          {c.label.toUpperCase()}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <button
                key="expand"
                onClick={() => setIsTimelineOpen(true)}
                className="absolute bottom-4 right-6 flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white/50 hover:text-white border border-white/10 hover:border-white/25 rounded bg-black/60 transition-colors z-10"
              >
                <span>▴</span>
                <span>Expand Timeline</span>
              </button>
            )}
          </AnimatePresence>
        </div>

        {/* ── Analytical Sidebar ─────────────────────────────────────── */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 340, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-[#050608] border-l border-white/5 overflow-y-auto shrink-0"
            >
              <div className="p-6">
                <div className="mb-7">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35 mb-3">
                    Statistics Interval
                  </h3>
                  <div className="relative">
                    <select
                      value={tf}
                      onChange={(e) => setTf(e.target.value as Timeframe)}
                      className="appearance-none w-full bg-white/5 border border-white/10 hover:border-white/20 rounded px-3 py-2 text-[12px] font-semibold text-white pr-9 cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/20 transition-colors"
                    >
                      {(Object.keys(TF_LABEL) as Timeframe[]).map(k => (
                        <option key={k} value={k} className="bg-[#0a0d12]">{TF_LABEL[k]}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 pointer-events-none" />
                  </div>
                </div>

                <SidebarWidget title="Total Attacks Detected">
                  <div className="text-[28px] font-black text-white tabular-nums tracking-tight leading-none mb-1.5">
                    {totalAttacks.toLocaleString()}
                  </div>
                  <p className="text-[9px] font-bold text-white/25 uppercase tracking-[0.18em]">
                    +{live.total.toLocaleString()} since session start
                  </p>
                </SidebarWidget>

                <SidebarWidget title="Top Network Attack Vectors">
                  {netRows.map(v => (
                    <StatRow key={v.name} name={v.name} pct={v.pct} col="#ffb300" animate />
                  ))}
                </SidebarWidget>

                <SidebarWidget title="Top Application Violations">
                  {appRows.map(v => (
                    <StatRow key={v.name} name={v.name} pct={v.pct} col="#ff2a6d" animate />
                  ))}
                </SidebarWidget>

                <SidebarWidget title="Top Scanned UDP Ports">
                  <PortTreemap ports={STATIC_PORTS.udp} />
                </SidebarWidget>

                <SidebarWidget title="Top Scanned TCP Ports">
                  <PortTreemap ports={STATIC_PORTS.tcp} />
                </SidebarWidget>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
