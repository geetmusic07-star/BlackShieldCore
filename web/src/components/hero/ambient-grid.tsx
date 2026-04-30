"use client";

/**
 * Subtle ambient layer - a soft animated mesh-grid + radial glow.
 * Pure CSS/SVG, no Three.js. Designed to read as background, not a feature.
 */
export function AmbientGrid() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Layered radial wash - calm, not neon */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 70% 0%, color-mix(in oklch, var(--bsc-accent) 13%, transparent), transparent 70%), radial-gradient(ellipse 55% 40% at 15% 80%, color-mix(in oklch, var(--bsc-violet) 8%, transparent), transparent 65%)",
        }}
      />
      {/* SVG grid with vignette mask */}
      <svg
        className="absolute inset-0 size-full opacity-[0.35]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="bsc-mesh"
            width="64"
            height="64"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 64 0 L 0 0 0 64"
              fill="none"
              stroke="white"
              strokeOpacity="0.045"
              strokeWidth="1"
            />
          </pattern>
          <radialGradient id="bsc-mask" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="80%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="bsc-mesh-mask">
            <rect width="100%" height="100%" fill="url(#bsc-mask)" />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#bsc-mesh)"
          mask="url(#bsc-mesh-mask)"
        />
      </svg>
      {/* Slow drifting beam */}
      <div
        className="absolute -top-1/3 left-1/2 size-[1200px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "conic-gradient(from 220deg at 50% 50%, transparent 0%, color-mix(in oklch, var(--bsc-accent) 22%, transparent) 25%, transparent 60%)",
          animation: "bsc-spin 60s linear infinite",
        }}
      />
      <style>{`@keyframes bsc-spin { to { transform: translate(-50%, 0) rotate(360deg); } }`}</style>
    </div>
  );
}
