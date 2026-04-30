import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Server, Settings2, Info, AlertTriangle, Lightbulb } from "lucide-react";
import { Container } from "@/components/ui/container";
import { StatusBadge } from "@/components/ui/status-badge";
import { getHomeLabComponent, homeLab } from "@/content/home-lab";
import type { BlogBlock } from "@/content/types";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const comp = getHomeLabComponent(params.slug);
  if (!comp) return {};

  return {
    title: `${comp.name} · Home Lab`,
    description: comp.notes,
  };
}

export async function generateStaticParams() {
  return homeLab
    .filter((c) => c.slug)
    .map((c) => ({ slug: c.slug as string }));
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

export default async function HomeLabDetailPage(props: Props) {
  const params = await props.params;
  const comp = getHomeLabComponent(params.slug);

  if (!comp) {
    notFound();
  }

  return (
    <article className="pt-32 pb-24 relative">
      <Container className="max-w-[800px]">
        {/* Breadcrumb Navigation */}
        <Link
          href="/home-lab"
          className="inline-flex items-center gap-2 font-mono text-[12px] text-[color:var(--bsc-text-3)] hover:text-[color:var(--bsc-text-1)]"
        >
          <ArrowLeft size={13} />
          Back to Architecture
        </Link>

        {/* Header Section */}
        <header className="mt-10 border-b border-white/[0.06] pb-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--bsc-accent)]">
              {comp.category}
            </span>
            <span className="text-white/[0.2]">•</span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--bsc-text-3)]">
              {comp.role}
            </span>
            <span className="text-white/[0.2]">•</span>
            <StatusBadge variant={comp.stage} />
          </div>

          <h1 className="mt-5 text-[34px] font-semibold tracking-[-0.02em] text-[color:var(--bsc-text-1)] sm:text-[42px]">
            {comp.name}
          </h1>

          <p className="mt-4 text-[16px] leading-relaxed text-[color:var(--bsc-text-2)]">
            {comp.notes}
          </p>
        </header>

        {/* Content Section */}
        <div className="prose-blog mt-12">
          {comp.body && comp.body.length > 0 ? (
            comp.body.map((block, i) => <BlockView key={i} block={block} index={i} />)
          ) : (
            <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-8 text-center">
              <Settings2
                size={24}
                className="mx-auto mb-3 text-[color:var(--bsc-text-3)] opacity-50"
              />
              <div className="text-[15px] font-medium text-[color:var(--bsc-text-1)]">
                Configuration notes forthcoming
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--bsc-text-3)]">
                This component is deployed in the lab, but the detailed architectural
                runbooks and configuration notes are currently being formatted for the web.
              </p>
            </div>
          )}
        </div>
      </Container>
      
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
          font-style: italic;
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
