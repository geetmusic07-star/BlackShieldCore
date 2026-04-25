import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ListingLayout } from "@/components/listings/listing-layout";
import { StatusBadge } from "@/components/ui/status-badge";
import { blogPosts } from "@/content/blog";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Technical Blog",
  description:
    "Deep-dive research on real attack patterns, detection engineering, and defense.",
};

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;
  const disabledHref = (stage: string) => stage !== "available";

  return (
    <ListingLayout
      eyebrow="Technical Blog"
      title={
        <>
          Insider-level research.
          <br />
          <span className="text-[color:var(--bsc-text-3)]">Written by practitioners.</span>
        </>
      }
      lede="Deep-dives into how real attacks work, how detection rules break, and how defenders should actually think."
    >
      <Container>
        <Reveal>
          <Link
            href={disabledHref(featured.stage) ? "#" : `/blog/${featured.slug}`}
            aria-disabled={disabledHref(featured.stage)}
            className={`group relative block overflow-hidden rounded-3xl border border-white/[0.08] bg-[color-mix(in_oklch,var(--bsc-surface)_75%,transparent)] p-8 transition-colors md:p-10 ${
              disabledHref(featured.stage)
                ? "pointer-events-none opacity-70"
                : "hover:border-white/15 hover:bg-[color-mix(in_oklch,var(--bsc-surface)_92%,transparent)]"
            }`}
          >
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-accent)]">
                Featured
              </span>
              <StatusBadge variant={featured.stage} />
              <span className="text-[11px] font-mono text-[color:var(--bsc-text-3)]">
                {featured.minutes} min read
              </span>
            </div>
            <h2 className="max-w-3xl text-[26px] md:text-[32px] font-semibold leading-[1.15] tracking-[-0.02em] text-[color:var(--bsc-text-1)]">
              {featured.title}
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[color:var(--bsc-text-2)]">
              {featured.excerpt}
            </p>
          </Link>
        </Reveal>

        <div className="mt-14 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((p, i) => {
            const disabled = disabledHref(p.stage);
            const Comp: React.ElementType = disabled ? "div" : Link;
            const props = disabled ? {} : { href: `/blog/${p.slug}` };
            return (
              <Reveal key={p.slug} delay={i * 0.04}>
                <Comp
                  {...props}
                  className={`group flex h-full flex-col justify-between rounded-2xl border border-white/[0.07] bg-[color-mix(in_oklch,var(--bsc-surface)_70%,transparent)] p-5 transition-colors ${
                    disabled
                      ? "opacity-60"
                      : "hover:border-white/15 hover:bg-[color-mix(in_oklch,var(--bsc-surface)_90%,transparent)]"
                  }`}
                >
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
                        {p.kicker}
                      </span>
                      <StatusBadge variant={p.stage} />
                    </div>
                    <h3 className="text-[16px] font-medium leading-snug text-[color:var(--bsc-text-1)]">
                      {p.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-[color:var(--bsc-text-2)]">
                      {p.excerpt}
                    </p>
                  </div>
                  <div className="mt-4 border-t border-white/[0.06] pt-3 text-[11px] font-mono text-[color:var(--bsc-text-3)]">
                    {new Date(p.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    · {p.minutes} min
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
