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
      <section className="relative overflow-hidden pt-40 pb-16 md:pt-48 md:pb-20">
        {/* Header ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 60% -10%, color-mix(in oklch, var(--bsc-accent) 10%, transparent), transparent 65%), radial-gradient(ellipse 50% 40% at 10% 90%, color-mix(in oklch, var(--bsc-violet) 6%, transparent), transparent 60%)",
          }}
        />
        {/* Grid mesh */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(color-mix(in oklch, white 5%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklch, white 5%, transparent) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 70% 60% at 55% 30%, black 0%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 55% 30%, black 0%, transparent 80%)",
          }}
        />

        <Container>
          <Reveal>
            <div className="mb-4 inline-flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
              <span
                className="size-1 rounded-full"
                style={{ background: "var(--bsc-accent)" }}
              />
              {eyebrow}
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="max-w-3xl text-[clamp(40px,5.4vw,68px)] font-semibold leading-[1.03] tracking-[-0.03em] text-[color:var(--bsc-text-1)]">
              {title}
            </h1>
          </Reveal>
          {lede && (
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-[600px] text-[15px] leading-[1.75] text-[color:var(--bsc-text-2)] md:text-[15.5px]">
                {lede}
              </p>
            </Reveal>
          )}
        </Container>

        {/* Bottom separator */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent 0%, color-mix(in oklch, white 10%, transparent) 30%, color-mix(in oklch, white 10%, transparent) 70%, transparent 100%)",
          }}
        />
      </section>
      <div className="pb-32">{children}</div>
    </>
  );
}
