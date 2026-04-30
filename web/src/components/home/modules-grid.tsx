"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/container";
import { StatusBadge } from "@/components/ui/status-badge";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const modules = [
  {
    href: "/labs",
    name: "Cyber Range",
    category: "Labs",
    desc: "Hands-on offensive scenarios across web, auth, cloud, and AI surfaces.",
    stage: "available" as const,
    icon: "labs",
  },
  {
    href: "/ai-security",
    name: "AI Red Teaming",
    category: "Adversarial ML",
    desc: "LLM jailbreak taxonomy, indirect-injection harness, classifier evaluation.",
    stage: "build" as const,
    icon: "ai",
  },
  {
    href: "/dashboard",
    name: "Threat Dashboard",
    category: "Telemetry",
    desc: "Tracked CVE feed, severity routing, infrastructure mapping, actor pages.",
    stage: "build" as const,
    icon: "dash",
  },
  {
    href: "/tools",
    name: "Security Tools",
    category: "Utilities",
    desc: "Token analysis, hash identification, log parsing, entropy scoring.",
    stage: "available" as const,
    icon: "tools",
  },
  {
    href: "/blog",
    name: "Technical Blog",
    category: "Writing",
    desc: "Deep-dives written by practitioners.",
    stage: "available" as const,
    icon: "blog",
  },
  {
    href: "/research",
    name: "Research Notes",
    category: "Analysis",
    desc: "Structured analyses, architecture reviews, methodology writeups.",
    stage: "available" as const,
    icon: "research",
  },
  {
    href: "/case-studies",
    name: "Case Studies",
    category: "Reconstructions",
    desc: "Documented incident patterns: vector, dwell time, detection gaps.",
    stage: "available" as const,
    icon: "case",
  },
  {
    href: "/talks",
    name: "Talks & Demos",
    category: "Community",
    desc: "Conference recordings paired with slides, code, and writeups.",
    stage: "available" as const,
    icon: "talks",
  },
  {
    href: "/osint",
    name: "OSINT Investigations",
    category: "Field Work",
    desc: "Phishing kit reconstructions, infrastructure mapping, and actor-tracking writeups.",
    stage: "available" as const,
    icon: "ops",
  },
  {
    href: "/home-lab",
    name: "Home Lab",
    category: "Architecture",
    desc: "Self-hosted SIEM, EDR, and AD topology for safe offensive practice and detection work.",
    stage: "available" as const,
    icon: "lab",
  },
];

export function ModulesGrid() {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-mg-card]");
      gsap.set(cards, { opacity: 0, y: 30 });
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.85,
        stagger: 0.06,
        ease: "power3.out",
        scrollTrigger: { trigger: wrap.current, start: "top 78%", once: true },
      });
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative py-28 md:py-36">
      <Container>
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 text-[10px] font-mono uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
              What's inside
            </div>
            <h2 className="text-[clamp(32px,4vw,48px)] font-semibold leading-[1.06] tracking-[-0.022em]">
              Modules.
              <br />
              <span className="text-[color:var(--bsc-text-3)]">Each cross-linked.</span>
            </h2>
          </div>
          <p className="max-w-md text-[14px] leading-relaxed text-[color:var(--bsc-text-2)]">
            Labs feed blog posts. Research feeds tools. Case studies loop back into labs.
            Each module deepens the others.
          </p>
        </div>

        <div ref={wrap} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              data-mg-card
              className={cn(
                "group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.07] bg-[color-mix(in_oklch,var(--bsc-surface)_72%,transparent)] p-6 transition-all duration-300",
                "hover:border-white/15 hover:bg-[color-mix(in_oklch,var(--bsc-surface)_92%,transparent)] hover:-translate-y-0.5",
              )}
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 size-56 rounded-full bg-[color:var(--bsc-accent)] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-[0.10]"
              />
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <ModuleGlyph kind={m.icon} />
                  <StatusBadge variant={m.stage} />
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
                  {m.category}
                </div>
                <h3 className="mt-1 text-[18px] font-semibold tracking-[-0.014em] text-[color:var(--bsc-text-1)]">
                  {m.name}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[color:var(--bsc-text-2)]">
                  {m.desc}
                </p>
              </div>
              <div className="mt-6 flex items-center border-t border-white/[0.06] pt-4 text-[11px] font-mono text-[color:var(--bsc-text-3)]">
                <span>Open module</span>
                <ArrowUpRight className="ml-auto size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[color:var(--bsc-text-1)]" />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

function ModuleGlyph({ kind }: { kind: string }) {
  const paths: Record<string, React.ReactNode> = {
    labs: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    ai: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M16.3 7.7l2.1-2.1M5.6 18.4l2.1-2.1" />
      </>
    ),
    dash: (
      <>
        <path d="M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z" />
      </>
    ),
    tools: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />,
    blog: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M8 13h8M8 17h5" />
      </>
    ),
    research: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </>
    ),
    case: (
      <>
        <path d="M2 9.5a2.5 2.5 0 0 1 2.5-2.5h15A2.5 2.5 0 0 1 22 9.5v9a2.5 2.5 0 0 1-2.5 2.5h-15A2.5 2.5 0 0 1 2 18.5z" />
        <path d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7" />
      </>
    ),
    talks: (
      <>
        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
        <path d="M21 19a2 2 0 0 1-2 2h-1v-6h3zM3 19a2 2 0 0 0 2 2h1v-6H3z" />
      </>
    ),
    ops: (
      <>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </>
    ),
    lab: (
      <>
        <rect x="3" y="4" width="18" height="5" rx="1" />
        <rect x="3" y="10.5" width="18" height="5" rx="1" />
        <rect x="3" y="17" width="18" height="3" rx="1" />
        <circle cx="6.5" cy="6.5" r="0.5" />
        <circle cx="6.5" cy="13" r="0.5" />
      </>
    ),
  };

  return (
    <span className="grid size-9 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-[color:var(--bsc-accent)]">
      <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {paths[kind] ?? null}
      </svg>
    </span>
  );
}
