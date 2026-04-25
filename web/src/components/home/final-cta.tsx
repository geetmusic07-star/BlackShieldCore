"use client";

import { motion } from "motion/react";
import { Container } from "@/components/ui/container";
import { LinkButton } from "@/components/ui/link-button";
import { ArrowRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function FinalCTASection() {
  return (
    <section className="relative isolate overflow-hidden py-28 md:py-36">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, color-mix(in oklch, var(--bsc-accent) 15%, transparent), transparent 70%)",
        }}
      />
      <Container className="max-w-3xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="text-[clamp(36px,5vw,64px)] font-semibold leading-[1.04] tracking-[-0.026em] text-[color:var(--bsc-text-1)]"
        >
          Adversary-aware operations,
          <br />
          <span className="text-[color:var(--bsc-text-3)]">running on your real stack.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, delay: 0.08, ease: EASE }}
          className="mx-auto mt-6 max-w-xl text-[15.5px] leading-relaxed text-[color:var(--bsc-text-2)]"
        >
          BlackShield Core is in research preview. Request access if you operate a security
          program against a serious threat model — we&apos;ll start with a scoped pilot.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, delay: 0.16, ease: EASE }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <LinkButton
            size="lg"
            href="/platform"
            className="rounded-full bg-[color:var(--bsc-text-1)] text-[color:var(--bsc-void)] hover:bg-white px-7"
          >
            Request preview access
            <ArrowRight className="ml-1 size-4" />
          </LinkButton>
          <LinkButton
            size="lg"
            variant="ghost"
            href="/research"
            className="rounded-full border border-white/10 bg-white/[0.02] text-[color:var(--bsc-text-2)] hover:bg-white/[0.05] hover:text-[color:var(--bsc-text-1)] px-7"
          >
            Read the research
          </LinkButton>
        </motion.div>
      </Container>
    </section>
  );
}
