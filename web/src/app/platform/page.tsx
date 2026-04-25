import type { Metadata } from "next";
import { PlatformGrid } from "@/components/home/platform-grid";
import { FeatureStrip } from "@/components/home/feature-strip";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Platform",
  description: "The full BlackShield Core platform: twelve integrated modules across offensive, defensive, and AI security.",
};

export default function PlatformPage() {
  return (
    <>
      <section className="relative pt-40 pb-16 md:pt-52 md:pb-24">
        <Container className="max-w-[920px]">
          <Reveal>
            <div className="mb-4 text-[10px] font-medium uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)] font-mono">
              Platform Overview
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="text-[clamp(42px,6vw,76px)] font-semibold leading-[1.02] tracking-[-0.028em] text-[color:var(--bsc-text-1)]">
              Every attack surface.
              <br />
              <span className="text-[color:var(--bsc-text-3)]">One coherent platform.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-[color:var(--bsc-text-2)]">
              BlackShield Core is built as a modular research environment. Each module is a
              standalone surface — lab, dashboard, tool, or writeup — but every piece links
              into the others, so the depth compounds as you move through it.
            </p>
          </Reveal>
        </Container>
      </section>
      <PlatformGrid />
      <FeatureStrip />
    </>
  );
}
