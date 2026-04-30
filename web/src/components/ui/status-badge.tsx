import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type Variant = "available" | "build" | "research" | "beta" | "planned";

const styles: Record<Variant, string> = {
  available: "bg-[color-mix(in_oklch,var(--bsc-accent)_14%,transparent)] text-[color:var(--bsc-accent)] ring-[color-mix(in_oklch,var(--bsc-accent)_32%,transparent)]",
  build: "bg-[color-mix(in_oklch,var(--bsc-amber)_12%,transparent)] text-[color:var(--bsc-amber)] ring-[color-mix(in_oklch,var(--bsc-amber)_28%,transparent)]",
  research: "bg-[color-mix(in_oklch,var(--bsc-violet)_14%,transparent)] text-[color:var(--bsc-violet)] ring-[color-mix(in_oklch,var(--bsc-violet)_30%,transparent)]",
  beta: "bg-[color-mix(in_oklch,var(--bsc-accent)_10%,transparent)] text-[color:var(--bsc-accent)] ring-[color-mix(in_oklch,var(--bsc-accent)_24%,transparent)]",
  planned: "bg-white/[0.03] text-[color:var(--bsc-text-3)] ring-white/10",
};

const labels: Record<Variant, string> = {
  available: "Available",
  build: "Build Stage",
  research: "Research",
  beta: "Beta",
  planned: "Planned",
};

interface Props extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
  label?: string;
}

export function StatusBadge({ variant = "available", label, className, ...props }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium tracking-wide uppercase ring-1 ring-inset font-mono",
        styles[variant],
        className,
      )}
      {...props}
    >
      <span
        className="size-1 rounded-full bg-current opacity-80"
        aria-hidden="true"
      />
      {label ?? labels[variant]}
    </span>
  );
}
