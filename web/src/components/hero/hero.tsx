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
          <motion.div
            custom={0}
            variants={fade}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-mono tracking-[0.12em] uppercase text-[color:var(--bsc-text-3)] backdrop-blur"
          >
            <span className="size-1.5 rounded-full bg-[color:var(--bsc-accent)]" />
            BlackShield Core · v0.1
          </motion.div>

          <motion.h1
            custom={1}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-7 text-[clamp(44px,6.4vw,84px)] font-semibold leading-[1.02] tracking-[-0.028em] text-[color:var(--bsc-text-1)]"
          >
            A cybersecurity and AI
            <br />
            <span className="text-[color:var(--bsc-text-3)]">research environment.</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mx-auto mt-7 max-w-xl text-[15.5px] md:text-base leading-relaxed text-[color:var(--bsc-text-2)]"
          >
            Hands-on labs, security tools, deep-dive research, and curated case studies —
            built to be useful, documented, and reproducible. Made for practitioners who
            want depth, not marketing.
          </motion.p>

          <motion.div
            custom={3}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
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
              href="/research"
              className="rounded-full border border-white/10 bg-white/[0.02] text-[color:var(--bsc-text-2)] hover:bg-white/[0.05] hover:text-[color:var(--bsc-text-1)] px-6"
            >
              Read research
            </LinkButton>
          </motion.div>

          <motion.dl
            custom={4}
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
                <dt className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
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
