import type { Metadata } from "next";
import { ModulesGrid } from "@/components/home/modules-grid";
import { ApproachSection } from "@/components/home/approach";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Platform Overview",
  description:
    "BlackShield Core as a whole - labs, tools, research, case studies, OSINT, home-lab architecture, and the AI security work that ties them together.",
};

export default function PlatformPage() {
  return (
    <>
      <section className="relative pt-40 pb-16 md:pt-52 md:pb-24">
        <Container className="max-w-[920px]">
          <Reveal>
            <div className="mb-4 text-[10px] font-mono uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
              Platform Overview
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="text-[clamp(42px,5.6vw,68px)] font-semibold leading-[1.04] tracking-[-0.026em] text-[color:var(--bsc-text-1)]">
              One research environment.
              <br />
              <span className="text-[color:var(--bsc-text-3)]">Many cross-linked modules.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-[15.5px] leading-relaxed text-[color:var(--bsc-text-2)]">
              BlackShield Core is built as a modular research environment. Each module is a
              standalone surface - a lab, a tool, a writeup, an investigation - but every piece
              links into the others, so the depth compounds as you move through it.
            </p>
          </Reveal>
        </Container>
      </section>
      <ModulesGrid />
      <ApproachSection />
    </>
  );
}
