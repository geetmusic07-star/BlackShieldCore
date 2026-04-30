import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ListingLayout } from "@/components/listings/listing-layout";
import { Reveal } from "@/components/ui/reveal";
import { osintCases } from "@/content/osint";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "OSINT Investigations",
  description:
    "Curated open-source investigations: phishing kit infrastructure, domain squatting, actor tracking, and CDN abuse.",
};

const statusTone: Record<string, string> = {
  Active: "text-[color:var(--bsc-amber)] bg-[color-mix(in_oklch,var(--bsc-amber)_12%,transparent)]",
  Published: "text-[color:var(--bsc-violet)] bg-[color-mix(in_oklch,var(--bsc-violet)_12%,transparent)]",
  Closed: "text-[color:var(--bsc-text-3)] bg-white/[0.04]",
};

export default function OsintPage() {
  return (
    <ListingLayout
      eyebrow="OSINT & Investigations"
      title={
        <>
          Open-source field work.
          <br />
          <span className="text-[color:var(--bsc-text-3)]">Documented, not dramatised.</span>
        </>
      }
      lede="Curated investigations grounded in public source data - phishing kit infrastructure, domain squatting patterns, actor tracking, CDN abuse. Each writeup is analytical, with IoCs and detection notes published alongside."
    >
      <Container>
        <div className="flex flex-col gap-3">
          {osintCases.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.04}>
              <article className="grid gap-6 rounded-2xl border border-white/[0.07] bg-[color-mix(in_oklch,var(--bsc-surface)_72%,transparent)] p-7 transition-colors hover:border-white/15 hover:bg-[color-mix(in_oklch,var(--bsc-surface)_92%,transparent)] md:grid-cols-[1.4fr_1fr] md:p-8">
                <div>
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
                      {c.caseId}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider",
                        statusTone[c.status],
                      )}
                    >
                      <span className="size-1 rounded-full bg-current" />
                      {c.status}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
                      {c.category}
                    </span>
                  </div>
                  <h2 className="text-[20px] font-semibold leading-[1.2] tracking-[-0.018em] text-[color:var(--bsc-text-1)]">
                    {c.title}
                  </h2>
                  <p className="mt-3 text-[14px] leading-relaxed text-[color:var(--bsc-text-2)]">
                    {c.summary}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {c.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[11px] font-mono text-[color:var(--bsc-text-2)]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-accent)]">
                    Findings
                  </div>
                  <ul className="mt-4 space-y-2.5">
                    {c.findings.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 text-[12.5px] leading-[1.55] text-[color:var(--bsc-text-2)]"
                      >
                        <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[color:var(--bsc-accent)]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 border-t border-white/[0.05] pt-3 text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
                    Updated{" "}
                    {new Date(c.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </ListingLayout>
  );
}
