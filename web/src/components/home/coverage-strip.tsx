"use client";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

const surfaces = [
  {
    short: "XDR",
    name: "Extended Detection",
    body: "Cross-source correlation across endpoint, network, identity, and cloud telemetry.",
  },
  {
    short: "EDR",
    name: "Endpoint",
    body: "Process and behavioral signals plumbed into the same graph as your IAM and asset data.",
  },
  {
    short: "WAF",
    name: "Web Application",
    body: "Layer-7 attack surface — request anomalies, payload signatures, and bot intelligence.",
  },
  {
    short: "SIEM",
    name: "Log Analytics",
    body: "Rule scoring, coverage drift, and detection-as-code workflows on top of your SIEM.",
  },
  {
    short: "SOAR",
    name: "Response",
    body: "Playbooks fire from BSC alerts — isolate, rotate, raise tickets, post to chat.",
  },
  {
    short: "CSPM",
    name: "Cloud Posture",
    body: "Cloud control-plane drift correlated with identity privilege paths and active threats.",
  },
  {
    short: "IAM",
    name: "Identity",
    body: "Entitlement graphs, dormant credentials, and toxic combinations — surfaced and ranked.",
  },
];

export function CoverageStrip() {
  return (
    <section className="relative py-24 md:py-32">
      <Container>
        <div className="mb-12 grid gap-10 lg:grid-cols-[1fr_2fr] lg:items-end">
          <Reveal>
            <div>
              <div className="mb-4 text-[10px] font-mono uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
                Coverage surfaces
              </div>
              <h2 className="text-[clamp(28px,3.4vw,40px)] font-semibold leading-[1.08] tracking-[-0.022em]">
                The whole defensive stack — under one operating layer.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="text-[14px] leading-relaxed text-[color:var(--bsc-text-2)]">
              BlackShield Core doesn&apos;t replace your stack — it operates it. Detection
              rules, posture findings, and identity insights flow into a single attack-graph
              view that security teams can actually act on.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-[repeat(7,minmax(0,1fr))]">
          {surfaces.map((s, i) => (
            <Reveal key={s.short} delay={i * 0.04}>
              <article className="group relative h-full bg-[color-mix(in_oklch,var(--bsc-surface)_70%,transparent)] p-5 transition-colors hover:bg-[color-mix(in_oklch,var(--bsc-surface)_88%,transparent)]">
                <div className="flex items-baseline justify-between">
                  <span className="text-[24px] font-semibold tracking-[-0.022em] text-[color:var(--bsc-text-1)]">
                    {s.short}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
                    01:0{i + 1}
                  </span>
                </div>
                <div className="mt-1 text-[12px] font-medium text-[color:var(--bsc-text-2)]">
                  {s.name}
                </div>
                <p className="mt-3 text-[12.5px] leading-[1.6] text-[color:var(--bsc-text-3)]">
                  {s.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
