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
    body: "Every lab and writeup maps to documented attacker behavior — drawn from CVE analyses, incident reconstructions, and field engagements. Nothing invented.",
    color: "var(--bsc-accent)",
  },
  {
    n: "02",
    title: "Defender and attacker lenses, together",
    body: "Offensive techniques ship alongside the detection engineering required to catch them. Sigma rules, telemetry maps, and evaluation criteria live next to every exploit walkthrough.",
    color: "var(--bsc-violet)",
  },
  {
    n: "03",
    title: "Honest about stage",
    body: "Modules are labeled Available, Build Stage, or Planned. Nothing is promised before it's shipped, and stage labels stay accurate as work progresses.",
    color: "var(--bsc-amber)",
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
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            delay: i * 0.08,
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
      {/* Ambient section glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 65% 45% at 50% 60%, color-mix(in oklch, var(--bsc-violet) 5%, transparent), transparent 75%)",
        }}
      />

      <Container>
        <div className="mb-16 max-w-2xl">
          <div className="mb-4 text-[12px] font-sans font-semibold uppercase tracking-[0.05em] text-[color:var(--bsc-text-3)]">
            How this is built
          </div>
          <h2 className="text-[clamp(30px,3.6vw,44px)] font-semibold leading-[1.07] tracking-[-0.024em]">
            Practical, documented, and reproducible.
          </h2>
          <p className="mt-4 text-[14px] leading-[1.7] text-[color:var(--bsc-text-2)]">
            Three principles that shape every piece of content on this platform.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {principles.map((p) => (
            <article
              key={p.n}
              data-approach
              className="group relative rounded-2xl border border-[color:var(--bsc-line)] bg-[color-mix(in_oklch,var(--bsc-surface)_68%,transparent)] p-7 transition-all duration-300 hover:border-[color:var(--bsc-line-strong)] hover:bg-[color-mix(in_oklch,var(--bsc-surface)_88%,transparent)] hover:-translate-y-0.5"
            >
              {/* Left accent bar */}
              <div
                className="absolute left-0 top-6 bottom-6 w-[3px] rounded-full opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: p.color }}
              />

              {/* Hover glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -left-8 top-0 size-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-[0.12]"
                style={{ background: p.color }}
              />

              {/* Number indicator */}
              <div className="mb-6 flex items-center gap-3">
                <span
                  className="grid size-8 place-items-center rounded-lg border text-[12px] font-sans font-bold tracking-tight transition-all duration-300"
                  style={{
                    color: p.color,
                    borderColor: `color-mix(in oklch, ${p.color} 25%, transparent)`,
                    background: `color-mix(in oklch, ${p.color} 8%, transparent)`,
                  }}
                >
                  {p.n}
                </span>
                <span
                  className="h-px flex-1"
                  style={{
                    background: `linear-gradient(to right, color-mix(in oklch, ${p.color} 30%, transparent), transparent)`,
                  }}
                />
              </div>

              <h3 className="text-[18px] font-semibold tracking-[-0.014em] leading-[1.25] text-[color:var(--bsc-text-1)]">
                {p.title}
              </h3>
              <p className="mt-3 text-[13.5px] leading-[1.7] text-[color:var(--bsc-text-2)]">
                {p.body}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
