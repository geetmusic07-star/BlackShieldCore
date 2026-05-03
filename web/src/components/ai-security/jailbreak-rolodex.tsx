"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X, ChevronDown, BookOpen, Calendar, RotateCw, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import {
  TECHNIQUES,
  TECHNIQUE_CATEGORIES,
  STATUS_LABELS,
  filterTechniques,
  type TechniqueCategory,
  type TechniqueStatus,
  type JailbreakTechnique,
} from "@/content/ai-security/jailbreak-techniques";

const STATUS_TONE: Record<TechniqueStatus, string> = {
  active:
    "border-[oklch(0.72_0.18_25)]/40 bg-[oklch(0.72_0.18_25)]/10 text-[oklch(0.85_0.15_25)]",
  partial:
    "border-[oklch(0.82_0.14_75)]/40 bg-[oklch(0.82_0.14_75)]/10 text-[oklch(0.88_0.12_75)]",
  patched:
    "border-[oklch(0.78_0.18_140)]/40 bg-[oklch(0.78_0.18_140)]/10 text-[oklch(0.85_0.14_140)]",
  research:
    "border-[oklch(0.72_0.10_290)]/40 bg-[oklch(0.72_0.10_290)]/10 text-[oklch(0.85_0.10_290)]",
};

export function JailbreakRolodex() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<TechniqueCategory | "all">(
    "all",
  );
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(
    () => filterTechniques(query, activeCategory),
    [query, activeCategory],
  );

  // Nudge Lenis (smooth-scroll) to recompute max scroll height when filters
  // or expanded state change - without this the document height is cached
  // and the page becomes "stuck" past the rolodex.
  useEffect(() => {
    const id = window.setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 60);
    return () => window.clearTimeout(id);
  }, [query, activeCategory, expanded, filtered.length]);

  // Per-category counts for filter chip badges
  const counts = useMemo(() => {
    const counts: Record<string, number> = { all: TECHNIQUES.length };
    for (const t of TECHNIQUES) {
      counts[t.category] = (counts[t.category] ?? 0) + 1;
    }
    return counts;
  }, []);

  return (
    <>
      <style>{`
        @keyframes gradientMove {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
      `}</style>
      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[color-mix(in_oklch,var(--bsc-surface)_70%,transparent)]">
      {/* Toolbar */}
      <div className="border-b border-white/[0.06] bg-black/30 px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--bsc-text-3)]">
            <BookOpen size={12} />
            Jailbreak Rolodex · {TECHNIQUES.length} documented techniques
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search
              size={13}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--bsc-text-3)]"
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, mechanism, or payload…"
              className="w-full rounded-md border border-white/[0.08] bg-black/40 pl-8 pr-9 py-2 font-mono text-[12px] text-[color:var(--bsc-text-1)] placeholder:text-[color:var(--bsc-text-3)] outline-none focus:border-[oklch(0.78_0.18_140)]/50"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[color:var(--bsc-text-3)] hover:text-[color:var(--bsc-text-1)]"
                aria-label="Clear search"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Category filter chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          <FilterChip
            active={activeCategory === "all"}
            label="All"
            count={counts.all}
            onClick={() => setActiveCategory("all")}
          />
          {TECHNIQUE_CATEGORIES.map((c) => (
            <FilterChip
              key={c.id}
              active={activeCategory === c.id}
              label={c.label}
              count={counts[c.id] ?? 0}
              onClick={() => setActiveCategory(c.id)}
            />
          ))}
        </div>
      </div>

      {/* Results grid */}
      {filtered.length === 0 ? (
        <div className="px-5 py-16 text-center">
          <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--bsc-text-3)]">
            No matches
          </div>
          <p className="mt-2 text-[13px] text-[color:var(--bsc-text-2)]">
            Try a different search term, or clear the category filter.
          </p>
        </div>
      ) : (
        <ul className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <TechniqueCard
              key={t.slug}
              t={t}
              expanded={expanded === t.slug}
              onToggle={() =>
                setExpanded((cur) => (cur === t.slug ? null : t.slug))
              }
            />
          ))}
        </ul>
      )}

      {/* Footer */}
      <div className="border-t border-white/[0.06] bg-black/30 px-5 py-3 text-[11.5px] leading-relaxed text-[color:var(--bsc-text-3)]">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--bsc-text-3)]">
          Note ·{" "}
        </span>
        Payloads are sanitised illustrations of pattern shape, not working
        exploits. Status reflects effectiveness against current frontier models
        as of early 2026, re-evaluated on each model release.
      </div>
    </div>
    </>
  );
}

function FilterChip({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[10.5px] transition-colors ${
        active
          ? "border-[oklch(0.78_0.18_140)]/55 bg-[oklch(0.78_0.18_140)]/10 text-[oklch(0.85_0.14_140)]"
          : "border-white/[0.08] bg-black/30 text-[color:var(--bsc-text-3)] hover:border-white/[0.18] hover:text-[color:var(--bsc-text-1)]"
      }`}
    >
      <span>{label}</span>
      <span className="opacity-60">{count}</span>
    </button>
  );
}

function TechniqueCard({
  t,
  expanded,
  onToggle,
}: {
  t: JailbreakTechnique;
  expanded: boolean;
  onToggle: () => void;
}) {
  const statusTone = STATUS_TONE[t.status];

  return (
    <li className={`relative w-full ${expanded ? "z-10" : "z-0"} animate-[borderPulse_3s_ease-in-out_infinite]`} style={{ perspective: "1000px" }}>
      <motion.div
        className="relative grid h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        initial={false}
        animate={{ rotateY: expanded ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.2 }}
      >
        {/* Front Face */}
        <motion.div
          className="col-start-1 row-start-1 flex flex-col rounded-xl border border-white/[0.06] bg-black/40 p-5 shadow-lg transition-colors hover:bg-white/[0.02]"
          style={{ backfaceVisibility: "hidden" }}
          whileHover={{ rotateY: 5, scale: 1.02 }}
        >
          {/* Floating shield icon */}
          <ShieldAlert className="absolute top-2 right-2 text-[color:var(--bsc-accent)] opacity-30" size={16} />
          {/* Animated gradient bar */}
          <div className="relative mb-2 h-2 overflow-hidden rounded" style={{ background: "linear-gradient(90deg, var(--bsc-accent), transparent, var(--bsc-accent))", backgroundSize: "200% 100%", animation: "gradientMove 4s linear infinite" }} />
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-[15px] font-semibold leading-tight tracking-[-0.012em] text-[color:var(--bsc-text-1)]">
              {t.name}
            </h3>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.16em] ${statusTone}`}
            >
              {STATUS_LABELS[t.status]}
            </span>
            <span className="rounded border border-white/[0.08] bg-white/[0.02] px-1.5 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.16em] text-[color:var(--bsc-text-3)]">
              {t.category.replace("-", " ")}
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-[9.5px] uppercase tracking-[0.16em] text-[color:var(--bsc-text-3)]">
              <Calendar size={9} />
              {t.firstDocumented}
            </span>
          </div>

          <p className="mt-4 flex-1 text-[12.8px] leading-relaxed text-[color:var(--bsc-text-2)]">
            {t.mechanism}
          </p>

          {/* Decorative Filler */}
          <div className="mt-4 flex h-8 w-full items-end gap-1 border-b border-white/[0.05] pb-1 opacity-40 mix-blend-screen pointer-events-none" aria-hidden="true">
            {Array.from({ length: 24 }).map((_, i) => {
              // Deterministic pseudo-random height based on index and technique name
              const seed = t.name.charCodeAt(i % t.name.length) * 17 + i * 23;
              const height = 15 + (seed % 85);
              return (
                <div
                  key={i}
                  className="flex-1 rounded-t-[1px] bg-[color:var(--bsc-text-3)]"
                  style={{ height: `${height}%`, opacity: 0.3 + (seed % 70) / 100 }}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={onToggle}
            className="mt-6 flex w-full items-center justify-between border-t border-white/[0.05] pt-3 text-[11px] font-medium text-[color:var(--bsc-text-3)] transition-colors hover:text-[color:var(--bsc-text-1)]"
          >
            <span className="uppercase tracking-wider font-mono">View Payload</span>
            <RotateCw size={14} />
          </button>
        </motion.div>

        {/* Back Face */}
        <div 
          className="col-start-1 row-start-1 flex flex-col rounded-xl border border-[oklch(0.78_0.18_140)]/40 bg-black/80 p-5 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="flex-1 space-y-4">
            {/* Payload */}
            <div>
              <div className="mb-1.5 font-mono text-[9.5px] uppercase tracking-[0.2em] text-[color:var(--bsc-text-3)]">
                Sample shape
              </div>
              <pre className="overflow-x-auto rounded-md border border-white/[0.06] bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-[oklch(0.85_0.14_140)] whitespace-pre-wrap">
                {t.payload}
              </pre>
            </div>

            {/* Mitigation */}
            <div>
              <div className="mb-1.5 font-mono text-[9.5px] uppercase tracking-[0.2em] text-[color:var(--bsc-text-3)]">
                Mitigation
              </div>
              <p className="text-[12px] leading-relaxed text-[color:var(--bsc-text-2)]">
                {t.mitigation}
              </p>
            </div>
            
            {/* References */}
            {t.references && t.references.length > 0 && (
              <div>
                <div className="mb-1.5 font-mono text-[9.5px] uppercase tracking-[0.2em] text-[color:var(--bsc-text-3)]">
                  Reference
                </div>
                <ul className="space-y-1">
                  {t.references.map((r, i) => (
                    <li
                      key={i}
                      className="text-[11px] leading-relaxed text-[color:var(--bsc-text-3)]"
                    >
                      · {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <button
            type="button"
            onClick={onToggle}
            className="mt-6 flex w-full items-center justify-between border-t border-white/[0.05] pt-3 text-[11px] font-medium text-[color:var(--bsc-text-3)] transition-colors hover:text-[color:var(--bsc-text-1)]"
          >
            <span className="uppercase tracking-wider font-mono">Back to info</span>
            <RotateCw size={14} />
          </button>
        </div>
      </motion.div>
    </li>
  );
}
