"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/container";
import { StatusBadge } from "@/components/ui/status-badge";
import { ArrowUpRight } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const modules = [
  {
    href: "/labs",
    name: "Cyber Playground",
    category: "Labs",
    desc: "Hands-on offensive scenarios: web exploitation, auth bypasses, cloud abuse, CTF scenarios.",
    stage: "available" as const,
    connects: "→ AI Security · Blog",
  },
  {
    href: "/ai-security",
    name: "AI Security Lab",
    category: "Adversarial ML",
    desc: "LLM red-teaming, prompt-injection experiments, and adversarial classifier work.",
    stage: "available" as const,
    connects: "→ Dashboard · Blog",
  },
  {
    href: "/dashboard",
    name: "Threat Dashboard",
    category: "Intelligence",
    desc: "Aggregated CVE feeds, severity filtering, and geographic threat mapping.",
    stage: "available" as const,
    connects: "→ OSINT · AI Lab",
  },
  {
    href: "/tools",
    name: "Security Tools",
    category: "Utilities",
    desc: "JWT decoder, hash analyzer, log parser, entropy checker.",
    stage: "available" as const,
    connects: "→ Case Studies",
  },
  {
    href: "/blog",
    name: "Technical Blog",
    category: "Writing",
    desc: "Deep-dive research on real attack patterns, detection engineering, and defense.",
    stage: "available" as const,
    connects: "→ Labs · Talks",
  },
  {
    href: "/research",
    name: "Research Notes",
    category: "Analysis",
    desc: "Structured analyses, architecture reviews, and methodology writeups.",
    stage: "available" as const,
    connects: "→ Case Studies",
  },
];

export function PlatformGrid() {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-pg-card]");
      gsap.set(cards, { opacity: 0, y: 28 });
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: wrap.current,
          start: "top 75%",
          once: true,
        },
      });
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative py-24 md:py-32">
      <Container>
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 text-[10px] font-medium uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)] font-mono">
              Platform Ecosystem
            </div>
            <h2 className="text-3xl md:text-[40px] leading-[1.1] font-semibold tracking-[-0.022em]">
              One platform.
              <br />
              <span className="text-[color:var(--bsc-text-3)]">Every attack surface.</span>
            </h2>
          </div>
          <p className="max-w-md text-[15px] leading-relaxed text-[color:var(--bsc-text-2)]">
            Twelve integrated modules. Labs feed blog
            posts, research feeds tools, case studies loop back into labs. Everything compounds.
          </p>
        </div>

        <div
          ref={wrap}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {modules.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              data-pg-card
              className={cn(
                "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.07] bg-[color-mix(in_oklch,var(--bsc-surface)_80%,transparent)] p-6 transition-colors",
                "hover:border-white/15 hover:bg-[color-mix(in_oklch,var(--bsc-surface)_95%,transparent)]",
              )}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-20 size-48 rounded-full bg-[color:var(--bsc-accent)] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-[0.08]"
              />
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
                    {m.category}
                  </span>
                  <StatusBadge variant={m.stage} />
                </div>
                <h3 className="text-[17px] font-semibold tracking-[-0.012em] text-[color:var(--bsc-text-1)]">
                  {m.name}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[color:var(--bsc-text-2)]">
                  {m.desc}
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4 text-[11px] font-mono text-[color:var(--bsc-text-3)]">
                <span>{m.connects}</span>
                <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[color:var(--bsc-text-1)]" />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
