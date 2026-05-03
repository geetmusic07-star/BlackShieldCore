import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ListingLayout } from "@/components/listings/listing-layout";
import { StatusBadge } from "@/components/ui/status-badge";
import { research } from "@/content/research";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Research Notes",
  description: "Structured analyses, architecture reviews, and methodology writeups.",
};

export default function ResearchPage() {
  return (
    <ListingLayout
      eyebrow="Research & Analysis"
      title={
        <>
          Structured thinking.
          <br />
          <span className="text-[color:var(--bsc-text-3)]">Practitioner-grade depth.</span>
        </>
      }
      lede="Technical notes, structured analyses, and investigative deep-dives. More detailed than blog posts; less formal than papers."
    >
      <Container>
        <div className="grid gap-3 lg:grid-cols-2">
          {research.map((r, i) => {
            const disabled = r.stage !== "available";
            const Comp: React.ElementType = disabled ? "div" : Link;
            const props = disabled ? {} : { href: `/research/${r.slug}` };
            return (
              <Reveal key={r.slug} delay={i * 0.05}>
                <Comp
                  {...props}
                  className={`group flex h-full flex-col rounded-2xl border border-white/[0.07] bg-[color-mix(in_oklch,var(--bsc-surface)_75%,transparent)] p-7 transition-colors ${
                    disabled
                      ? "opacity-60"
                      : "hover:border-white/15 hover:bg-[color-mix(in_oklch,var(--bsc-surface)_90%,transparent)]"
                  }`}
                >
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-violet)]">
                      {r.type}
                    </span>
                    <StatusBadge variant={r.stage} />
                  </div>
                  <h3 className="text-[18px] font-semibold leading-snug tracking-[-0.012em] text-[color:var(--bsc-text-1)]">
                    {r.title}
                  </h3>
                  <p className="mt-3 text-[13px] leading-relaxed text-[color:var(--bsc-text-2)]">
                    {r.abstract}
                  </p>
                  {r.findings && (
                    <ul className="mt-4 space-y-1.5">
                      {r.findings.slice(0, 3).map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-[12px] text-[color:var(--bsc-text-3)]">
                          <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[color:var(--bsc-accent)]" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="mt-5 border-t border-white/[0.06] pt-3 text-[11px] font-mono text-[color:var(--bsc-text-3)]">
                    {r.minutes} min ·{" "}
                    {new Date(r.date).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </Comp>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </ListingLayout>
  );
}
