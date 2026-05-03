"use client";

import { useState } from "react";
import { ArrowSquareOut } from "@phosphor-icons/react";
import { Container } from "@/components/ui/container";
import { ListingLayout } from "@/components/listings/listing-layout";
import type { OsintTool, OsintCategory } from "@/content/types";
import { cn } from "@/lib/utils";

const CATEGORY_STYLE: Record<OsintCategory, { pill: string; glow: string }> = {
  "Threat Intel": {
    pill: "text-[color:var(--bsc-rose)] bg-[color-mix(in_oklch,var(--bsc-rose)_12%,transparent)] border-[color-mix(in_oklch,var(--bsc-rose)_30%,transparent)]",
    glow: "var(--bsc-rose)",
  },
  "DNS & Network": {
    pill: "text-[color:var(--bsc-accent)] bg-[color-mix(in_oklch,var(--bsc-accent)_12%,transparent)] border-[color-mix(in_oklch,var(--bsc-accent)_30%,transparent)]",
    glow: "var(--bsc-accent)",
  },
  "Email & Identity": {
    pill: "text-[color:var(--bsc-amber)] bg-[color-mix(in_oklch,var(--bsc-amber)_12%,transparent)] border-[color-mix(in_oklch,var(--bsc-amber)_30%,transparent)]",
    glow: "var(--bsc-amber)",
  },
  Vulnerability: {
    pill: "text-[color:var(--bsc-violet)] bg-[color-mix(in_oklch,var(--bsc-violet)_12%,transparent)] border-[color-mix(in_oklch,var(--bsc-violet)_30%,transparent)]",
    glow: "var(--bsc-violet)",
  },
  Infrastructure: {
    pill: "text-[color:var(--bsc-text-2)] bg-white/[0.06] border-white/[0.12]",
    glow: "var(--bsc-text-2)",
  },
  Platforms: {
    pill: "text-[color:var(--bsc-text-3)] bg-white/[0.04] border-white/[0.08]",
    glow: "var(--bsc-text-3)",
  },
};

const CATEGORIES: Array<OsintCategory | "All"> = [
  "All",
  "Threat Intel",
  "DNS & Network",
  "Email & Identity",
  "Vulnerability",
  "Infrastructure",
  "Platforms",
];

export function OsintDirectory({ tools }: { tools: OsintTool[] }) {
  const [active, setActive] = useState<OsintCategory | "All">("All");

  const filtered =
    active === "All" ? tools : tools.filter((t) => t.category === active);

  return (
    <ListingLayout
      eyebrow="OSINT Tools"
      title={
        <>
          Tool directory.
          <br />
          <span className="text-[color:var(--bsc-text-3)]">Built for practitioners.</span>
        </>
      }
      lede="Curated collection of open-source intelligence tools used across investigations, threat research, and infrastructure mapping on this platform."
    >
      <Container>
        {/* Category filter tabs */}
        <div className="mb-10 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={cn(
                "rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-all duration-200",
                active === cat
                  ? "border-[color:var(--bsc-accent)] bg-[color-mix(in_oklch,var(--bsc-accent)_12%,transparent)] text-[color:var(--bsc-accent)]"
                  : "border-white/[0.08] bg-white/[0.02] text-[color:var(--bsc-text-3)] hover:border-white/[0.15] hover:text-[color:var(--bsc-text-2)]",
              )}
            >
              {cat === "All" ? `All tools (${tools.length})` : cat}
            </button>
          ))}
        </div>

        {/* Tool count for filtered view */}
        {active !== "All" && (
          <p className="mb-6 font-mono text-[11px] text-[color:var(--bsc-text-3)]">
            {filtered.length} tool{filtered.length !== 1 ? "s" : ""} in {active}
          </p>
        )}

        {/* Grid */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tool) => {
            const style =
              CATEGORY_STYLE[tool.category] ?? CATEGORY_STYLE["Platforms"];
            return (
              <a
                key={tool.name}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[color-mix(in_oklch,var(--bsc-surface)_72%,transparent)] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.15] hover:bg-[color-mix(in_oklch,var(--bsc-surface)_90%,transparent)] hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]"
              >
                {/* Per-card glow on hover */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 size-44 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-[0.10]"
                  style={{ background: style.glow }}
                />

                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span
                      className={cn(
                        "inline-block rounded-md border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.10em]",
                        style.pill,
                      )}
                    >
                      {tool.category}
                    </span>
                    <h3 className="mt-2.5 text-[16px] font-semibold tracking-[-0.012em] text-[color:var(--bsc-text-1)]">
                      {tool.name}
                    </h3>
                  </div>
                  <ArrowSquareOut className="mt-1 size-3.5 shrink-0 text-[color:var(--bsc-text-3)] transition-colors duration-200 group-hover:text-[color:var(--bsc-accent)]" />
                </div>

                <p className="mt-3 flex-1 text-[13px] leading-[1.65] text-[color:var(--bsc-text-2)]">
                  {tool.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {tool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 font-mono text-[10px] text-[color:var(--bsc-text-3)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </a>
            );
          })}
        </div>
      </Container>
    </ListingLayout>
  );
}
