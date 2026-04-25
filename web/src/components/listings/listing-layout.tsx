import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

export function ListingLayout({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <section className="relative pt-40 pb-14 md:pt-48 md:pb-16">
        <Container>
          <Reveal>
            <div className="mb-4 text-[10px] font-medium uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)] font-mono">
              {eyebrow}
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="max-w-3xl text-[clamp(40px,5.2vw,64px)] font-semibold leading-[1.04] tracking-[-0.028em] text-[color:var(--bsc-text-1)]">
              {title}
            </h1>
          </Reveal>
          {lede && (
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-2xl text-[15px] md:text-base leading-relaxed text-[color:var(--bsc-text-2)]">
                {lede}
              </p>
            </Reveal>
          )}
        </Container>
      </section>
      <div className="pb-32">{children}</div>
    </>
  );
}
