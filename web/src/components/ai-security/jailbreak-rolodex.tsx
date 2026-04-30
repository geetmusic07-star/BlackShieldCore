"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, X, ChevronDown, BookOpen, Calendar } from "lucide-react";
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
        <ul className="grid gap-px bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-3">
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
    <li
      className={`bg-[color-mix(in_oklch,var(--bsc-surface)_70%,transparent)] transition-colors ${
        expanded ? "ring-1 ring-inset ring-[oklch(0.78_0.18_140)]/30" : ""
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full flex-col gap-3 p-5 text-left transition-colors hover:bg-white/[0.02]"
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-semibold leading-tight tracking-[-0.012em] text-[color:var(--bsc-text-1)]">
            {t.name}
          </h3>
          <ChevronDown
            size={14}
            className={`mt-1 shrink-0 text-[color:var(--bsc-text-3)] transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
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

        <p className="text-[12.8px] leading-relaxed text-[color:var(--bsc-text-2)]">
          {t.mechanism}
        </p>
      </button>

      {expanded && (
        <div className="border-t border-white/[0.06] px-5 pb-5 pt-4">
          <div className="space-y-4">
            {/* Payload */}
            <div>
              <div className="mb-1.5 font-mono text-[9.5px] uppercase tracking-[0.2em] text-[color:var(--bsc-text-3)]">
                Sample shape
              </div>
              <pre className="overflow-x-auto rounded-md border border-white/[0.06] bg-black/40 p-3 font-mono text-[11.5px] leading-relaxed text-[oklch(0.85_0.14_140)] whitespace-pre-wrap">
                {t.payload}
              </pre>
            </div>

            {/* Mitigation */}
            <div>
              <div className="mb-1.5 font-mono text-[9.5px] uppercase tracking-[0.2em] text-[color:var(--bsc-text-3)]">
                Mitigation
              </div>
              <p className="text-[12.5px] leading-relaxed text-[color:var(--bsc-text-2)]">
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
                      className="text-[12px] leading-relaxed text-[color:var(--bsc-text-3)]"
                    >
                      · {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </li>
  );
}
