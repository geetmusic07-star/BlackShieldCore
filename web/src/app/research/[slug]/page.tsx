import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { StatusBadge } from "@/components/ui/status-badge";
import { research, getResearch } from "@/content/research";
import { ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  return research.filter((r) => r.stage === "available").map((r) => ({ slug: r.slug }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  props: Props,
): Promise<Metadata> {
  const { slug } = await props.params;
  const r = getResearch(slug);
  if (!r) return { title: "Research note not found" };
  return { title: r.title, description: r.abstract };
}

import { AttackChainMap, AnnotatedCode } from "@/components/ui";

export default async function ResearchSlug(props: Props) {
  const { slug } = await props.params;
  const r = getResearch(slug);
  if (!r) notFound();

  return (
    <article className="relative pt-40 pb-32 md:pt-48 md:pb-40">
      <Container className="max-w-[820px]">
        <Link
          href="/research"
          className="inline-flex items-center gap-2 text-[12px] font-mono text-[color:var(--bsc-text-3)] transition-colors hover:text-[color:var(--bsc-text-1)]"
        >
          <ArrowLeft className="size-3.5" />
          All Research
        </Link>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-violet)]">
            {r.type}
          </span>
          <StatusBadge variant={r.stage} />
          <span className="text-[11px] font-mono text-[color:var(--bsc-text-3)]">
            {r.minutes} min ·{" "}
            {new Date(r.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <h1 className="mt-6 text-[clamp(32px,4.4vw,52px)] font-semibold leading-[1.08] tracking-[-0.022em] text-[color:var(--bsc-text-1)]">
          {r.title}
        </h1>

        <p className="mt-6 text-[17px] leading-relaxed text-[color:var(--bsc-text-2)]">
          {r.abstract}
        </p>

        {/* Attack Chain Visualizer */}
        {r.attackChain && (
          <div className="mt-12">
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-white/20">
              [ Lifecycle Visualization ]
            </div>
            <AttackChainMap steps={r.attackChain} />
          </div>
        )}

        {r.findings && (
          <aside className="mt-12 rounded-2xl border border-white/[0.07] bg-[color-mix(in_oklch,var(--bsc-surface)_70%,transparent)] p-6">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-accent)]">
              Key findings
            </div>
            <ul className="mt-3 space-y-2.5">
              {r.findings.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-3 text-[14px] leading-relaxed text-[color:var(--bsc-text-2)]"
                >
                  <span className="mt-2 size-1 shrink-0 rounded-full bg-[color:var(--bsc-accent)]" />
                  {f}
                </li>
              ))}
            </ul>
          </aside>
        )}

        {r.body && (
          <div className="mt-12 space-y-8 text-[16px] leading-[1.78] text-[color:var(--bsc-text-2)] [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-[22px] [&_h2]:font-semibold [&_h2]:tracking-[-0.018em] [&_h2]:text-[color:var(--bsc-text-1)] [&_strong]:text-[color:var(--bsc-text-1)] [&_code]:font-mono [&_code]:text-[14px] [&_code]:text-[color:var(--bsc-accent)] [&_code]:bg-white/[0.04] [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5">
            {r.body.split(/\n\n(?=(?:[^`]*`[^`]*`)*[^`]*$)/).map((block, i) => {
              if (block.startsWith("## ")) {
                return <h2 key={i}>{block.replace(/^## /, "")}</h2>;
              }
              
              // Handle Code Blocks
              if (block.includes("```")) {
                const match = block.match(/```(\w*)\n([\s\S]*?)```/);
                if (match) {
                  const lang = match[1] || "txt";
                  const code = match[2];
                  return (
                    <div key={i} className="my-8">
                      <AnnotatedCode 
                        code={code} 
                        language={lang} 
                        annotations={r.codeAnnotations} 
                      />
                    </div>
                  );
                }
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
