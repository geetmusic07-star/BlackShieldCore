import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { StatusBadge } from "@/components/ui/status-badge";
import { labs, getLab } from "@/content/labs";
import { ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  return labs.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata(
  props: PageProps<"/labs/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const lab = getLab(slug);
  if (!lab) return { title: "Lab not found" };
  return { title: lab.title, description: lab.summary };
}

export default async function LabPage(props: PageProps<"/labs/[slug]">) {
  const { slug } = await props.params;
  const lab = getLab(slug);
  if (!lab) notFound();

  return (
    <article className="relative pt-40 pb-32 md:pt-48 md:pb-40">
      <Container className="max-w-[880px]">
        <Link
          href="/labs"
          className="inline-flex items-center gap-2 text-[12px] font-mono text-[color:var(--bsc-text-3)] transition-colors hover:text-[color:var(--bsc-text-1)]"
        >
          <ArrowLeft className="size-3.5" />
          All Labs
        </Link>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
            {lab.category}
          </span>
          <span className="text-[color:var(--bsc-text-3)]">·</span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-amber)]">
            {lab.difficulty}
          </span>
          <StatusBadge variant={lab.stage} />
        </div>

        <h1 className="mt-6 text-[clamp(34px,4.6vw,54px)] font-semibold leading-[1.06] tracking-[-0.022em] text-[color:var(--bsc-text-1)]">
          {lab.title}
        </h1>

        <p className="mt-6 text-[17px] leading-relaxed text-[color:var(--bsc-text-2)]">
          {lab.summary}
        </p>

        <aside className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
          {[
            ["Duration", `~${lab.durationMinutes} min`],
            ["Reward", `+${lab.xp} XP`],
            ["Stage", lab.stage.charAt(0).toUpperCase() + lab.stage.slice(1)],
          ].map(([k, v]) => (
            <div
              key={k}
              className="bg-[color-mix(in_oklch,var(--bsc-surface)_70%,transparent)] p-5"
            >
              <div className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
                {k}
              </div>
              <div className="mt-1.5 text-[15px] font-medium text-[color:var(--bsc-text-1)]">
                {v}
              </div>
            </div>
          ))}
        </aside>

        {lab.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {lab.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-1 text-[11px] font-mono text-[color:var(--bsc-text-2)]"
              >
                #{t}
              </span>
            ))}
          </div>
        )}

        {lab.body && (
          <div className="mt-14 space-y-5 text-[15px] leading-[1.75] text-[color:var(--bsc-text-2)] [&_strong]:text-[color:var(--bsc-text-1)]">
            {lab.body.split("\n\n").map((para, i) => (
              <p key={i} className="whitespace-pre-line">
                {para}
              </p>
            ))}
          </div>
        )}
      </Container>
    </article>
  );
}
