"use client";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

const cves = [
  { id: "CVE-2026-3849", sev: "CRITICAL", topic: "Remote code execution · imageio", score: 9.8 },
  { id: "CVE-2026-3712", sev: "HIGH", topic: "Auth bypass · OAuth proxy", score: 8.4 },
  { id: "CVE-2026-3611", sev: "HIGH", topic: "SSRF · cloud metadata service", score: 8.1 },
  { id: "CVE-2026-3502", sev: "MEDIUM", topic: "XSS · admin console", score: 6.7 },
  { id: "CVE-2026-3401", sev: "CRITICAL", topic: "Deserialization · message bus", score: 9.6 },
  { id: "CVE-2026-3370", sev: "HIGH", topic: "Path traversal · file API", score: 7.9 },
];
const ticker = [...cves, ...cves];
const sevTone = {
  CRITICAL: "text-[color:var(--bsc-rose)] bg-[color-mix(in_oklch,var(--bsc-rose)_12%,transparent)]",
  HIGH: "text-[color:var(--bsc-amber)] bg-[color-mix(in_oklch,var(--bsc-amber)_12%,transparent)]",
  MEDIUM: "text-[color:var(--bsc-accent)] bg-[color-mix(in_oklch,var(--bsc-accent)_12%,transparent)]",
} as const;

const actors = [
  { id: "APT-Iridium", region: "EU", tags: ["Phishing", "AiTM", "MS365"], delta: "+18% wk" },
  { id: "Vulture-04", region: "APAC", tags: ["Ransomware", "AD", "GPO"], delta: "+12% wk" },
  { id: "Hollow-Spirit", region: "AMER", tags: ["Supply Chain", "npm", "CI/CD"], delta: "stable" },
];

export function ThreatIntelSection() {
  return (
    <section className="relative py-28 md:py-36">
      <Container>
        <div className="mb-14 max-w-2xl">
          <Reveal>
            <div className="mb-4 text-[10px] font-mono uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
              Threat Intelligence
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-[clamp(32px,4vw,48px)] font-semibold leading-[1.06] tracking-[-0.022em]">
              Live intelligence,
              <br />
              <span className="text-[color:var(--bsc-text-3)]">scored against your graph.</span>
            </h2>
          </Reveal>
        </div>
      </Container>

      {/* CVE marquee */}
      <div
        className="border-y border-white/[0.06] bg-[color-mix(in_oklch,var(--bsc-void)_85%,black)] py-4"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)",
        }}
      >
        <div className="flex animate-[bsc-tick-slow_70s_linear_infinite] gap-6 whitespace-nowrap">
          {ticker.map((c, i) => (
            <span
              key={`${c.id}-${i}`}
              className="inline-flex items-center gap-3 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-[12px] font-mono"
            >
              <span className={`rounded-sm px-1.5 py-0.5 text-[10px] tracking-wider uppercase ${sevTone[c.sev as keyof typeof sevTone]}`}>
                {c.sev}
              </span>
              <span className="text-[color:var(--bsc-text-1)]">{c.id}</span>
              <span className="text-[color:var(--bsc-text-2)]">{c.topic}</span>
              <span className="text-[color:var(--bsc-text-3)]">CVSS {c.score}</span>
            </span>
          ))}
        </div>
        <style>{`@keyframes bsc-tick-slow { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      </div>

      {/* Actor cards */}
      <Container className="mt-14">
        <div className="grid gap-3 md:grid-cols-3">
          {actors.map((a, i) => (
            <Reveal key={a.id} delay={i * 0.05}>
              <article className="group rounded-2xl border border-white/[0.07] bg-[color-mix(in_oklch,var(--bsc-surface)_72%,transparent)] p-6 transition-colors hover:border-white/15 hover:bg-[color-mix(in_oklch,var(--bsc-surface)_92%,transparent)]">
                <div className="flex items-center justify-between">
                  <span className="text-[16px] font-semibold tracking-[-0.014em] text-[color:var(--bsc-text-1)]">
                    {a.id}
                  </span>
                  <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
                    {a.region}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {a.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[11px] font-mono text-[color:var(--bsc-text-2)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-white/[0.05] pt-4 text-[11px] font-mono">
                  <span className="text-[color:var(--bsc-text-3)]">activity 7d</span>
                  <span className="text-[color:var(--bsc-amber)]">{a.delta}</span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
