import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/container";
import type { HTMLAttributes, ReactNode } from "react";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  heading?: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
}

export function Section({
  eyebrow,
  heading,
  lede,
  align = "left",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn("relative py-16 md:py-20", className)} {...props}>
      <Container>
        {(eyebrow || heading || lede) && (
          <header
            className={cn(
              "mb-14 max-w-2xl",
              align === "center" && "mx-auto text-center",
            )}
          >
            {eyebrow && (
              <div className="mb-4 text-[10px] font-medium uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)] font-mono">
                {eyebrow}
              </div>
            )}
            {heading && (
              <h2 className="text-3xl md:text-[40px] leading-[1.1] font-semibold tracking-[-0.022em] text-[color:var(--bsc-text-1)]">
                {heading}
              </h2>
            )}
            {lede && (
              <p className="mt-5 text-[15px] md:text-base leading-relaxed text-[color:var(--bsc-text-2)]">
                {lede}
              </p>
            )}
          </header>
        )}
        {children}
      </Container>
    </section>
  );
}
