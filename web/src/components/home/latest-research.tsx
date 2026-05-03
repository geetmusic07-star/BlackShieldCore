"use client";

import Link from "next/link";
import { Section } from "@/components/ui/section";
import { StatusBadge } from "@/components/ui/status-badge";
import { research } from "@/content/research";
import { blogPosts } from "@/content/blog";
import { ArrowRight } from "@phosphor-icons/react";
import { Reveal } from "@/components/ui/reveal";

export function LatestResearch() {
  const featuredResearch = research[0];
  const recentPosts = blogPosts.slice(0, 3);

  return (
    <Section
      eyebrow="Research & Writing"
      heading={
        <>
          Structured thinking.
          <br />
          <span className="text-[color:var(--bsc-text-3)]">Shipped work.</span>
        </>
      }
      lede="Deep analyses and short notes from active technical work."
    >
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <Reveal>
          <Link
            href={`/research/${featuredResearch.slug}`}
            className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-[color-mix(in_oklch,var(--bsc-surface)_80%,transparent)] p-8 transition-colors hover:border-white/15"
          >
            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.05em] text-[color:var(--bsc-accent)]">
                  {featuredResearch.type}
                </span>
                <StatusBadge variant={featuredResearch.stage} />
              </div>
              <h3 className="text-[26px] font-semibold leading-[1.18] tracking-[-0.02em] text-[color:var(--bsc-text-1)]">
                {featuredResearch.title}
              </h3>
              <p className="mt-4 text-[14px] leading-relaxed text-[color:var(--bsc-text-2)]">
                {featuredResearch.abstract}
              </p>
              {featuredResearch.findings && (
                <ul className="mt-5 space-y-2">
                  {featuredResearch.findings.slice(0, 3).map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 text-[13px] leading-relaxed text-[color:var(--bsc-text-2)]"
                    >
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-[color:var(--bsc-accent)]" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="mt-8 flex items-center gap-2 text-[12px] text-[color:var(--bsc-text-3)]">
              <span className="font-sans font-medium">
                {featuredResearch.minutes} min read ·{" "}
                {new Date(featuredResearch.date).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <ArrowRight className="ml-auto size-3.5 transition-transform group-hover:translate-x-1 group-hover:text-[color:var(--bsc-text-1)]" />
            </div>
          </Link>
        </Reveal>

        <div className="flex flex-col gap-3">
          {recentPosts.map((post, i) => (
            <Reveal key={post.slug} delay={0.05 * i}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block rounded-xl border border-white/[0.07] bg-[color-mix(in_oklch,var(--bsc-surface)_70%,transparent)] p-5 transition-colors hover:border-white/15 hover:bg-[color-mix(in_oklch,var(--bsc-surface)_85%,transparent)]"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-[11px] font-sans font-semibold uppercase tracking-[0.05em] text-[color:var(--bsc-text-3)]">
                    {post.kicker}
                  </span>
                  <StatusBadge variant={post.stage} />
                </div>
                <h4 className="text-[15px] font-medium leading-snug text-[color:var(--bsc-text-1)]">
                  {post.title}
                </h4>
                <div className="mt-3 flex items-center justify-between text-[12px] font-medium text-[color:var(--bsc-text-3)]">
                  <span>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    · {post.minutes} min
                  </span>
                  <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5 group-hover:text-[color:var(--bsc-text-1)]" />
                </div>
              </Link>
            </Reveal>
          ))}

          <Link
            href="/blog"
            className="mt-2 inline-flex items-center gap-2 rounded-xl border border-dashed border-white/[0.08] p-5 text-[13px] text-[color:var(--bsc-text-2)] transition-colors hover:border-white/20 hover:text-[color:var(--bsc-text-1)]"
          >
            <span className="font-sans text-[12px] font-semibold uppercase tracking-[0.05em] text-[color:var(--bsc-text-3)]">
              All posts
            </span>
            <ArrowRight className="ml-auto size-3.5" />
          </Link>
        </div>
      </div>
    </Section>
  );
}
