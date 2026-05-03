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
    desc: "Hands-on offensive scenarios across web, auth, cloud, and AI surfaces — mapped to real CVEs and attacker TTPs.",
    stage: "available" as const,
    icon: "labs",
    glowColor: "var(--bsc-accent)",
  },
  {
    href: "/ai-security",
    name: "AI Red Teaming",
    category: "Adversarial ML",
    desc: "LLM jailbreak taxonomy, indirect-injection harness, prompt injection chains, and classifier evaluation frameworks.",
    stage: "build" as const,
    icon: "ai",
    glowColor: "var(--bsc-violet)",
  },
  {
    href: "/dashboard",
    name: "Threat Dashboard",
    category: "Telemetry",
    desc: "Live CVE feed with severity routing, infrastructure actor mapping, and HackTheBox metrics integration.",
    stage: "build" as const,
    icon: "dash",
    glowColor: "var(--bsc-amber)",
  },
  {
    href: "/tools",
    name: "Security Tools",
    category: "Utilities",
    desc: "JWT decoding, hash identification, log parsing, and entropy scoring — lightweight and browser-native.",
    stage: "available" as const,
    icon: "tools",
    glowColor: "var(--bsc-accent)",
  },
  {
    href: "/blog",
    name: "Technical Blog",
    category: "Writing",
    desc: "Practitioner-level deep-dives: how real attacks work, how detection rules break, how defenders should think.",
    stage: "available" as const,
    icon: "blog",
    glowColor: "var(--bsc-text-3)",
  },
  {
    href: "/research",
    name: "Research Notes",
    category: "Analysis",
    desc: "Structured analyses, architecture reviews, and methodology writeups — more depth than a blog post.",
    stage: "available" as const,
    icon: "research",
    glowColor: "var(--bsc-violet)",
  },
  {
    href: "/case-studies",
    name: "Case Studies",
    category: "Reconstructions",
    desc: "Documented incident patterns: full attack chain, dwell time, detection gaps, and defender takeaways.",
    stage: "available" as const,
    icon: "case",
    glowColor: "var(--bsc-rose)",
  },
  {
    href: "/talks",
    name: "Talks & Demos",
    category: "Community",
    desc: "Conference talks paired with slides, live demo repos, and written writeups from BSides to Black Hat.",
    stage: "available" as const,
    icon: "talks",
    glowColor: "var(--bsc-accent)",
  },
  {
    href: "/osint",
    name: "OSINT Tool Directory",
    category: "Intelligence",
    desc: "Curated directory of open-source intelligence tools: threat intel, DNS recon, breach lookups, vulnerability databases, and infrastructure mapping.",
    stage: "available" as const,
    icon: "ops",
    glowColor: "var(--bsc-amber)",
  },
  {
    href: "/home-lab",
    name: "Home Lab",
    category: "Architecture",
    desc: "Self-hosted SIEM, EDR, and AD topology for safe offensive practice, detection tuning, and purple-team work.",
    stage: "available" as const,
    icon: "lab",
    glowColor: "var(--bsc-violet)",
  },
];

export function ModulesGrid() {
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-mg-card]");
      gsap.set(cards, { opacity: 0, y: 36, scale: 0.97 });
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.9,
        stagger: 0.055,
        ease: "power3.out",
        scrollTrigger: { trigger: wrap.current, start: "top 80%", once: true },
      });
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <section className="relative py-28 md:py-36">
      {/* Section ambient layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, color-mix(in oklch, var(--bsc-accent) 4%, transparent), transparent 75%)",
        }}
      />

      <Container>
        <div className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 text-[10px] font-mono uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
              Platform Modules
            </div>
            <h2 className="text-[clamp(32px,4.2vw,52px)] font-semibold leading-[1.05] tracking-[-0.024em]">
              Ten modules.
              <br />
              <span className="text-[color:var(--bsc-text-3)]">Each one feeds the others.</span>
            </h2>
          </div>
          <p className="max-w-md text-[14px] leading-[1.7] text-[color:var(--bsc-text-2)]">
            Labs feed blog posts. Research feeds tools. Case studies loop back into labs.
            Every module is cross-linked and built to compound over time.
          </p>
        </div>

        <div ref={wrap} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              data-mg-card
              className={cn(
                "bsc-card-shimmer group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border bg-[color-mix(in_oklch,var(--bsc-surface)_72%,transparent)] p-6 transition-all duration-300",
                "border-[color:var(--bsc-line)] hover:border-[color:var(--bsc-line-strong)] hover:bg-[color-mix(in_oklch,var(--bsc-surface)_92%,transparent)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)]",
              )}
            >
              {/* Per-module hover glow */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-20 size-52 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-[0.14]"
                style={{ background: m.glowColor }}
              />
              {/* Bottom edge glow line */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(to right, transparent, ${m.glowColor}, transparent)`,
                }}
              />

              <div>
                <div className="mb-4 flex items-center justify-between">
                  <ModuleGlyph kind={m.icon} glowColor={m.glowColor} />
                  <StatusBadge variant={m.stage} />
                </div>
                <div className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
                  {m.category}
                </div>
                <h3 className="mt-1.5 text-[18px] font-semibold tracking-[-0.014em] text-[color:var(--bsc-text-1)]">
                  {m.name}
                </h3>
                <p className="mt-2.5 text-[13px] leading-[1.65] text-[color:var(--bsc-text-2)]">
                  {m.desc}
                </p>
              </div>
              <div className="mt-6 flex items-center border-t border-[color:var(--bsc-line)] pt-4 text-[11px] font-mono text-[color:var(--bsc-text-3)] transition-colors group-hover:text-[color:var(--bsc-text-2)]">
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

function ModuleGlyph({ kind, glowColor }: { kind: string; glowColor: string }) {
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
    <span
      className="grid size-9 place-items-center rounded-lg border border-white/[0.09] bg-white/[0.03] transition-colors duration-300 group-hover:border-white/[0.16]"
      style={{
        color: glowColor,
        boxShadow: "none",
        transition: "box-shadow 0.3s, border-color 0.3s, background-color 0.3s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 14px -2px ${glowColor}55`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      <svg viewBox="0 0 24 24" className="size-4 fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {paths[kind] ?? null}
      </svg>
    </span>
  );
}
