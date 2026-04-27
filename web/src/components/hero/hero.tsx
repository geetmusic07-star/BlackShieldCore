"use client";

import { motion, type Variants } from "motion/react";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/link-button";
import { ArrowRight } from "lucide-react";
import { AmbientGrid } from "./ambient-grid";

const EASE = [0.22, 1, 0.36, 1] as const;

const fade: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.07, duration: 0.85, ease: EASE },
  }),
};

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-36 pb-24 md:pt-52 md:pb-36">
      <AmbientGrid />

      <Container className="relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          {/* Status pill */}
          <motion.div
            custom={0}
            variants={fade}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)] backdrop-blur"
          >
            <span className="size-1.5 rounded-full bg-[color:var(--bsc-accent)]" />
            v0.1 · Active research
          </motion.div>

          {/* Brand wordmark */}
          <motion.h1
            custom={1}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-7 text-[clamp(44px,7.4vw,92px)] font-semibold leading-[0.98] tracking-[-0.028em] text-[color:var(--bsc-text-1)]"
          >
            BlackShield{" "}
            <span className="text-[color:var(--bsc-text-3)]">Core</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            custom={2}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-5 text-[clamp(17px,2vw,22px)] font-medium leading-snug tracking-[-0.012em] text-[color:var(--bsc-text-2)]"
          >
            A cybersecurity{" "}
            <span className="text-[color:var(--bsc-accent)]">×</span>{" "}
            AI research environment.
          </motion.p>

          {/* Lede */}
          <motion.p
            custom={3}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mx-auto mt-5 max-w-xl text-[15px] md:text-[15.5px] leading-relaxed text-[color:var(--bsc-text-3)]"
          >
            Hands-on labs, security tools, deep-dive research, and curated case
            studies — built to be useful, documented, and reproducible. Made for
            practitioners who want depth, not marketing.
          </motion.p>

          {/* CTAs */}
          <motion.div
            custom={4}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <LinkButton
              size="lg"
              href="/labs"
              className="rounded-full bg-[color:var(--bsc-text-1)] text-[color:var(--bsc-void)] hover:bg-white px-6"
            >
              Browse Labs
              <ArrowRight className="ml-1 size-4" />
            </LinkButton>
            <LinkButton
              size="lg"
              variant="ghost"
              href="/ai-security"
              className="rounded-full border border-white/10 bg-white/[0.02] px-6 text-[color:var(--bsc-text-2)] hover:bg-white/[0.05] hover:text-[color:var(--bsc-text-1)]"
            >
              AI Security range
            </LinkButton>
          </motion.div>

          {/* Stats */}
          <motion.dl
            custom={5}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-x-10 gap-y-6 md:grid-cols-4"
          >
            {[
              ["24", "Lab Tracks"],
              ["142", "CVEs Reviewed"],
              ["18", "Research Notes"],
              ["12", "Modules"],
            ].map(([v, l]) => (
              <div key={l} className="text-left md:text-center">
                <dt className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--bsc-text-3)]">
                  {l}
                </dt>
                <dd className="mt-1.5 text-[22px] font-semibold tracking-[-0.022em] text-[color:var(--bsc-text-1)]">
                  {v}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </Container>
    </section>
  );
}
