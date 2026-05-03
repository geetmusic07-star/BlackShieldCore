"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const body = document.getElementById("post-body");
      if (!body) return;
      const rect = body.getBoundingClientRect();
      const scrolled = Math.max(0, -rect.top);
      const total = body.offsetHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-[3px] bg-white/[0.04]"
    >
      <div
        className="h-full"
        style={{
          width: `${progress}%`,
          background:
            "linear-gradient(to right, var(--bsc-accent), var(--bsc-violet))",
          boxShadow: "0 0 10px color-mix(in oklch, var(--bsc-accent) 60%, transparent)",
          transition: "width 0.08s linear",
        }}
      />
    </div>
  );
}
