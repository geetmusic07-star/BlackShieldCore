import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { StatusBadge } from "@/components/ui/status-badge";
import { ArrowRight } from "lucide-react";

export function PreviewPage({
  eyebrow,
  title,
  lede,
  stage,
  roadmap,
  continueTo,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede: string;
  stage: "build" | "research" | "beta";
  roadmap: string[];
  continueTo?: { href: string; label: string };
}) {
  return (
    <section className="relative pt-40 pb-32 md:pt-52 md:pb-40">
      <Container className="max-w-[920px]">
        <Reveal>
          <div className="mb-4 flex items-center gap-3">
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)] font-mono">
              {eyebrow}
            </span>
            <StatusBadge variant={stage} />
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="text-[clamp(40px,5.4vw,68px)] font-semibold leading-[1.04] tracking-[-0.028em] text-[color:var(--bsc-text-1)]">
            {title}
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-[color:var(--bsc-text-2)]">
            {lede}
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-14 rounded-2xl border border-white/[0.07] bg-[color-mix(in_oklch,var(--bsc-surface)_70%,transparent)] p-8">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-accent)]">
              On the roadmap
            </div>
            <ul className="mt-5 space-y-3">
              {roadmap.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[14px] leading-relaxed text-[color:var(--bsc-text-2)]"
                >
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-[color:var(--bsc-accent)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {continueTo && (
          <Reveal delay={0.25}>
            <Link
              href={continueTo.href}
              className="mt-10 inline-flex items-center gap-2 text-[13px] font-mono text-[color:var(--bsc-text-2)] transition-colors hover:text-[color:var(--bsc-text-1)]"
            >
              {continueTo.label}
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
