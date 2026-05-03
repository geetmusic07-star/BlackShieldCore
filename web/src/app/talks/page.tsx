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
  const pastTalks    = talks.filter((t) => parseInt(t.date.split("-")[0]) < 2026);

  const renderTalk = (t: typeof talks[0], i: number, isArchived: boolean = false) => (
    <Reveal key={t.slug} delay={i * 0.05}>
      <Link href={`/talks/${t.slug}`} className="block">
        <article
          className={`bsc-card-shimmer grid gap-6 overflow-hidden rounded-2xl border p-7 transition-all duration-300 md:grid-cols-[1.5fr_1fr] md:p-9 ${
            isArchived
              ? "border-white/[0.05] bg-[color-mix(in_oklch,var(--bsc-surface)_55%,transparent)] opacity-75 hover:border-white/[0.12] hover:opacity-100 hover:bg-[color-mix(in_oklch,var(--bsc-surface)_80%,transparent)]"
              : "border-[color:var(--bsc-line)] bg-[color-mix(in_oklch,var(--bsc-surface)_78%,transparent)] hover:border-[color:var(--bsc-line-strong)] hover:bg-[color-mix(in_oklch,var(--bsc-surface)_95%,transparent)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)]"
          }`}
        >
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2.5">
              {!isArchived && <StatusBadge variant={t.stage} />}
              <span className={`text-[11px] font-mono ${isArchived ? "text-[color:var(--bsc-text-4)]" : "text-[color:var(--bsc-text-3)]"}`}>
                {t.venue}
              </span>
              <span className="text-[color:var(--bsc-text-4)] text-[11px] font-mono">·</span>
              <span className={`text-[11px] font-mono ${isArchived ? "text-[color:var(--bsc-text-4)]" : "text-[color:var(--bsc-text-3)]"}`}>
                {t.date}
              </span>
              <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] ${
                isArchived
                  ? "border-white/[0.06] text-[color:var(--bsc-text-4)]"
                  : "border-white/[0.1] text-[color:var(--bsc-text-3)]"
              }`}>
                {t.duration}
              </span>
            </div>
            <h3
              className={`text-[21px] font-semibold leading-[1.18] tracking-[-0.018em] ${
                isArchived ? "text-[color:var(--bsc-text-2)]" : "text-[color:var(--bsc-text-1)]"
              }`}
            >
              {t.title}
            </h3>
            <p
              className={`mt-3 text-[14px] leading-[1.65] ${
                isArchived ? "text-[color:var(--bsc-text-3)]" : "text-[color:var(--bsc-text-2)]"
              }`}
            >
              {t.summary}
            </p>
          </div>

          {/* Resources */}
          <div className="flex flex-wrap content-start gap-2">
            {t.resources.map((r) => (
              <span
                key={r.label}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-mono transition-colors ${
                  r.available
                    ? "border-white/[0.14] bg-white/[0.04] text-[color:var(--bsc-text-2)] hover:border-white/[0.25] hover:text-[color:var(--bsc-text-1)]"
                    : "border-white/[0.05] bg-transparent text-[color:var(--bsc-text-4)]"
                }`}
              >
                {r.available && (
                  <span
                    className="size-1.5 rounded-full"
                    style={{ background: "var(--bsc-accent)" }}
                  />
                )}
                {r.label}
              </span>
            ))}
            {!t.resources.some((r) => r.available) && (
              <p className="text-[12px] font-mono text-[color:var(--bsc-text-4)]">
                Materials pending publication
              </p>
            )}
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
      lede="Talks given across offensive and defensive security conferences — each paired with slides, demo code, and writeups where available. Covering LLM adversarial techniques, detection engineering, and Active Directory attacks."
    >
      <Container>
        <div className="space-y-16">

          {/* Upcoming */}
          <section>
            <div className="mb-7 flex items-center gap-3 border-b border-[color:var(--bsc-line)] pb-4">
              <span className="bsc-live-dot" />
              <h2 className="text-[13px] font-mono uppercase tracking-[0.15em] text-[color:var(--bsc-text-1)]">
                Upcoming Engagements
              </h2>
              <span className="rounded-full bg-[color:var(--bsc-accent)]/12 px-2.5 py-0.5 text-[10px] font-mono text-[color:var(--bsc-accent)]">
                {upcomingTalks.length} scheduled
              </span>
            </div>
            {upcomingTalks.length > 0 ? (
              <div className="flex flex-col gap-3">
                {upcomingTalks.map((t, i) => renderTalk(t, i, false))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-white/[0.08] p-8 text-center">
                <p className="text-[13px] text-[color:var(--bsc-text-3)]">
                  No upcoming talks scheduled yet — check back soon.
                </p>
              </div>
            )}
          </section>

          {/* Archive */}
          <section>
            <div className="mb-7 flex items-center gap-3 border-b border-[color:var(--bsc-line)] pb-4">
              <h2 className="text-[13px] font-mono uppercase tracking-[0.15em] text-[color:var(--bsc-text-3)]">
                Past Engagements
              </h2>
              <span className="rounded-full bg-white/[0.05] px-2.5 py-0.5 text-[10px] font-mono text-[color:var(--bsc-text-4)]">
                {pastTalks.length} archived
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
