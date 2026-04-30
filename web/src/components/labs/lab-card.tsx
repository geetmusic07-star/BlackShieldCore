"use client";

import Link from "next/link";
import { motion } from "motion/react";
import type { Lab } from "@/content/types";

const EASE = [0.22, 1, 0.36, 1] as const;
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";

const diffTint: Record<Lab["difficulty"], string> = {
  Easy: "text-[color:var(--bsc-accent)]",
  Medium: "text-[color:var(--bsc-amber)]",
  Hard: "text-[color:var(--bsc-rose)]",
};

export function LabCard({ lab, index = 0 }: { lab: Lab; index?: number }) {
  const disabled = lab.stage !== "available";
  const Comp: React.ElementType = disabled ? "div" : Link;
  const props = disabled ? {} : { href: `/labs/${lab.slug}` };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.04, ease: EASE }}
    >
      <Comp
        {...props}
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[color-mix(in_oklch,var(--bsc-surface)_75%,transparent)] p-5 transition-colors",
          disabled
            ? "opacity-60"
            : "hover:border-white/15 hover:bg-[color-mix(in_oklch,var(--bsc-surface)_92%,transparent)]",
        )}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
            {lab.category}
          </span>
          <span className={cn("text-[10px] font-mono uppercase tracking-wider", diffTint[lab.difficulty])}>
            {lab.difficulty}
          </span>
        </div>
        <h3 className="text-[16px] font-semibold leading-snug tracking-[-0.012em] text-[color:var(--bsc-text-1)]">
          {lab.title}
        </h3>
        <p className="mt-2 text-[13px] leading-relaxed text-[color:var(--bsc-text-2)]">
          {lab.summary}
        </p>
        <div className="mt-5 flex items-center justify-between pt-4 text-[11px] font-mono text-[color:var(--bsc-text-3)] border-t border-white/[0.06]">
          <span>
            +{lab.xp} XP · ~{lab.durationMinutes} min
          </span>
          <StatusBadge variant={lab.stage} />
        </div>
      </Comp>
    </motion.div>
  );
}
