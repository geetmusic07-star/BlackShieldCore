import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ListingLayout } from "@/components/listings/listing-layout";
import { StatusBadge } from "@/components/ui/status-badge";
import { talks } from "@/content/talks";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Talks",
  description: "Conference talks on offensive, defensive, and AI security topics.",
};

export default function TalksPage() {
  return (
    <ListingLayout
      eyebrow="Talks & Community"
      title={
        <>
          Conference work.
          <br />
          <span className="text-[color:var(--bsc-text-3)]">Delivered and documented.</span>
        </>
      }
      lede="Talks given across security and AI conferences - each paired with slides, demo code, and writeups where available."
    >
      <Container>
        <div className="flex flex-col gap-3">
          {talks.map((t, i) => (
            <Reveal key={t.slug} delay={i * 0.05}>
              <article className="grid gap-6 rounded-2xl border border-white/[0.07] bg-[color-mix(in_oklch,var(--bsc-surface)_75%,transparent)] p-7 md:grid-cols-[1.4fr_1fr] md:p-9">
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <StatusBadge variant={t.stage} />
                    <span className="text-[11px] font-mono text-[color:var(--bsc-text-3)]">
                      {t.venue} · {t.date} · {t.duration}
                    </span>
                  </div>
                  <h3 className="text-[22px] font-semibold leading-[1.18] tracking-[-0.018em] text-[color:var(--bsc-text-1)]">
                    {t.title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-[color:var(--bsc-text-2)]">
                    {t.summary}
                  </p>
                </div>
                <div className="flex flex-wrap content-start gap-2">
                  {t.resources.map((r) => (
                    <span
                      key={r.label}
                      className={`rounded-full border px-3 py-1 text-[11px] font-mono ${
                        r.available
                          ? "border-white/15 bg-white/[0.03] text-[color:var(--bsc-text-2)]"
                          : "border-white/[0.05] bg-white/[0.01] text-[color:var(--bsc-text-3)] opacity-60"
                      }`}
                    >
                      {r.label}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </ListingLayout>
  );
}
