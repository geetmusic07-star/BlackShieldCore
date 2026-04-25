"use client";

import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { CommandMockup } from "@/components/hero/command-mockup";

export function CommandSurfacesSection() {
  return (
    <section className="relative py-16 md:py-24">
      <Container>
        <div className="mb-10 grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-end">
          <Reveal>
            <div>
              <div className="mb-3 text-[10px] font-mono uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
                Command surfaces
              </div>
              <h2 className="text-[clamp(24px,2.8vw,32px)] font-semibold leading-[1.1] tracking-[-0.02em]">
                A glimpse of the operating layer.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="text-[14px] leading-relaxed text-[color:var(--bsc-text-2)]">
              Concrete surfaces underneath — a graph, a risk score, an AI analyst, a telemetry
              stream — all reading from the same shared topology.
            </p>
          </Reveal>
        </div>

        <Reveal>
          <div className="mx-auto max-w-[820px]">
            <CommandMockup />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
