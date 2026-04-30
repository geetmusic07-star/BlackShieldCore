"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/container";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    kicker: "01",
    title: "Grounded in real attack patterns",
    body: "Every lab, note, and case study maps to documented attacker behavior. The examples come from CVE analyses, incident reconstructions, and field work.",
  },
  {
    kicker: "02",
    title: "Defender and attacker lenses, together",
    body: "Offensive techniques show up next to the detection engineering required to catch them. Rule sets, telemetry maps, and evaluation criteria ship alongside every exploit.",
  },
  {
    kicker: "03",
    title: "Built to compound",
    body: "Modules aren’t isolated silos. Labs link to blog posts, research links to tools, case studies link back to labs. Each piece makes the next one sharper.",
  },
];

export function FeatureStrip() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-feat]");
      items.forEach((item, i) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
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
    <section ref={root} className="relative py-24 md:py-36">
      <Container>
        <div className="grid gap-16 md:grid-cols-3">
          {features.map((f) => (
            <article key={f.kicker} data-feat className="relative">
              <div className="mb-8 flex items-baseline gap-3 border-b border-white/[0.07] pb-4">
                <span className="text-[11px] font-mono tracking-wider text-[color:var(--bsc-accent)]">
                  {f.kicker}
                </span>
                <span className="h-px flex-1 bg-gradient-to-r from-white/[0.1] to-transparent" />
              </div>
              <h3 className="text-[22px] font-semibold tracking-[-0.018em] leading-[1.2] text-[color:var(--bsc-text-1)]">
                {f.title}
              </h3>
              <p className="mt-4 text-[14px] leading-relaxed text-[color:var(--bsc-text-2)]">
                {f.body}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
