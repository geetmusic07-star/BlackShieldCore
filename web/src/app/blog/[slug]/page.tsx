import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { StatusBadge } from "@/components/ui/status-badge";
import { blogPosts, getPost } from "@/content/blog";
import { ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  return blogPosts.filter((p) => p.stage === "available").map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) return { title: "Post not found" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="relative pt-40 pb-32 md:pt-48 md:pb-40">
      <Container className="max-w-[780px]">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[12px] font-mono text-[color:var(--bsc-text-3)] transition-colors hover:text-[color:var(--bsc-text-1)]"
        >
          <ArrowLeft className="size-3.5" />
          All Posts
        </Link>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-accent)]">
            {post.kicker}
          </span>
          <StatusBadge variant={post.stage} />
          <span className="text-[11px] font-mono text-[color:var(--bsc-text-3)]">
            {post.minutes} min read ·{" "}
            {new Date(post.date).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        <h1 className="mt-6 text-[clamp(32px,4.4vw,52px)] font-semibold leading-[1.08] tracking-[-0.022em] text-[color:var(--bsc-text-1)]">
          {post.title}
        </h1>

        <p className="mt-6 text-[17px] leading-relaxed text-[color:var(--bsc-text-2)]">
          {post.excerpt}
        </p>

        {post.body && (
          <div className="mt-12 space-y-5 text-[16px] leading-[1.78] text-[color:var(--bsc-text-2)]">
            {post.body.split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}
      </Container>
    </article>
  );
}
