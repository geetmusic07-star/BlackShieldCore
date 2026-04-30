import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ListingLayout } from "@/components/listings/listing-layout";
import { Reveal } from "@/components/ui/reveal";
import { StatusBadge } from "@/components/ui/status-badge";
import { homeLab, homeLabRepos } from "@/content/home-lab";

export const metadata: Metadata = {
  title: "Home Lab",
  description:
    "The self-hosted lab BlackShield Core runs against - Active Directory, SIEM, EDR, identity, and network components used for safe offensive practice and detection work.",
};

export default function HomeLabPage() {
  // Group by category
  const grouped = homeLab.reduce<Record<string, typeof homeLab>>((acc, c) => {
    (acc[c.category] ??= []).push(c);
    return acc;
  }, {});

  return (
    <ListingLayout
      eyebrow="Home Lab"
      title={
        <>
          Self-hosted topology.
          <br />
          <span className="text-[color:var(--bsc-text-3)]">Where the labs actually run.</span>
        </>
      }
      lede="A documented self-hosted lab - Active Directory, SIEM, EDR, identity, and network components - used for safe offensive practice and detection-engineering work. Open-source where possible, tuned for reproducibility."
    >
      <Container>
        <div className="space-y-12">
          {Object.entries(grouped).map(([cat, items]) => (
            <Reveal key={cat}>
              <section>
                <div className="mb-5 flex items-baseline justify-between border-b border-white/[0.06] pb-3">
                  <h2 className="text-[16px] font-semibold tracking-[-0.012em] text-[color:var(--bsc-text-1)]">
                    {cat}
                  </h2>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
                    {items.length} components
                  </span>
                </div>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((c) => (
                    <article
                      key={c.name}
                      className="rounded-2xl border border-white/[0.07] bg-[color-mix(in_oklch,var(--bsc-surface)_72%,transparent)] p-5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
                          {c.role}
                        </div>
                        <StatusBadge variant={c.stage} />
                      </div>
                      <h3 className="mt-2 text-[15px] font-semibold tracking-[-0.012em] text-[color:var(--bsc-text-1)]">
                        {c.name}
                      </h3>
                      <p className="mt-2 text-[13px] leading-relaxed text-[color:var(--bsc-text-2)]">
                        {c.notes}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            </Reveal>
          ))}

          <Reveal>
            <section className="rounded-2xl border border-white/[0.07] bg-[color-mix(in_oklch,var(--bsc-surface)_60%,transparent)] p-7">
              <div className="flex items-center justify-between">
                <h2 className="text-[16px] font-semibold tracking-[-0.012em] text-[color:var(--bsc-text-1)]">
                  Open-source lab repositories
                </h2>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
                  Curated
                </span>
              </div>
              <div className="mt-5 grid gap-px overflow-hidden rounded-xl border border-white/[0.05] bg-white/[0.04] sm:grid-cols-2 lg:grid-cols-4">
                {homeLabRepos.map((r) => (
                  <div
                    key={r.name}
                    className="flex flex-col gap-2 bg-[color-mix(in_oklch,var(--bsc-surface)_70%,transparent)] p-5"
                  >
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-accent)]">
                      {r.lang}
                    </div>
                    <div className="text-[13px] font-semibold text-[color:var(--bsc-text-1)]">
                      {r.name}
                    </div>
                    <div className="text-[12px] leading-relaxed text-[color:var(--bsc-text-2)]">
                      {r.note}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-[12px] leading-relaxed text-[color:var(--bsc-text-3)]">
                Repositories are curated and published as their content stabilises - links are
                added to each module page as they go live.
              </p>
            </section>
          </Reveal>
        </div>
      </Container>
    </ListingLayout>
  );
}
