"use client";

import { motion, type Variants } from "motion/react";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/link-button";
import { ArrowRight } from "lucide-react";
import { AmbientGrid } from "./ambient-grid";
import { CommandMockup } from "./command-mockup";

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
    <section className="relative isolate overflow-hidden pt-32 pb-24 md:pt-44 md:pb-32">
      <AmbientGrid />

      <Container className="relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          {/* Left: copy */}
          <div className="max-w-2xl">
            <motion.div
              custom={0}
              variants={fade}
              initial="hidden"
              animate="show"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-mono tracking-[0.12em] uppercase text-[color:var(--bsc-text-3)] backdrop-blur"
            >
              <span className="size-1.5 rounded-full bg-[color:var(--bsc-accent)]" />
              Adversary-aware operations · v0.1
            </motion.div>

            <motion.h1
              custom={1}
              variants={fade}
              initial="hidden"
              animate="show"
              className="mt-6 text-[clamp(40px,5.6vw,72px)] font-semibold leading-[1.02] tracking-[-0.028em] text-[color:var(--bsc-text-1)]"
            >
              Run the adversary.
              <br />
              <span className="text-[color:var(--bsc-text-3)]">Catch the adversary.</span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={fade}
              initial="hidden"
              animate="show"
              className="mt-6 max-w-lg text-[15.5px] md:text-base leading-relaxed text-[color:var(--bsc-text-2)]"
            >
              BlackShield Core simulates adversary behavior, surfaces it across XDR, EDR, SIEM,
              and WAF, and gives security teams one operating layer for offensive, defensive,
              and AI workflows.
            </motion.p>

            <motion.div
              custom={3}
              variants={fade}
              initial="hidden"
              animate="show"
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <LinkButton
                size="lg"
                href="/platform"
                className="rounded-full bg-[color:var(--bsc-text-1)] text-[color:var(--bsc-void)] hover:bg-white px-6"
              >
                Enter Platform
                <ArrowRight className="ml-1 size-4" />
              </LinkButton>
              <LinkButton
                size="lg"
                variant="ghost"
                href="/research"
                className="rounded-full border border-white/10 bg-white/[0.02] text-[color:var(--bsc-text-2)] hover:bg-white/[0.05] hover:text-[color:var(--bsc-text-1)] px-6"
              >
                View research
              </LinkButton>
            </motion.div>

            <motion.dl
              custom={4}
              variants={fade}
              initial="hidden"
              animate="show"
              className="mt-12 grid max-w-md grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4"
            >
              {[
                ["24", "Active Labs"],
                ["142", "CVEs Reviewed"],
                ["18", "Research Notes"],
                ["12", "Modules"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
                    {l}
                  </dt>
                  <dd className="mt-1 text-[22px] font-semibold tracking-[-0.022em] text-[color:var(--bsc-text-1)]">
                    {v}
                  </dd>
                </div>
              ))}
            </motion.dl>
          </div>

          {/* Right: command-interface mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, delay: 0.25, ease: EASE }}
            className="relative"
          >
            <CommandMockup />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
