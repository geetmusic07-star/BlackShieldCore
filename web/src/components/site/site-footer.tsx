import Link from "next/link";
import { Container } from "@/components/ui/container";
import { footerLinks, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="relative z-10 mt-20 border-t border-white/[0.06] bg-[color-mix(in_oklch,var(--bsc-void)_92%,black)]">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5 text-sm font-semibold tracking-[-0.01em]">
              <span
                aria-hidden="true"
                className="relative inline-flex size-6 items-center justify-center"
              >
                <span className="absolute inset-0 rounded-[7px] bg-gradient-to-br from-[color:var(--bsc-accent)] to-[color:var(--bsc-accent-soft)] opacity-90" />
                <span className="absolute inset-[3px] rounded-[5px] bg-[color:var(--bsc-void)]" />
                <span className="relative size-[6px] rounded-full bg-[color:var(--bsc-accent)]" />
              </span>
              {site.name}
            </div>
            <p className="mt-4 max-w-sm text-[13px] leading-relaxed text-[color:var(--bsc-text-3)]">
              {site.description}
            </p>
          </div>
          {Object.entries(footerLinks).map(([col, items]) => (
            <div key={col}>
              <div className="mb-4 text-[10px] font-medium uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)] font-mono">
                {col}
              </div>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[13px] text-[color:var(--bsc-text-2)] transition-colors hover:text-[color:var(--bsc-text-1)]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-white/[0.04] pt-6 text-[11px] text-[color:var(--bsc-text-3)] font-mono md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
          <span className="tracking-wider uppercase opacity-70">
            v0.1 · Research Preview
          </span>
        </div>
      </Container>
    </footer>
  );
}
