import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ListingLayout } from "@/components/listings/listing-layout";
import { Reveal } from "@/components/ui/reveal";
import { cveSamples, techniqueCoverage, dashboardSummary } from "@/content/dashboard";
import { osintCases } from "@/content/osint";
import { HtbMetrics } from "@/components/dashboard/htb-metrics";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Curated dashboard view: reviewed CVE feed, tracked OSINT cases, technique coverage map.",
};

const sevTone: Record<string, string> = {
  Critical: "bg-[color-mix(in_oklch,var(--bsc-rose)_14%,transparent)] text-[color:var(--bsc-rose)]",
  High: "bg-[color-mix(in_oklch,var(--bsc-amber)_14%,transparent)] text-[color:var(--bsc-amber)]",
  Medium: "bg-[color-mix(in_oklch,var(--bsc-accent)_14%,transparent)] text-[color:var(--bsc-accent)]",
  Low: "bg-white/[0.04] text-[color:var(--bsc-text-3)]",
};

const statusTone: Record<string, string> = {
  Reviewed: "text-[color:var(--bsc-violet)]",
  Tracked: "text-[color:var(--bsc-amber)]",
  Patched: "text-[color:var(--bsc-accent)]",
};

export default function DashboardPage() {
  const recentOsint = osintCases.slice(0, 3);

  return (
    <ListingLayout
      eyebrow="Dashboard"
      title={
        <>
          Curated security signal.
          <br />
          <span className="text-[color:var(--bsc-text-3)]">Analysis, not noise.</span>
        </>
      }
      lede="A reading view across the CVE work, OSINT investigations, and detection coverage that's currently in scope. Updated as analyses are published - not real-time, deliberately."
    >
      <Container>
        {/* Live Operations Metrics */}
        <div className="mb-12">
          <HtbMetrics />
        </div>

        {/* Summary tiles */}
        <Reveal>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {dashboardSummary.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/[0.07] bg-[color-mix(in_oklch,var(--bsc-surface)_72%,transparent)] p-5"
              >
                <div className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
                  {s.label}
                </div>
                <div className="mt-1.5 text-[28px] font-semibold tracking-[-0.022em] text-[color:var(--bsc-text-1)] tabular-nums">
                  {s.value}
                </div>
                <div className="text-[11px] font-mono text-[color:var(--bsc-text-3)]">
                  {s.note}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* CVE Feed + Coverage */}
        <div className="mt-12 grid gap-3 lg:grid-cols-[1.6fr_1fr]">
          <Reveal>
            <section className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[color-mix(in_oklch,var(--bsc-surface)_70%,transparent)]">
              <header className="flex items-center justify-between border-b border-white/[0.05] px-6 py-4">
                <h2 className="text-[14px] font-semibold tracking-[-0.012em] text-[color:var(--bsc-text-1)]">
                  Reviewed CVEs
                </h2>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
                  Curated · last 90 days
                </span>
              </header>
              <ol className="divide-y divide-white/[0.04] text-[12.5px]">
                {cveSamples.map((c) => (
                  <li
                    key={c.id}
                    className="grid items-center gap-3 px-6 py-3.5 sm:grid-cols-[auto_auto_1fr_auto_auto]"
                  >
                    <span
                      className={cn(
                        "rounded-md px-1.5 py-0.5 text-center text-[10px] font-mono uppercase tracking-wider",
                        sevTone[c.severity],
                      )}
                    >
                      {c.severity}
                    </span>
                    <span className="font-mono text-[color:var(--bsc-text-1)]">{c.id}</span>
                    <span className="text-[color:var(--bsc-text-2)]">{c.topic}</span>
                    <span className="font-mono tabular-nums text-[color:var(--bsc-text-3)]">CVSS {c.cvss}</span>
                    <span
                      className={cn(
                        "text-right font-mono text-[10px] uppercase tracking-wider",
                        statusTone[c.status],
                      )}
                    >
                      {c.status}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          </Reveal>

          <div className="space-y-3">
            <Reveal>
              <section className="rounded-2xl border border-white/[0.07] bg-[color-mix(in_oklch,var(--bsc-surface)_70%,transparent)] p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-[14px] font-semibold tracking-[-0.012em] text-[color:var(--bsc-text-1)]">
                    Technique coverage
                  </h2>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
                    MITRE ATT&amp;CK
                  </span>
                </div>
                <ul className="mt-5 space-y-3.5">
                  {techniqueCoverage.map((t) => (
                    <li key={t.id} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-[color:var(--bsc-text-2)]">
                          <span className="text-[color:var(--bsc-text-3)]">{t.id}</span>{" "}
                          {t.name}
                        </span>
                        <span className="tabular-nums text-[color:var(--bsc-text-1)]">{t.coverage}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
                        <div
                          className="h-full rounded-full bg-[color:var(--bsc-accent)]"
                          style={{ width: `${t.coverage}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-[11px] text-[color:var(--bsc-text-3)]">
                  Coverage reflects rule sets and lab tracks currently shipped - not aspirational scope.
                </p>
              </section>
            </Reveal>

            <Reveal delay={0.05}>
              <section className="rounded-2xl border border-white/[0.07] bg-[color-mix(in_oklch,var(--bsc-surface)_70%,transparent)] p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-[14px] font-semibold tracking-[-0.012em] text-[color:var(--bsc-text-1)]">
                    Recent OSINT
                  </h2>
                  <Link
                    href="/osint"
                    className="text-[11px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)] hover:text-[color:var(--bsc-text-1)]"
                  >
                    All →
                  </Link>
                </div>
                <ul className="mt-4 space-y-3">
                  {recentOsint.map((c) => (
                    <li key={c.slug}>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
                        {c.caseId} · {c.category}
                      </div>
                      <div className="mt-0.5 text-[12.5px] leading-snug text-[color:var(--bsc-text-1)]">
                        {c.title}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          </div>
        </div>
      </Container>
    </ListingLayout>
  );
}
