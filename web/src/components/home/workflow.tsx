"use client";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

const steps = [
  {
    n: "01",
    title: "Simulate",
    body: "Run authentic adversary playbooks against the live graph — chained, scoped, and reviewed.",
    sample: [
      "$ bsc sim run apt-iridium --chain wmic+ldap",
      "→ stage 1/5  initial access  ✓",
      "→ stage 2/5  persistence     ✓",
      "→ stage 3/5  lateral mvmt    running",
    ],
  },
  {
    n: "02",
    title: "Detect",
    body: "Every simulation fires through your real XDR / EDR / SIEM. Coverage scored, not estimated.",
    sample: [
      "$ bsc detect score --from sim/0241",
      "→ EDR     CrowdStrike    fired (0.82)",
      "→ SIEM    Splunk         fired (0.91)",
      "→ AI      anomaly model  flagged",
    ],
  },
  {
    n: "03",
    title: "Defend",
    body: "Translate gaps into pull requests: Sigma rules, IAM tightening, network policy diffs.",
    sample: [
      "$ bsc defend propose --from gaps/0241",
      "→ sigma/cc-118.yml      +24 −0",
      "→ iam/svc-bsc-04.tf     +6  −2",
      "→ k8s/netpol/api.yml    +12 −0",
    ],
  },
];

export function WorkflowSection() {
  return (
    <section className="relative py-28 md:py-36">
      <Container>
        <div className="mb-14 max-w-2xl">
          <Reveal>
            <div className="mb-4 text-[10px] font-mono uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
              Operating loop
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-[clamp(32px,4vw,48px)] font-semibold leading-[1.07] tracking-[-0.022em] text-[color:var(--bsc-text-1)]">
              Simulate → Detect → Defend.
              <br />
              <span className="text-[color:var(--bsc-text-3)]">A continuous, measured loop.</span>
            </h2>
          </Reveal>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <article className="group relative h-full overflow-hidden rounded-2xl border border-white/[0.07] bg-[color-mix(in_oklch,var(--bsc-surface)_60%,transparent)] p-7 transition-colors hover:border-white/15">
                <div className="flex items-baseline gap-3">
                  <span className="text-[11px] font-mono tracking-wider text-[color:var(--bsc-accent)]">
                    {s.n}
                  </span>
                  <span className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                </div>
                <h3 className="mt-5 text-[22px] font-semibold tracking-[-0.018em] text-[color:var(--bsc-text-1)]">
                  {s.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-[color:var(--bsc-text-2)]">
                  {s.body}
                </p>
                <div className="mt-6 rounded-lg border border-white/[0.06] bg-[color-mix(in_oklch,var(--bsc-void)_45%,transparent)] p-3 font-mono text-[11px] leading-[1.7] text-[color:var(--bsc-text-2)]">
                  {s.sample.map((line, j) => (
                    <div key={j} className={j === 0 ? "text-[color:var(--bsc-accent)]" : ""}>
                      {line}
                    </div>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
