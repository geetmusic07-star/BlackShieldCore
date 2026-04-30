"use client";

import { motion } from "motion/react";
import { RiskScorePanel } from "./panels/risk-score";
import { AttackGraphPanel } from "./panels/attack-graph";
import { TelemetryFeedPanel } from "./panels/telemetry-feed";
import { AIReasoningPanel } from "./panels/ai-reasoning";
import { CoverageMiniPanel } from "./panels/coverage-mini";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.08, duration: 0.85, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

/**
 * Layered command-interface composition. Replaces the giant 3D sphere.
 * Each panel is a credible, working mock of a real product surface.
 */
export function CommandMockup() {
  return (
    <div className="relative w-full">
      {/* Soft gradient frame */}
      <div
        aria-hidden="true"
        className="absolute -inset-6 -z-10 rounded-[36px] opacity-90"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 40%, color-mix(in oklch, var(--bsc-accent) 12%, transparent), transparent 60%)",
        }}
      />

      <div className="relative grid gap-3 md:grid-cols-12 md:grid-rows-[auto_auto_auto]">
        {/* Attack graph - large, dominant */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="show"
          className="md:col-span-12 md:row-start-1"
        >
          <AttackGraphPanel />
        </motion.div>

        {/* Risk score */}
        <motion.div
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="show"
          className="md:col-span-5 md:row-start-2"
        >
          <RiskScorePanel />
        </motion.div>

        {/* AI reasoning */}
        <motion.div
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="show"
          className="md:col-span-7 md:row-start-2"
        >
          <AIReasoningPanel />
        </motion.div>

        {/* Telemetry feed */}
        <motion.div
          variants={fadeUp}
          custom={3}
          initial="hidden"
          animate="show"
          className="md:col-span-7 md:row-start-3"
        >
          <TelemetryFeedPanel />
        </motion.div>

        {/* Coverage mini */}
        <motion.div
          variants={fadeUp}
          custom={4}
          initial="hidden"
          animate="show"
          className="md:col-span-5 md:row-start-3"
        >
          <CoverageMiniPanel />
        </motion.div>
      </div>
    </div>
  );
}
