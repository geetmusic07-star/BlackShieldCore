import type { Metadata } from "next";
import Link from "next/link";
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
  const upcomingTalks = talks.filter((t) => parseInt(t.date.split("-")[0]) >= 2026);
  const pastTalks = talks.filter((t) => parseInt(t.date.split("-")[0]) < 2026);

  const renderTalk = (t: typeof talks[0], i: number, isArchived: boolean = false) => (
    <Reveal key={t.slug} delay={i * 0.05}>
      <Link href={`/talks/${t.slug}`} className="block">
        <article className={`grid gap-6 rounded-2xl border bg-[color-mix(in_oklch,var(--bsc-surface)_75%,transparent)] p-7 transition-colors hover:bg-[color-mix(in_oklch,var(--bsc-surface)_95%,transparent)] md:grid-cols-[1.4fr_1fr] md:p-9 ${
          isArchived 
            ? "border-white/[0.04] opacity-80 hover:border-white/10 hover:opacity-100" 
            : "border-white/[0.07] hover:border-white/15"
        }`}>
          <div>
            <div className="mb-3 flex items-center gap-2">
              {!isArchived && <StatusBadge variant={t.stage} />}
              <span className={`text-[11px] font-mono ${isArchived ? "text-[color:var(--bsc-text-4)]" : "text-[color:var(--bsc-text-3)]"}`}>
                {t.venue} · {t.date} · {t.duration}
              </span>
            </div>
            <h3 className={`text-[22px] font-semibold leading-[1.18] tracking-[-0.018em] ${isArchived ? "text-[color:var(--bsc-text-2)]" : "text-[color:var(--bsc-text-1)]"}`}>
              {t.title}
            </h3>
            <p className={`mt-3 text-[14px] leading-relaxed ${isArchived ? "text-[color:var(--bsc-text-3)]" : "text-[color:var(--bsc-text-2)]"}`}>
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
      </Link>
    </Reveal>
  );

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
        <div className="space-y-16">
          <section>
            <div className="mb-6 flex items-center gap-3 border-b border-white/[0.06] pb-3">
              <h2 className="text-[14px] font-mono uppercase tracking-[0.15em] text-[color:var(--bsc-text-1)]">
                Upcoming Engagements
              </h2>
              <span className="rounded-full bg-[color:var(--bsc-accent)]/10 px-2 py-0.5 text-[10px] font-mono text-[color:var(--bsc-accent)]">
                2026+
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {upcomingTalks.map((t, i) => renderTalk(t, i, false))}
            </div>
          </section>

          <section>
            <div className="mb-6 flex items-center gap-3 border-b border-white/[0.06] pb-3">
              <h2 className="text-[14px] font-mono uppercase tracking-[0.15em] text-[color:var(--bsc-text-3)]">
                Past Engagements
              </h2>
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-mono text-[color:var(--bsc-text-4)]">
                Archive
              </span>
            </div>
            <div className="flex flex-col gap-3">
              {pastTalks.map((t, i) => renderTalk(t, i, true))}
            </div>
          </section>
        </div>
      </Container>
    </ListingLayout>
  );
}
