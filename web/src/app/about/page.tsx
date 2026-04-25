import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "About",
  description: "BlackShield Core — mission, principles, and the kind of work we publish.",
};

const stats = [
  ["24", "Lab Tracks"],
  ["142", "CVEs Reviewed"],
  ["18", "Research Notes"],
  ["12", "Platform Modules"],
] as const;

const principles = [
  {
    title: "Grounded in real attack patterns",
    body: "Every lab and writeup maps to documented attacker behavior — not invented scenarios.",
  },
  {
    title: "Defender and attacker lenses together",
    body: "Offensive work ships alongside the detection engineering required to catch it.",
  },
  {
    title: "Honest about stage",
    body: "Modules are labeled Available, Build Stage, or Planned. Nothing is promised that isn't shipped.",
  },
  {
    title: "Written by practitioners",
    body: "The content assumes you already know the basics. It goes deeper instead of broader.",
  },
];

export default function AboutPage() {
  return (
    <section className="relative pt-40 pb-32 md:pt-52 md:pb-40">
      <Container className="max-w-[920px]">
        <Reveal>
          <div className="mb-4 text-[10px] font-medium uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)] font-mono">
            About BlackShield Core
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="text-[clamp(40px,5.4vw,64px)] font-semibold leading-[1.04] tracking-[-0.028em] text-[color:var(--bsc-text-1)]">
            A structured research environment
            <br />
            <span className="text-[color:var(--bsc-text-3)]">for cybersecurity and AI.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-[color:var(--bsc-text-2)]">
            BlackShield Core is built as a structured research and learning environment covering
            the full breadth of modern cybersecurity — from offensive techniques and detection
            engineering to AI security and open-source intelligence. Everything here is built
            to be useful, documented, and reproducible.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <dl className="mt-14 grid grid-cols-2 gap-x-10 gap-y-6 border-y border-white/[0.06] py-8 md:grid-cols-4">
            {stats.map(([v, l]) => (
              <div key={l}>
                <dt className="text-[11px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
                  {l}
                </dt>
                <dd className="mt-1.5 text-[28px] font-semibold tracking-[-0.022em] text-[color:var(--bsc-text-1)]">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <div className="mt-20 grid gap-6 md:grid-cols-2">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={0.05 * i}>
              <article className="rounded-2xl border border-white/[0.07] bg-[color-mix(in_oklch,var(--bsc-surface)_70%,transparent)] p-6">
                <h3 className="text-[17px] font-semibold tracking-[-0.012em] text-[color:var(--bsc-text-1)]">
                  {p.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-[color:var(--bsc-text-2)]">
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
