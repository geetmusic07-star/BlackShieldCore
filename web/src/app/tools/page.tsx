import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ListingLayout } from "@/components/listings/listing-layout";
import { StatusBadge } from "@/components/ui/status-badge";
import { tools } from "@/content/tools";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Tools",
  description:
    "Utility-grade security tools: JWT decoding, hash analysis, log parsing, and more.",
};

export default function ToolsPage() {
  return (
    <ListingLayout
      eyebrow="Security Tools"
      title={
        <>
          Utility-grade.
          <br />
          <span className="text-[color:var(--bsc-text-3)]">Calibrated for real work.</span>
        </>
      }
      lede="Lightweight, focused analysis utilities - each built for a specific part of the cryptographic, auth, or detection workflow."
    >
      <Container>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t, i) => {
            const disabled = t.stage !== "available";
            const Comp: React.ElementType = disabled ? "div" : Link;
            const props = disabled ? {} : { href: `/tools/${t.slug}` };
            return (
              <Reveal key={t.slug} delay={i * 0.04}>
                <Comp
                  {...props}
                  className={`group flex h-full flex-col rounded-2xl border border-white/[0.07] bg-[color-mix(in_oklch,var(--bsc-surface)_75%,transparent)] p-6 transition-colors ${
                    disabled
                      ? "opacity-60"
                      : "hover:border-white/15 hover:bg-[color-mix(in_oklch,var(--bsc-surface)_90%,transparent)]"
                  }`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
                      {t.category}
                    </span>
                    <StatusBadge variant={t.stage} />
                  </div>
                  <h3 className="text-[17px] font-semibold leading-snug tracking-[-0.012em] text-[color:var(--bsc-text-1)]">
                    {t.name}
                  </h3>
                  <p className="mt-2 flex-1 text-[13px] leading-relaxed text-[color:var(--bsc-text-2)]">
                    {t.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {t.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/[0.06] bg-white/[0.02] px-2 py-0.5 text-[10px] font-mono text-[color:var(--bsc-text-3)]"
                      >
                        #{tag}
                      </span>
                    ))}
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
