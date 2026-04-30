"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Lock,
  Check,
  ChevronRight,
  Play,
  RotateCcw,
  Lightbulb,
  Cpu,
  Globe2,
  Layers,
  Shield,
  Flag,
  Target,
} from "lucide-react";
import {
  LEVELS,
  simulate,
  type Level,
  type SimulationResult,
  type TraceLine,
} from "@/content/ai-security/injection-range";

const TRACE_TONE: Record<TraceLine["kind"], string> = {
  info: "text-[color:var(--bsc-text-2)]",
  ok: "text-[oklch(0.85_0.14_140)]",
  warn: "text-[oklch(0.88_0.12_75)]",
  block: "text-[oklch(0.85_0.15_25)]",
  agent: "text-[oklch(0.85_0.13_230)]",
};

const TRACE_PREFIX: Record<TraceLine["kind"], string> = {
  info: "›",
  ok: "✓",
  warn: "!",
  block: "✕",
  agent: "▸",
};

export function InjectionRange() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cleared, setCleared] = useState<Record<number, string | undefined>>({});
  const [hintOpen, setHintOpen] = useState(false);
  const [payloads, setPayloads] = useState<Record<number, string>>(() => {
    const init: Record<number, string> = {};
    LEVELS.forEach((l) => (init[l.number] = l.starterPayload));
    return init;
  });
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [running, setRunning] = useState(false);
  const traceRef = useRef<HTMLDivElement>(null);

  const level = LEVELS[activeIndex];
  const payload = payloads[level.number] ?? level.starterPayload;
  const isCleared = !!cleared[level.number];

  // Unlock progression: must clear N to access N+1
  const unlocked = useMemo(() => {
    const set = new Set<number>([1]);
    for (const lvl of LEVELS) {
      if (cleared[lvl.number]) {
        const next = lvl.number + 1;
        set.add(next);
      }
    }
    return set;
  }, [cleared]);

  // Aggregate progress
  const clearedCount = Object.keys(cleared).length;

  // Lenis nudge whenever active level / trace changes
  useEffect(() => {
    const id = window.setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 60);
    return () => window.clearTimeout(id);
  }, [activeIndex, result, hintOpen, isCleared]);

  // Auto-scroll trace to bottom on new lines
  useEffect(() => {
    if (traceRef.current) {
      traceRef.current.scrollTop = traceRef.current.scrollHeight;
    }
  }, [result]);

  const updatePayload = (next: string) =>
    setPayloads((p) => ({ ...p, [level.number]: next }));

  const reset = () => {
    setPayloads((p) => ({ ...p, [level.number]: level.starterPayload }));
    setResult(null);
  };

  const run = async () => {
    setRunning(true);
    setResult(null);
    // small delay so the trace transition feels intentional
    await new Promise((r) => setTimeout(r, 280));
    const r = simulate(level, payload);
    setResult(r);
    if (r.passed && !cleared[level.number]) {
      setCleared((c) => ({ ...c, [level.number]: level.flag }));
    }
    setRunning(false);
  };

  const goToNext = () => {
    if (activeIndex < LEVELS.length - 1) {
      setActiveIndex(activeIndex + 1);
      setResult(null);
      setHintOpen(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[color-mix(in_oklch,var(--bsc-surface)_70%,transparent)]">
      {/* Header / classification */}
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-black/30 px-5 py-2 font-mono text-[9.5px] uppercase tracking-[0.22em] text-[color:var(--bsc-text-3)]">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[oklch(0.78_0.18_140)]" />
          Indirect Injection Range · adversarial CTF
        </span>
        <span>
          {clearedCount} / {LEVELS.length} cleared
        </span>
      </div>

      <div className="grid gap-px bg-white/[0.04] lg:grid-cols-[260px_1fr]">
        {/* ─── LEVEL NAVIGATOR ─── */}
        <aside className="bg-[color-mix(in_oklch,var(--bsc-surface)_72%,transparent)] p-4">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--bsc-text-3)]">
            Levels
          </div>
          <ul className="space-y-1.5">
            {LEVELS.map((l, i) => {
              const open = unlocked.has(l.number);
              const done = !!cleared[l.number];
              const active = i === activeIndex;
              return (
                <li key={l.number}>
                  <button
                    type="button"
                    disabled={!open}
                    onClick={() => {
                      setActiveIndex(i);
                      setResult(null);
                      setHintOpen(false);
                    }}
                    className={`group flex w-full items-start gap-3 rounded-md border px-3 py-2.5 text-left transition-colors ${
                      active
                        ? "border-[oklch(0.78_0.18_140)]/55 bg-[oklch(0.78_0.18_140)]/[0.06]"
                        : "border-white/[0.06] bg-black/20"
                    } ${
                      open
                        ? "hover:border-white/[0.18] hover:bg-white/[0.03]"
                        : "cursor-not-allowed opacity-40"
                    }`}
                  >
                    <span
                      className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        done
                          ? "border-[oklch(0.78_0.18_140)] bg-[oklch(0.78_0.18_140)] text-black"
                          : active
                            ? "border-[oklch(0.78_0.18_140)] text-[oklch(0.78_0.18_140)]"
                            : "border-white/[0.14] text-[color:var(--bsc-text-3)]"
                      }`}
                    >
                      {done ? (
                        <Check size={11} strokeWidth={3} />
                      ) : !open ? (
                        <Lock size={10} />
                      ) : (
                        <span className="font-mono text-[10px]">{l.number}</span>
                      )}
                    </span>
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
                        {l.codename}
                      </div>
                      <div
                        className={`mt-0.5 truncate text-[12.5px] ${
                          active
                            ? "text-[color:var(--bsc-text-1)]"
                            : "text-[color:var(--bsc-text-2)] group-hover:text-[color:var(--bsc-text-1)]"
                        }`}
                      >
                        {l.title}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Footer cluster - agent + tool roster */}
          <div className="mt-5 rounded-md border border-white/[0.06] bg-black/30 p-3">
            <div className="mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--bsc-text-3)]">
              <Cpu size={11} /> Agent
            </div>
            <div className="font-mono text-[12px] text-[color:var(--bsc-text-1)]">
              Atlas · v{level.agentVersion}
            </div>
            <div className="mt-3 mb-2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--bsc-text-3)]">
              <Layers size={11} /> Tools
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(["send_message", "search_web", "summarise", "read_email"] as const).map((t) => {
                const gated = level.gatedTools.includes(t);
                return (
                  <span
                    key={t}
                    className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.14em] ${
                      gated
                        ? "border-[oklch(0.85_0.15_25)]/40 bg-[oklch(0.85_0.15_25)]/10 text-[oklch(0.85_0.15_25)] line-through"
                        : "border-white/[0.08] bg-white/[0.02] text-[color:var(--bsc-text-3)]"
                    }`}
                  >
                    {gated && <Lock size={9} />}
                    {t}
                  </span>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ─── MAIN PANEL ─── */}
        <div className="bg-[color-mix(in_oklch,var(--bsc-surface)_60%,transparent)] p-6">
          {/* Briefing */}
          <div className="mb-6">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--bsc-text-3)]">
                Level {level.number} · {level.codename}
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.16em] ${
                  isCleared
                    ? "border-[oklch(0.78_0.18_140)]/40 bg-[oklch(0.78_0.18_140)]/10 text-[oklch(0.85_0.14_140)]"
                    : "border-white/[0.08] bg-white/[0.02] text-[color:var(--bsc-text-3)]"
                }`}
              >
                {isCleared ? (
                  <>
                    <Check size={10} strokeWidth={3} /> cleared
                  </>
                ) : (
                  "active"
                )}
              </span>
            </div>
            <h3 className="text-[20px] font-semibold tracking-[-0.014em] text-[color:var(--bsc-text-1)]">
              {level.title}
            </h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-[color:var(--bsc-text-2)]">
              {level.briefing}
            </p>

            {/* Goal + defenses summary */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-[oklch(0.78_0.18_140)]/30 bg-[oklch(0.78_0.18_140)]/[0.05] p-3">
                <div className="mb-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[oklch(0.85_0.14_140)]">
                  <Target size={11} /> Objective
                </div>
                <div className="text-[13px] text-[color:var(--bsc-text-1)]">{level.goal}</div>
              </div>
              <div className="rounded-md border border-white/[0.08] bg-black/30 p-3">
                <div className="mb-1 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--bsc-text-3)]">
                  <Shield size={11} /> Defense stack
                </div>
                <div className="text-[12.5px] text-[color:var(--bsc-text-2)]">
                  {level.defenses.length === 0 ? (
                    <span className="text-[color:var(--bsc-text-3)]">None (naive baseline)</span>
                  ) : (
                    level.defenses.map((d) => d.label).join(" → ")
                  )}
                </div>
              </div>
            </div>

            {/* Hint reveal */}
            <div className="mt-3">
              {hintOpen ? (
                <div className="flex items-start gap-2 rounded-md border border-[oklch(0.82_0.14_75)]/30 bg-[oklch(0.82_0.14_75)]/[0.06] px-3 py-2 text-[12.5px] text-[oklch(0.88_0.12_75)]">
                  <Lightbulb size={13} className="mt-0.5 shrink-0" />
                  <span>{level.hint}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setHintOpen(true)}
                  className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[color:var(--bsc-text-3)] hover:text-[color:var(--bsc-text-1)]"
                >
                  <Lightbulb size={11} /> Reveal hint
                </button>
              )}
            </div>
          </div>

          {/* Page payload editor */}
          <div className="mb-4 rounded-xl border border-white/[0.08] bg-black/40">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--bsc-text-3)]">
              <span className="inline-flex items-center gap-1.5">
                <Globe2 size={11} /> https://attacker-controlled.local/post · page body
              </span>
              <span>{payload.length} bytes</span>
            </div>
            <textarea
              value={payload}
              onChange={(e) => updatePayload(e.target.value)}
              spellCheck={false}
              className="h-48 w-full resize-none bg-transparent p-4 font-mono text-[13px] leading-relaxed text-[color:var(--bsc-text-1)] outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={run}
              disabled={running}
              className="inline-flex items-center gap-2 rounded-md bg-[oklch(0.78_0.18_140)] px-5 py-2.5 text-[13px] font-medium text-black hover:bg-[oklch(0.82_0.18_140)] disabled:cursor-progress disabled:opacity-60"
            >
              <Play size={13} />
              {running ? "Atlas processing…" : "Have Atlas fetch the page"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-md border border-white/[0.08] bg-transparent px-4 py-2 text-[13px] text-[color:var(--bsc-text-3)] hover:text-[color:var(--bsc-text-1)]"
            >
              <RotateCcw size={13} /> Reset payload
            </button>
            {isCleared && activeIndex < LEVELS.length - 1 && (
              <button
                type="button"
                onClick={goToNext}
                className="ml-auto inline-flex items-center gap-2 rounded-md border border-[oklch(0.78_0.18_140)]/55 bg-[oklch(0.78_0.18_140)]/10 px-4 py-2 text-[13px] font-medium text-[oklch(0.85_0.14_140)] hover:bg-[oklch(0.78_0.18_140)]/15"
              >
                Next level <ChevronRight size={14} />
              </button>
            )}
          </div>

          {/* Trace */}
          <div className="mt-6">
            <div className="mb-2 flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--bsc-text-3)]">
                Atlas trace
              </span>
              {result && (
                <span
                  className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.16em] ${
                    result.passed
                      ? "border-[oklch(0.78_0.18_140)]/40 bg-[oklch(0.78_0.18_140)]/10 text-[oklch(0.85_0.14_140)]"
                      : "border-[oklch(0.85_0.15_25)]/40 bg-[oklch(0.85_0.15_25)]/10 text-[oklch(0.85_0.15_25)]"
                  }`}
                >
                  {result.passed ? "injection succeeded" : "injection failed"}
                </span>
              )}
            </div>
            <div
              ref={traceRef}
              className="max-h-[320px] min-h-[120px] overflow-y-auto rounded-md border border-white/[0.08] bg-black/60 p-4 font-mono text-[12px] leading-[1.7]"
            >
              {!result ? (
                <div className="text-[color:var(--bsc-text-3)]">
                  Trace appears here when you run the level. Edit the page payload above and press
                  &quot;Have Atlas fetch the page&quot;.
                </div>
              ) : (
                <ul className="space-y-1">
                  {result.trace.map((line, i) => (
                    <li key={i} className={TRACE_TONE[line.kind]}>
                      <span className="opacity-50">{TRACE_PREFIX[line.kind]}</span>{" "}
                      <span className="whitespace-pre-wrap">{line.text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Flag panel on success */}
          {result?.passed && (
            <div className="mt-5 rounded-xl border border-[oklch(0.78_0.18_140)]/40 bg-[oklch(0.78_0.18_140)]/[0.08] p-4">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[oklch(0.85_0.14_140)]">
                <Flag size={11} /> Flag captured
              </div>
              <div className="mt-1.5 font-mono text-[14px] text-[color:var(--bsc-text-1)]">
                {level.flag}
              </div>
              <p className="mt-2 text-[12.5px] leading-relaxed text-[color:var(--bsc-text-2)]">
                {result.reason}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom note */}
      <div className="border-t border-white/[0.06] bg-black/30 px-5 py-3 text-[11.5px] leading-relaxed text-[color:var(--bsc-text-3)]">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--bsc-text-3)]">
          Note ·{" "}
        </span>
        Atlas is a deterministic state-machine simulator. No real model is called. The defense
        layers and tool detector are pattern-based and run client-side. The point is to make the
        attacker's choices and the defender's stack legible to each other; the techniques are
        documented in the rolodex above.
      </div>
    </div>
  );
}
