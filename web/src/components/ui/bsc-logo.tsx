"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * BSC Sigil — hexagonal shell with triangulated neural core.
 *
 * Geometry:
 *  • Outer shell: pointed-top regular hexagon (r=18, centre 20,22)
 *  • Inner ring:  same orientation, r=10
 *  • Three connector spines on alternating vertices (top, BR, BL)
 *    — other three vertices are dimmed, suggesting selective activation
 *  • Core diamond (outline) + filled inner diamond + centre pulse
 *
 * All colours reference CSS custom properties so the mark adapts
 * to any theme that defines --bsc-accent / --bsc-violet / --bsc-text-3.
 */
export function BscMark({ size = 28, className }: { size?: number; className?: string }) {
  const uid = `bsc${useId().replace(/:/g, "")}`;
  const G1 = `${uid}g1`; // main diagonal gradient (accent → violet)
  const G2 = `${uid}g2`; // dim version of the same gradient
  const GC = `${uid}gc`; // radial core fill
  const GW = `${uid}gw`; // glow filter

  // Outer hex vertices (pointed-top, r=18, centre 20,22)
  const outer = "20,4 35.6,13 35.6,31 20,40 4.4,31 4.4,13";
  // Inner hex vertices (same orientation, r=10)
  const inner = "20,12 28.66,17 28.66,27 20,32 11.34,27 11.34,17";

  return (
    <svg
      width={size}
      height={Math.round(size * (44 / 40))}
      viewBox="0 0 40 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      aria-hidden="true"
    >
      <defs>
        {/* Diagonal gradient: top-left accent → bottom-right violet */}
        <linearGradient id={G1} x1="4" y1="4" x2="36" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="var(--bsc-accent)" />
          <stop offset="100%" stopColor="var(--bsc-violet)" />
        </linearGradient>

        {/* Dim variant for secondary geometry */}
        <linearGradient id={G2} x1="4" y1="4" x2="36" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="var(--bsc-accent)" stopOpacity="0.38" />
          <stop offset="100%" stopColor="var(--bsc-violet)" stopOpacity="0.38" />
        </linearGradient>

        {/* Radial fill for the inner diamond */}
        <radialGradient id={GC} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="var(--bsc-accent)"  stopOpacity="0.95" />
          <stop offset="100%" stopColor="var(--bsc-violet)"  stopOpacity="0.75" />
        </radialGradient>

        {/* Soft glow — used on hot nodes and centre pulse */}
        <filter id={GW} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="1.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── 1. Outer hexagonal shell ─────────────────────────── */}
      <polygon
        points={outer}
        stroke={`url(#${G1})`}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      {/* ── 2. Inner concentric ring ─────────────────────────── */}
      <polygon
        points={inner}
        stroke={`url(#${G2})`}
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* ── 3. Connector spines (3 of 6 — alternating active) ── */}
      {/* top */}
      <line x1="20"   y1="4"  x2="20"    y2="12"   stroke="var(--bsc-accent)" strokeWidth="1"   strokeOpacity="0.7" />
      {/* bottom-right */}
      <line x1="35.6" y1="31" x2="28.66" y2="27"   stroke="var(--bsc-accent)" strokeWidth="1"   strokeOpacity="0.7" />
      {/* bottom-left */}
      <line x1="4.4"  y1="31" x2="11.34" y2="27"   stroke="var(--bsc-accent)" strokeWidth="1"   strokeOpacity="0.7" />

      {/* ── 4. Inactive vertex markers (standby — no spine) ──── */}
      <circle cx="35.6" cy="13" r="1"   fill="var(--bsc-text-3)" fillOpacity="0.28" />
      <circle cx="20"   cy="40" r="1"   fill="var(--bsc-text-3)" fillOpacity="0.28" />
      <circle cx="4.4"  cy="13" r="1"   fill="var(--bsc-text-3)" fillOpacity="0.28" />

      {/* ── 5. Active vertex nodes (lit, glow) ───────────────── */}
      <g filter={`url(#${GW})`}>
        <circle cx="20"   cy="4"  r="1.6" fill="var(--bsc-accent)" />
        <circle cx="35.6" cy="31" r="1.6" fill="var(--bsc-accent)" />
        <circle cx="4.4"  cy="31" r="1.6" fill="var(--bsc-accent)" />
      </g>

      {/* ── 6. Core diamond outline ──────────────────────────── */}
      <polygon
        points="20,16.5 25.5,22 20,27.5 14.5,22"
        stroke={`url(#${G1})`}
        strokeWidth="0.9"
        strokeOpacity="0.65"
        strokeLinejoin="round"
      />

      {/* ── 7. Inner diamond fill ────────────────────────────── */}
      <polygon
        points="20,19.5 22.5,22 20,24.5 17.5,22"
        fill={`url(#${GC})`}
      />

      {/* ── 8. Centre pulse (hottest point) ─────────────────── */}
      <g filter={`url(#${GW})`}>
        <circle cx="20" cy="22" r="2" fill="var(--bsc-accent)" />
      </g>
    </svg>
  );
}

/**
 * Full wordmark — mark + styled "BlackShield Core" text.
 * Use `size` to control mark height; text scales proportionally.
 */
export function BscWordmark({
  size = 28,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const textSize = Math.round(size * 0.48);
  const subSize  = Math.round(size * 0.34);

  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <BscMark size={size} />
      <span
        className="flex flex-col leading-none"
        style={{ gap: Math.round(size * 0.09) }}
      >
        <span
          className="font-semibold tracking-[-0.018em] text-[color:var(--bsc-text-1)]"
          style={{ fontSize: textSize }}
        >
          BlackShield
        </span>
        <span
          className="font-mono uppercase tracking-[0.18em] text-[color:var(--bsc-accent)]"
          style={{ fontSize: subSize, letterSpacing: "0.18em" }}
        >
          Core
        </span>
      </span>
    </span>
  );
}
