import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { StatusBadge } from "@/components/ui/status-badge";
import { caseStudies, getCaseStudy } from "@/content/case-studies";
import { ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  return caseStudies.filter((c) => c.stage === "available").map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  props: PageProps<"/case-studies/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const c = getCaseStudy(slug);
  if (!c) return { title: "Case study not found" };
  return { title: c.title, description: c.summary };
}

export default async function CaseStudySlug(props: PageProps<"/case-studies/[slug]">) {
  const { slug } = await props.params;
  const c = getCaseStudy(slug);
  if (!c) notFound();

  return (
    <article className="relative pt-40 pb-32 md:pt-48 md:pb-40">
      <Container className="max-w-[820px]">
        <Link
          href="/case-studies"
          className="inline-flex items-center gap-2 text-[12px] font-mono text-[color:var(--bsc-text-3)] transition-colors hover:text-[color:var(--bsc-text-1)]"
        >
          <ArrowLeft className="size-3.5" />
          All Case Studies
        </Link>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
            {c.category}
          </span>
          <StatusBadge variant={c.stage} />
          <span className="text-[11px] font-mono text-[color:var(--bsc-text-3)]">
            {c.minutes} min ·{" "}
            {new Date(c.date).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <h1 className="mt-6 text-[clamp(32px,4.4vw,52px)] font-semibold leading-[1.08] tracking-[-0.022em] text-[color:var(--bsc-text-1)]">
          {c.title}
        </h1>

        <p className="mt-6 text-[17px] leading-relaxed text-[color:var(--bsc-text-2)]">
          {c.summary}
        </p>

        <aside className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.04] sm:grid-cols-[1fr_2fr]">
          <div className="bg-[color-mix(in_oklch,var(--bsc-surface)_70%,transparent)] p-5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-accent)]">
              Attack vector
            </div>
            <div className="mt-1.5 text-[14px] font-medium text-[color:var(--bsc-text-1)]">
              {c.attackVector}
            </div>
          </div>
          <div className="bg-[color-mix(in_oklch,var(--bsc-surface)_70%,transparent)] p-5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
              Findings
            </div>
            <ul className="mt-2 space-y-2">
              {c.findings.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2.5 text-[12.5px] leading-[1.55] text-[color:var(--bsc-text-2)]"
                >
                  <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[color:var(--bsc-accent)]" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {c.body && (
          <div className="mt-12 space-y-5 text-[16px] leading-[1.78] text-[color:var(--bsc-text-2)] [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-[22px] [&_h2]:font-semibold [&_h2]:tracking-[-0.018em] [&_h2]:text-[color:var(--bsc-text-1)] [&_strong]:text-[color:var(--bsc-text-1)]">
            {c.body.split("\n\n").map((block, i) => {
              if (block.startsWith("## ")) {
                return <h2 key={i}>{block.replace(/^## /, "")}</h2>;
              }
              if (block.match(/^\d+\. \*\*/)) {
                const items = block.split("\n").map((item) => item.replace(/^\d+\. /, ""));
                return (
                  <ol
                    key={i}
                    className="mt-4 list-decimal space-y-3 pl-5 marker:font-mono marker:text-[color:var(--bsc-text-3)]"
                  >
                    {items.map((it, j) => (
                      <li
                        key={j}
                        dangerouslySetInnerHTML={{
                          __html: it.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
                        }}
                      />
                    ))}
                  </ol>
                );
              }
              return <p key={i}>{block}</p>;
            })}
          </div>
        )}
      </Container>
    </article>
  );
}
