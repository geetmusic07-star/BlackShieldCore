"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/container";

gsap.registerPlugin(ScrollTrigger);

const principles = [
  {
    n: "01",
    title: "Grounded in real attack patterns",
    body: "Every lab and writeup maps to documented attacker behavior. The examples come from CVE analyses, incident reconstructions, and field work — not invented scenarios.",
  },
  {
    n: "02",
    title: "Defender and attacker lenses, together",
    body: "Offensive techniques sit next to the detection engineering required to catch them. Sigma rules, telemetry maps, and evaluation criteria ship alongside every exploit walkthrough.",
  },
  {
    n: "03",
    title: "Honest about stage",
    body: "Modules are labeled Available, Build Stage, or Planned. Nothing here is promised before it's actually shipped, and stage labels stay current as work progresses.",
  },
];

export function ApproachSection() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-approach]");
      items.forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            delay: i * 0.06,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 82%", once: true },
          },
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative py-24 md:py-32">
      <Container>
        <div className="mb-14 max-w-2xl">
          <div className="mb-4 text-[10px] font-mono uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
            How this is built
          </div>
          <h2 className="text-[clamp(28px,3.4vw,40px)] font-semibold leading-[1.08] tracking-[-0.022em]">
            Practical, documented, reproducible.
          </h2>
        </div>
        <div className="grid gap-12 md:grid-cols-3">
          {principles.map((p) => (
            <article key={p.n} data-approach className="relative">
              <div className="mb-6 flex items-baseline gap-3 border-b border-white/[0.07] pb-3">
                <span className="text-[11px] font-mono tracking-wider text-[color:var(--bsc-accent)]">
                  {p.n}
                </span>
                <span className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
              </div>
              <h3 className="text-[19px] font-semibold tracking-[-0.014em] leading-[1.25] text-[color:var(--bsc-text-1)]">
                {p.title}
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-[color:var(--bsc-text-2)]">
                {p.body}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
