"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

/**
 * Global Motion for React configuration — tuned for premium, restrained feel.
 */
export function MotionConfigProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 32,
        mass: 0.9,
      }}
    >
      {children}
    </MotionConfig>
  );
}
