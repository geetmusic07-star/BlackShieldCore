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
          {/* Brand wordmark */}
          <motion.h1
            custom={1}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-8 text-[clamp(48px,7.8vw,96px)] font-semibold leading-[0.96] tracking-[-0.032em] text-[color:var(--bsc-text-1)]"
          >
            BlackShield{" "}
            <span
              className="text-[color:var(--bsc-text-3)]"
              style={{
                backgroundImage: "linear-gradient(135deg, var(--bsc-text-3) 0%, color-mix(in oklch, var(--bsc-accent) 55%, var(--bsc-text-3)) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Core
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            custom={2}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-6 text-[clamp(16px,1.9vw,21px)] font-medium leading-snug tracking-[-0.01em] text-[color:var(--bsc-text-2)]"
          >
            Offensive security.{" "}
            <span className="text-[color:var(--bsc-accent)]">Detection engineering.</span>{" "}
            AI adversarial research.
          </motion.p>

          {/* Lede */}
          <motion.p
            custom={3}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mx-auto mt-5 max-w-[520px] text-[15px] leading-[1.7] text-[color:var(--bsc-text-3)]"
          >
            A practitioner-grade platform built around real attack patterns — hands-on labs,
            deep technical writing, and purpose-built tooling. No fluff, no vendor pitches.
          </motion.p>

          {/* CTAs */}
          <motion.div
            custom={4}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <LinkButton
              size="lg"
              href="/labs"
              className="rounded-full bg-[color:var(--bsc-text-1)] text-[color:var(--bsc-void)] hover:bg-white px-7 shadow-[0_0_32px_-4px_color-mix(in_oklch,var(--bsc-accent)_35%,transparent)] hover:shadow-[0_0_48px_-4px_color-mix(in_oklch,var(--bsc-accent)_50%,transparent)] transition-shadow duration-300"
            >
              Browse Labs
              <ArrowRight className="ml-1.5 size-4" />
            </LinkButton>
            <LinkButton
              size="lg"
              variant="ghost"
              href="/ai-security"
              className="rounded-full border border-white/[0.12] bg-white/[0.03] px-7 text-[color:var(--bsc-text-2)] hover:bg-white/[0.07] hover:border-white/[0.2] hover:text-[color:var(--bsc-text-1)] transition-all duration-200"
            >
              AI Red Teaming
            </LinkButton>
          </motion.div>

          {/* Divider */}
          <motion.div
            custom={4}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mx-auto mt-16 h-px w-[min(400px,70%)] bg-gradient-to-r from-transparent via-white/[0.1] to-transparent"
          />

          {/* Stats */}
          <motion.dl
            custom={5}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-x-8 gap-y-6 md:grid-cols-4"
          >
            {[
              ["24", "Lab Tracks"],
              ["142", "CVEs Reviewed"],
              ["8", "Research Notes"],
              ["10", "Modules"],
            ].map(([v, l]) => (
              <div key={l} className="group text-left md:text-center">
                <dd className="text-[28px] font-semibold tracking-[-0.028em] text-[color:var(--bsc-text-1)] tabular-nums">
                  {v}
                </dd>
                <dt className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[color:var(--bsc-text-3)]">
                  {l}
                </dt>
              </div>
            ))}
          </motion.dl>
        </div>
      </Container>
    </section>
  );
}
