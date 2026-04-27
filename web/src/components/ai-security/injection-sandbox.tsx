"use client";

import { useMemo, useState } from "react";
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Eraser,
  PlayCircle,
} from "lucide-react";
import {
  classify,
  PRESETS,
  type ClassifyResult,
  type Verdict,
  type Preset,
} from "@/content/ai-security/injection-rules";

const VERDICT_META: Record<
  Verdict,
  {
    label: string;
    short: string;
    fg: string;
    chip: string;
    Icon: React.ComponentType<{ size?: number; className?: string }>;
  }
> = {
  blocked: {
    label: "Blocked by classifier",
    short: "BLOCKED",
    fg: "oklch(0.78 0.18 25)",
    chip: "border-[oklch(0.78_0.18_25)]/40 bg-[oklch(0.78_0.18_25)]/10 text-[oklch(0.85_0.15_25)]",
    Icon: ShieldAlert,
  },
  suspicious: {
    label: "Borderline — escalate to review",
    short: "SUSPICIOUS",
    fg: "oklch(0.82 0.14 75)",
    chip: "border-[oklch(0.82_0.14_75)]/40 bg-[oklch(0.82_0.14_75)]/10 text-[oklch(0.88_0.12_75)]",
    Icon: Shield,
  },
  allowed: {
    label: "Allowed — no patterns matched",
    short: "ALLOWED",
    fg: "oklch(0.78 0.18 140)",
    chip: "border-[oklch(0.78_0.18_140)]/40 bg-[oklch(0.78_0.18_140)]/10 text-[oklch(0.85_0.14_140)]",
    Icon: ShieldCheck,
  },
};

export function InjectionSandbox() {
  const [prompt, setPrompt] = useState("");
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  const result: ClassifyResult = useMemo(() => classify(prompt), [prompt]);
  const meta = VERDICT_META[result.verdict];

  const loadPreset = (preset: Preset) => {
    setPrompt(preset.prompt);
    setActivePresetId(preset.id);
  };

  const clear = () => {
    setPrompt("");
    setActivePresetId(null);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[color-mix(in_oklch,var(--bsc-surface)_70%,transparent)]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-black/30 px-5 py-2 font-mono text-[9.5px] uppercase tracking-[0.22em] text-[color:var(--bsc-text-3)]">
        <span className="inline-flex items-center gap-2">
          <span
            className="inline-block h-1.5 w-1.5 animate-pulse rounded-full"
            style={{ background: meta.fg }}
          />
          Live classifier · {INJECTION_RULES_COUNT} rules · client-side
        </span>
        <span>v0.4 · regression tracked</span>
      </div>

      <div className="grid gap-px bg-white/[0.04] lg:grid-cols-[1.1fr_1fr]">
        {/* ─── INPUT PANEL ─────────────────────────────── */}
        <div className="bg-[color-mix(in_oklch,var(--bsc-surface)_70%,transparent)] p-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--bsc-text-3)]">
              User prompt
            </div>
            <div className="flex items-center gap-3 font-mono text-[10px] text-[color:var(--bsc-text-3)]">
              <span>{prompt.length} chars</span>
              {prompt.length > 0 && (
                <button
                  type="button"
                  onClick={clear}
                  className="inline-flex items-center gap-1 hover:text-[color:var(--bsc-text-1)]"
                >
                  <Eraser size={11} /> Clear
                </button>
              )}
            </div>
          </div>

          <textarea
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              setActivePresetId(null);
            }}
            spellCheck={false}
            placeholder="Type a prompt or pick a preset attack to see how the classifier scores it…"
            className="h-44 w-full resize-none rounded-md border border-white/[0.08] bg-black/40 p-4 font-mono text-[13px] leading-relaxed text-[color:var(--bsc-text-1)] placeholder:text-[color:var(--bsc-text-3)] outline-none focus:border-[oklch(0.78_0.18_140)]/50"
          />

          {/* Preset chips */}
          <div className="mt-4">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--bsc-text-3)]">
              Preset attacks
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => {
                const active = activePresetId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => loadPreset(p)}
                    className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[10.5px] transition-colors ${
                      active
                        ? "border-[oklch(0.78_0.18_140)]/55 bg-[oklch(0.78_0.18_140)]/10 text-[oklch(0.85_0.14_140)]"
                        : "border-white/[0.08] bg-black/30 text-[color:var(--bsc-text-3)] hover:border-white/[0.18] hover:text-[color:var(--bsc-text-1)]"
                    }`}
                  >
                    {active && <PlayCircle size={11} />}
                    {p.label}
                  </button>
                );
              })}
            </div>
            {activePresetId && (
              <p className="mt-3 max-w-prose text-[12px] leading-relaxed text-[color:var(--bsc-text-3)]">
                {PRESETS.find((p) => p.id === activePresetId)?.note}
              </p>
            )}
          </div>
        </div>

        {/* ─── OUTPUT PANEL ─────────────────────────────── */}
        <div className="bg-[color-mix(in_oklch,var(--bsc-surface)_60%,transparent)] p-6">
          {/* Verdict */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--bsc-text-3)]">
                Verdict
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.16em] ${meta.chip}`}
                >
                  <meta.Icon size={12} />
                  {meta.short}
                </span>
              </div>
              <div className="mt-2 text-[13px] text-[color:var(--bsc-text-2)]">
                {meta.label}
              </div>
            </div>

            {/* Confidence dial */}
            <div className="text-right">
              <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--bsc-text-3)]">
                Confidence
              </div>
              <div
                className="font-mono text-[28px] font-semibold leading-none"
                style={{ color: meta.fg }}
              >
                {result.confidence}
                <span className="text-[14px] opacity-60">%</span>
              </div>
            </div>
          </div>

          {/* Confidence bar */}
          <div className="mt-4 relative h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500 ease-out"
              style={{ width: `${result.confidence}%`, background: meta.fg }}
            />
            {/* threshold ticks */}
            <div className="absolute inset-y-0 left-[30%] w-px bg-white/[0.14]" />
            <div className="absolute inset-y-0 left-[70%] w-px bg-white/[0.14]" />
          </div>
          <div className="mt-1 flex justify-between font-mono text-[9px] uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
            <span>allowed</span>
            <span>suspicious</span>
            <span>blocked</span>
          </div>

          {/* Matched rules */}
          <div className="mt-6">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles size={12} className="text-[oklch(0.78_0.18_140)]" />
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--bsc-text-3)]">
                Matched patterns · {result.matched.length}
              </div>
            </div>

            {result.matched.length === 0 ? (
              <div className="rounded-md border border-white/[0.06] bg-black/20 p-4 text-[13px] text-[color:var(--bsc-text-3)]">
                No detection rules fired. The prompt looks clean to this classifier.
              </div>
            ) : (
              <ul className="space-y-2">
                {result.matched.map(({ rule, sample }) => (
                  <li
                    key={rule.id}
                    className="rounded-md border border-white/[0.07] bg-black/30 p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[oklch(0.78_0.18_140)]" />
                        <span className="text-[13px] font-medium text-[color:var(--bsc-text-1)]">
                          {rule.name}
                        </span>
                        <span className="rounded border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.15em] text-[color:var(--bsc-text-3)]">
                          {rule.category}
                        </span>
                      </div>
                      <span className="shrink-0 font-mono text-[10.5px] text-[color:var(--bsc-text-3)]">
                        weight {rule.weight}
                      </span>
                    </div>
                    <div className="mt-2 text-[12.5px] leading-relaxed text-[color:var(--bsc-text-2)]">
                      {rule.description}
                    </div>
                    <div className="mt-2 overflow-x-auto rounded-sm border border-white/[0.06] bg-black/40 px-2 py-1 font-mono text-[11.5px] text-[oklch(0.85_0.14_140)]">
                      matched: {sample || "(structural pattern)"}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="border-t border-white/[0.06] bg-black/30 px-5 py-3 text-[11.5px] leading-relaxed text-[color:var(--bsc-text-3)]">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--bsc-text-3)]">
          Note ·{" "}
        </span>
        This classifier is intentionally pattern-based and runs in your browser.
        Real production filters layer this with semantic intent classifiers and
        per-user rate-limits — the point here is to make the rule shapes
        legible, not to win every adversarial prompt.
      </div>
    </div>
  );
}

// Local — to avoid a second import round-trip
import { INJECTION_RULES } from "@/content/ai-security/injection-rules";
const INJECTION_RULES_COUNT = INJECTION_RULES.length;
