import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ListingLayout } from "@/components/listings/listing-layout";
import { StatusBadge } from "@/components/ui/status-badge";
import { caseStudies } from "@/content/case-studies";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Reconstructions of real incident patterns — attack vectors, findings, and detection gaps.",
};

export default function CaseStudiesPage() {
  return (
    <ListingLayout
      eyebrow="Case Studies"
      title={
        <>
          Incident reconstructions.
          <br />
          <span className="text-[color:var(--bsc-text-3)]">Honest writeups.</span>
        </>
      }
      lede="Reconstructions of documented attack patterns — attack chain, findings, and detection gaps."
    >
      <Container>
        <div className="flex flex-col gap-3">
          {caseStudies.map((c, i) => {
            const disabled = c.stage !== "available";
            const Comp: React.ElementType = disabled ? "div" : Link;
            const props = disabled ? {} : { href: `/case-studies/${c.slug}` };
            return (
              <Reveal key={c.slug} delay={i * 0.04}>
                <Comp
                  {...props}
                  className={`grid gap-6 rounded-2xl border border-white/[0.07] bg-[color-mix(in_oklch,var(--bsc-surface)_75%,transparent)] p-7 transition-colors md:grid-cols-[1.4fr_1fr] md:p-9 ${
                    disabled
                      ? "opacity-60"
                      : "hover:border-white/15 hover:bg-[color-mix(in_oklch,var(--bsc-surface)_90%,transparent)]"
                  }`}
                >
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
                        {c.category}
                      </span>
                      <StatusBadge variant={c.stage} />
                    </div>
                    <h3 className="text-[22px] font-semibold leading-[1.18] tracking-[-0.018em] text-[color:var(--bsc-text-1)]">
                      {c.title}
                    </h3>
                    <p className="mt-3 text-[14px] leading-relaxed text-[color:var(--bsc-text-2)]">
                      {c.summary}
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-5">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-accent)]">
                      Attack vector
                    </div>
                    <div className="mt-1.5 text-[13px] font-medium text-[color:var(--bsc-text-1)]">
                      {c.attackVector}
                    </div>
                    <ul className="mt-4 space-y-1.5">
                      {c.findings.slice(0, 2).map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-[12px] leading-relaxed text-[color:var(--bsc-text-3)]"
                        >
                          <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[color:var(--bsc-accent)]" />
                          {f}
                        </li>
                      ))}
                    </ul>
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
