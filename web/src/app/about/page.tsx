import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "About",
  description: "BlackShield Core - mission, principles, and the kind of work we publish.",
};

const stats = [
  { value: "24",  label: "Lab Tracks",       color: "var(--bsc-accent)" },
  { value: "142", label: "CVEs Reviewed",    color: "var(--bsc-rose)" },
  { value: "8",   label: "Research Notes",   color: "var(--bsc-violet)" },
  { value: "10",  label: "Platform Modules", color: "var(--bsc-amber)" },
] as const;

const principles = [
  {
    title: "Grounded in real attack patterns",
    body: "Every lab and writeup maps to documented attacker behavior — not invented scenarios. The examples come from CVE analyses, incident reconstructions, and field work.",
    color: "var(--bsc-accent)",
    n: "01",
  },
  {
    title: "Defender and attacker lenses together",
    body: "Offensive work ships alongside the detection engineering required to catch it. Sigma rules, telemetry maps, and evaluation criteria live next to every exploit walkthrough.",
    color: "var(--bsc-violet)",
    n: "02",
  },
  {
    title: "Honest about stage",
    body: "Modules are labeled Available, Build Stage, or Planned. Nothing here is promised before it's actually shipped — stage labels stay current as work progresses.",
    color: "var(--bsc-amber)",
    n: "03",
  },
  {
    title: "Written by practitioners",
    body: "The content assumes you already know the basics. It goes deeper instead of broader — designed for people who've already read the introductory material.",
    color: "var(--bsc-rose)",
    n: "04",
  },
];

export default function AboutPage() {
  return (
    <section className="relative overflow-hidden pt-40 pb-32 md:pt-52 md:pb-40">
      {/* Ambient header glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 65% 0%, color-mix(in oklch, var(--bsc-accent) 10%, transparent), transparent 65%), radial-gradient(ellipse 55% 40% at 10% 75%, color-mix(in oklch, var(--bsc-violet) 7%, transparent), transparent 65%)",
        }}
      />

      <Container className="max-w-[960px]">
        <Reveal>
          <div className="mb-4 inline-flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
            <span className="size-1 rounded-full bg-[color:var(--bsc-accent)]" />
            About BlackShield Core
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="text-[clamp(40px,5.6vw,68px)] font-semibold leading-[1.03] tracking-[-0.030em] text-[color:var(--bsc-text-1)]">
            A structured research environment
            <br />
            <span
              style={{
                backgroundImage: "linear-gradient(135deg, var(--bsc-text-3) 0%, color-mix(in oklch, var(--bsc-accent) 50%, var(--bsc-text-3)) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              for cybersecurity and AI.
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-6 max-w-[600px] text-[15.5px] leading-[1.75] text-[color:var(--bsc-text-2)]">
            BlackShield Core is a practitioner-grade research and learning platform covering
            the full breadth of modern cybersecurity — from offensive techniques and detection
            engineering to AI adversarial security and open-source intelligence. Everything here
            is built to be useful, documented, and reproducible.
          </p>
        </Reveal>

        {/* Stats */}
        <Reveal delay={0.15}>
          <dl className="mt-14 grid grid-cols-2 gap-x-8 gap-y-5 border-y border-[color:var(--bsc-line)] py-8 md:grid-cols-4">
            {stats.map(({ value, label, color }) => (
              <div key={label} className="group">
                <dd
                  className="text-[32px] font-semibold tracking-[-0.028em] tabular-nums transition-colors"
                  style={{ color }}
                >
                  {value}
                </dd>
                <dt className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[color:var(--bsc-text-3)]">
                  {label}
                </dt>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* Principles */}
        <div className="mt-20 grid gap-4 md:grid-cols-2">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={0.05 * i}>
              <article className="group relative overflow-hidden rounded-2xl border border-[color:var(--bsc-line)] bg-[color-mix(in_oklch,var(--bsc-surface)_70%,transparent)] p-7 transition-all duration-300 hover:border-[color:var(--bsc-line-strong)] hover:bg-[color-mix(in_oklch,var(--bsc-surface)_88%,transparent)] hover:-translate-y-0.5">
                {/* Left accent bar */}
                <div
                  className="absolute left-0 top-6 bottom-6 w-[3px] rounded-full opacity-50 transition-opacity duration-300 group-hover:opacity-100"
                  style={{ background: p.color }}
                />
                {/* Corner glow */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-12 -top-12 size-36 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-[0.10]"
                  style={{ background: p.color }}
                />

                <div className="mb-4 flex items-center gap-3">
                  <span
                    className="grid size-7 place-items-center rounded-md font-mono text-[10px] tracking-wider"
                    style={{
                      color: p.color,
                      background: `color-mix(in oklch, ${p.color} 10%, transparent)`,
                      border: `1px solid color-mix(in oklch, ${p.color} 22%, transparent)`,
                    }}
                  >
                    {p.n}
                  </span>
                </div>

                <h3 className="text-[17px] font-semibold tracking-[-0.013em] leading-[1.3] text-[color:var(--bsc-text-1)]">
                  {p.title}
                </h3>
                <p className="mt-3 text-[13.5px] leading-[1.7] text-[color:var(--bsc-text-2)]">
                  {p.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
