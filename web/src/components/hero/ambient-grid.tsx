"use client";

/**
 * Ambient background layer - layered radial glows, animated mesh grid, drifting orbs, and a slow conic sweep.
 * Pure CSS/SVG + inline styles. Background only — never draws focus from content.
 */
export function AmbientGrid() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">

      {/* Primary radial washes */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 75% 60% at 72% -5%, color-mix(in oklch, var(--bsc-accent) 16%, transparent), transparent 68%)",
            "radial-gradient(ellipse 60% 45% at 12% 85%, color-mix(in oklch, var(--bsc-violet) 10%, transparent), transparent 65%)",
            "radial-gradient(ellipse 45% 35% at 48% 50%, color-mix(in oklch, var(--bsc-accent) 5%, transparent), transparent 70%)",
          ].join(", "),
        }}
      />

      {/* SVG mesh grid with radial mask */}
      <svg
        className="absolute inset-0 size-full"
        style={{ opacity: 0.45 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="bsc-mesh" width="64" height="64" patternUnits="userSpaceOnUse">
            <path
              d="M 64 0 L 0 0 0 64"
              fill="none"
              stroke="white"
              strokeOpacity="0.055"
              strokeWidth="1"
            />
          </pattern>
          <radialGradient id="bsc-mask-grad" cx="50%" cy="38%" r="62%">
            <stop offset="0%"  stopColor="white" stopOpacity="1" />
            <stop offset="75%" stopColor="white" stopOpacity="0.2" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="bsc-mesh-mask">
            <rect width="100%" height="100%" fill="url(#bsc-mask-grad)" />
          </mask>
          {/* Horizontal scan line gradient */}
          <linearGradient id="scan-line-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"  stopColor="transparent" />
            <stop offset="30%" stopColor="white" stopOpacity="0.08" />
            <stop offset="50%" stopColor="white" stopOpacity="0.22" />
            <stop offset="70%" stopColor="white" stopOpacity="0.08" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#bsc-mesh)" mask="url(#bsc-mesh-mask)" />
      </svg>

      {/* Slow conic sweep beam */}
      <div
        className="absolute -top-1/3 left-1/2 -translate-x-1/2 rounded-full"
        style={{
          width: 1400,
          height: 1400,
          opacity: 0.28,
          filter: "blur(1px)",
          background:
            "conic-gradient(from 215deg at 50% 50%, transparent 0%, color-mix(in oklch, var(--bsc-accent) 25%, transparent) 22%, transparent 55%)",
          animation: "bsc-spin 70s linear infinite",
        }}
      />
      <style>{`@keyframes bsc-spin { to { transform: translate(-50%, 0) rotate(360deg); } }`}</style>

      {/* Drifting glow orbs */}
      <div
        className="absolute rounded-full"
        style={{
          width: 520,
          height: 520,
          top: "8%",
          right: "5%",
          background: "radial-gradient(circle, color-mix(in oklch, var(--bsc-accent) 14%, transparent) 0%, transparent 70%)",
          filter: "blur(40px)",
          animation: "bsc-orb-drift 18s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 380,
          height: 380,
          bottom: "10%",
          left: "8%",
          background: "radial-gradient(circle, color-mix(in oklch, var(--bsc-violet) 12%, transparent) 0%, transparent 70%)",
          filter: "blur(50px)",
          animation: "bsc-orb-drift 24s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 240,
          height: 240,
          top: "42%",
          left: "52%",
          background: "radial-gradient(circle, color-mix(in oklch, var(--bsc-accent) 8%, transparent) 0%, transparent 70%)",
          filter: "blur(35px)",
          animation: "bsc-orb-drift 30s ease-in-out infinite 4s",
        }}
      />

      {/* Bottom gradient fade to void */}
      <div
        className="absolute inset-x-0 bottom-0 h-48"
        style={{
          background: "linear-gradient(to bottom, transparent, var(--bsc-void))",
        }}
      />
    </div>
  );
}
