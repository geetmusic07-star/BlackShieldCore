"use client";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

const cards = [
  {
    label: "SOC 2 Type II",
    body: "Audit-ready controls across change management, access, and operations.",
  },
  {
    label: "SSO + SCIM",
    body: "SAML / OIDC enterprise SSO and SCIM 2.0 provisioning across all modules.",
  },
  {
    label: "Data Residency",
    body: "EU and US deployments. Customer-managed encryption keys on the roadmap.",
  },
  {
    label: "Detection-as-Code",
    body: "Every rule, sigma, IAM diff, and netpol change ships through review and CI.",
  },
];

const trust = [
  ["99.97%", "Production uptime · 90d"],
  ["≤ 14d", "Critical-issue patch SLA"],
  ["Annual", "Independent security review"],
];

export function EnterpriseTrustSection() {
  return (
    <section className="relative py-28 md:py-36">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-end">
          <Reveal>
            <div className="max-w-md">
              <div className="mb-4 text-[10px] font-mono uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
                Enterprise & Trust
              </div>
              <h2 className="text-[clamp(30px,3.6vw,44px)] font-semibold leading-[1.07] tracking-[-0.022em]">
                Built to live next to your most sensitive systems.
              </h2>
              <p className="mt-5 text-[15px] leading-relaxed text-[color:var(--bsc-text-2)]">
                Security teams already audit everything they install. We design BlackShield Core
                expecting that — with the controls, processes, and transparency that make those
                reviews short.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.04]">
              {trust.map(([v, l]) => (
                <div
                  key={l}
                  className="bg-[color-mix(in_oklch,var(--bsc-surface)_70%,transparent)] p-5"
                >
                  <div className="text-[24px] font-semibold tracking-[-0.022em] text-[color:var(--bsc-text-1)]">
                    {v}
                  </div>
                  <div className="mt-1 text-[11px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <Reveal key={c.label} delay={i * 0.04}>
              <article className="rounded-2xl border border-white/[0.07] bg-[color-mix(in_oklch,var(--bsc-surface)_70%,transparent)] p-5">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-accent)]">
                  {c.label}
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-[color:var(--bsc-text-2)]">
                  {c.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
