import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { StatusBadge } from "@/components/ui/status-badge";
import { talks, getTalk } from "@/content/talks";
import type { BlogBlock } from "@/content/types";
import { ArrowLeft, Info, AlertTriangle, Lightbulb } from "lucide-react";

export function generateStaticParams() {
  return talks.filter((t) => t.stage === "available").map((t) => ({ slug: t.slug }));
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await props.params;
  const talk = getTalk(slug);
  if (!talk) return { title: "Talk not found" };
  return { title: talk.title, description: talk.summary };
}

function BlockView({ block, index }: { block: BlogBlock; index: number }) {
  switch (block.kind) {
    case "h2":
      return <h2>{block.value}</h2>;
    case "h3":
      return <h3>{block.value}</h3>;
    case "p":
      return <p className={index === 0 ? "lead-cap" : ""}>{block.value}</p>;
    case "ul":
      return (
        <ul>
          {block.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol>
          {block.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ol>
      );
    case "code":
      return (
        <pre>
          {block.lang && (
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
              {block.lang}
            </div>
          )}
          <code>{block.value}</code>
        </pre>
      );
    case "callout": {
      const meta = {
        note: {
          Icon: Info,
          ring: "border-[oklch(0.78_0.14_230)]/35",
          bg: "bg-[oklch(0.78_0.14_230)]/[0.06]",
          text: "text-[oklch(0.85_0.13_230)]",
          label: "NOTE",
        },
        warn: {
          Icon: AlertTriangle,
          ring: "border-[oklch(0.72_0.18_25)]/35",
          bg: "bg-[oklch(0.72_0.18_25)]/[0.06]",
          text: "text-[oklch(0.85_0.15_25)]",
          label: "WARNING",
        },
        tip: {
          Icon: Lightbulb,
          ring: "border-[oklch(0.82_0.14_75)]/35",
          bg: "bg-[oklch(0.82_0.14_75)]/[0.06]",
          text: "text-[oklch(0.88_0.12_75)]",
          label: "TIP",
        },
      }[block.tone];
      return (
        <div className={`my-7 rounded-lg border ${meta.ring} ${meta.bg} px-4 py-3.5`}>
          <div
            className={`mb-1 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] ${meta.text}`}
          >
            <meta.Icon size={12} /> {meta.label}
          </div>
          <div className={`text-[14.5px] leading-relaxed ${meta.text}`}>
            {block.value}
          </div>
        </div>
      );
    }
    case "quote":
      return (
        <blockquote>
          {block.value}
          {block.cite && <cite>- {block.cite}</cite>}
        </blockquote>
      );
    default:
      return null;
  }
}

export default async function TalkPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const talk = getTalk(slug);
  if (!talk) notFound();

  return (
    <article className="relative pt-32 pb-32 md:pt-44 md:pb-40">
      <Container className="max-w-[760px]">
        <Link
          href="/talks"
          className="inline-flex items-center gap-2 font-mono text-[12px] text-[color:var(--bsc-text-3)] transition-colors hover:text-[color:var(--bsc-text-1)]"
        >
          <ArrowLeft className="size-3.5" />
          All Talks
        </Link>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <StatusBadge variant={talk.stage} />
          <span className="font-mono text-[11px] text-[color:var(--bsc-text-3)]">
            {talk.venue} · {talk.date} · {talk.duration}
          </span>
        </div>

        <h1 className="mt-6 text-[clamp(32px,4.4vw,52px)] font-semibold leading-[1.08] tracking-[-0.022em] text-[color:var(--bsc-text-1)]">
          {talk.title}
        </h1>

        <p className="mt-6 text-[18px] leading-relaxed text-[color:var(--bsc-text-2)]">
          {talk.summary}
        </p>

        <div className="mt-8 flex flex-wrap content-start gap-2">
          {talk.resources.map((r) => (
            <span
              key={r.label}
              className={`rounded-full border px-3 py-1 text-[11px] font-mono ${
                r.available
                  ? "border-[color:var(--bsc-accent)]/30 bg-[color:var(--bsc-accent)]/10 text-[color:var(--bsc-accent)]"
                  : "border-white/[0.05] bg-white/[0.01] text-[color:var(--bsc-text-3)] opacity-60"
              }`}
            >
              {r.label} {r.available ? "✓" : "(forthcoming)"}
            </span>
          ))}
        </div>

        <hr className="my-10 border-white/[0.06]" />

        {talk.body ? (
          <div className="prose-blog">
            {talk.body.map((block, i) => (
              <BlockView key={i} block={block} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-[15px] text-[color:var(--bsc-text-3)]">
            This talk writeup is currently being formatted for the web.
          </p>
        )}

        <div className="mt-16 border-t border-white/[0.06] pt-6 font-mono text-[11px] text-[color:var(--bsc-text-3)]">
          <Link href="/talks" className="hover:text-[color:var(--bsc-text-1)]">
            ← Back to all talks
          </Link>
        </div>
      </Container>

      {/* prose styles scoped to this article */}
      <style>{`
        .prose-blog h2 {
          font-size: 26px;
          font-weight: 600;
          letter-spacing: -0.014em;
          line-height: 1.18;
          margin: 44px 0 16px;
          color: var(--bsc-text-1);
        }
        .prose-blog h3 {
          font-size: 19px;
          font-weight: 600;
          letter-spacing: -0.008em;
          line-height: 1.3;
          margin: 28px 0 10px;
          color: var(--bsc-text-1);
        }
        .prose-blog p {
          font-size: 16.5px;
          line-height: 1.78;
          color: var(--bsc-text-2);
          margin: 0 0 18px;
        }
        .prose-blog .lead-cap::first-letter {
          font-size: 56px;
          float: left;
          line-height: 0.85;
          margin: 6px 10px 0 -2px;
          font-weight: 600;
          color: var(--bsc-text-1);
        }
        .prose-blog ul, .prose-blog ol {
          margin: 8px 0 22px 0;
          padding-left: 22px;
        }
        .prose-blog ul { list-style: disc; }
        .prose-blog ol { list-style: decimal; }
        .prose-blog li {
          font-size: 16.5px;
          line-height: 1.72;
          color: var(--bsc-text-2);
          margin-bottom: 6px;
        }
        .prose-blog li::marker {
          color: color-mix(in oklch, var(--bsc-accent) 65%, transparent);
        }
        .prose-blog blockquote {
          border-left: 3px solid color-mix(in oklch, var(--bsc-accent) 70%, transparent);
          padding: 4px 0 4px 18px;
          margin: 22px 0;
          color: var(--bsc-text-1);
          font-size: 17px;
          line-height: 1.7;
        }
        .prose-blog blockquote cite {
          display: block;
          margin-top: 10px;
          font-style: normal;
          font-size: 12.5px;
          color: var(--bsc-text-3);
          font-family: ui-monospace, "SF Mono", Menlo, monospace;
          letter-spacing: 0.04em;
        }
        .prose-blog pre {
          margin: 22px 0;
          padding: 16px 18px;
          border-radius: 10px;
          border: 1px solid color-mix(in oklch, white 6%, transparent);
          background: color-mix(in oklch, var(--bsc-void) 70%, transparent);
          overflow-x: auto;
          font-size: 13px;
          line-height: 1.7;
        }
        .prose-blog pre code {
          font-family: ui-monospace, "SF Mono", Menlo, monospace;
          color: var(--bsc-text-1);
          white-space: pre;
        }
      `}</style>
    </article>
  );
}
