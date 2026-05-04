"use client";

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

// ─────────────────────────────────────────────────────────────────────────────
// Equirectangular threat map.
// • Static country geometry (world-atlas TopoJSON)
// • Hover-only country labels
// • Comet-style attack particles via CSS offset-path
// • Bi-directional, randomized attack pattern across all countries
// • onAttack callback fires every spawn → drives sidebar stats
// ─────────────────────────────────────────────────────────────────────────────

const W = 1000;
const H = 500;

export const ATTACK_COLORS = {
  web: "#ff2a6d",
  ddos: "#ffb300",
  intruder: "#00e5ff",
  scanner: "#0080ff",
  anon: "#a020f0",
} as const;

export type AttackKey = keyof typeof ATTACK_COLORS;
const ATTACK_KEYS: AttackKey[] = ["web", "ddos", "intruder", "scanner", "anon"];

// ─────────────────────────────────────────────────────────────────────────────
// Geometry
// ─────────────────────────────────────────────────────────────────────────────

function project(lng: number, lat: number): [number, number] {
  return [((lng + 180) / 360) * W, ((90 - lat) / 180) * H];
}

type Country = {
  id: string;
  name: string;
  d: string;
  centroid: [number, number];
};

function decodeTopo(topo: any): Country[] {
  const { transform, arcs: rawArcs, objects } = topo;
  const obj = objects.countries;
  const [sx, sy] = transform.scale;
  const [tx, ty] = transform.translate;

  const decoded: [number, number][][] = rawArcs.map((arc: number[][]) => {
    let x = 0;
    let y = 0;
    return arc.map(([dx, dy]) => {
      x += dx;
      y += dy;
      return [x * sx + tx, y * sy + ty] as [number, number];
    });
  });

  const arcPoints = (idx: number): [number, number][] => {
    const reverse = idx < 0;
    const a = decoded[reverse ? ~idx : idx];
    return reverse ? a.slice().reverse() : a;
  };

  const ringToCoords = (ring: number[]): [number, number][] => {
    const coords: [number, number][] = [];
    ring.forEach((arcIdx, i) => {
      const a = arcPoints(arcIdx);
      coords.push(...(i > 0 ? a.slice(1) : a));
    });
    return coords;
  };

  const ringToPath = (coords: [number, number][]): string => {
    if (!coords.length) return "";
    const parts: string[] = [];
    let current: [number, number][] = [coords[0]];
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const curr = coords[i];
      if (Math.abs(curr[0] - prev[0]) > 180) {
        parts.push(
          current.map(([lng, lat]) => project(lng, lat).join(" ")).join(" L "),
        );
        current = [curr];
      } else {
        current.push(curr);
      }
    }
    parts.push(
      current.map(([lng, lat]) => project(lng, lat).join(" ")).join(" L "),
    );
    return parts.map((p) => `M ${p}`).join(" ");
  };

  return obj.geometries.map((g: any): Country => {
    const allRings: [number, number][][] = [];
    if (g.type === "Polygon") {
      allRings.push(...g.arcs.map(ringToCoords));
    } else if (g.type === "MultiPolygon") {
      g.arcs.forEach((poly: number[][]) => {
        allRings.push(...poly.map(ringToCoords));
      });
    }

    const pieces = allRings.map(ringToPath);

    // Centroid: largest ring's projected average — gives reasonable label anchor
    let centroid: [number, number] = [W / 2, H / 2];
    if (allRings.length) {
      const largest = allRings.reduce((a, b) =>
        a.length > b.length ? a : b,
      );
      let sX = 0;
      let sY = 0;
      largest.forEach(([lng, lat]) => {
        const [px, py] = project(lng, lat);
        sX += px;
        sY += py;
      });
      centroid = [sX / largest.length, sY / largest.length];
    }

    return {
      id: String(g.id ?? "").padStart(3, "0"),
      name: g.properties?.name ?? "Unknown",
      d: pieces.join(" "),
      centroid,
    };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Comet
// ─────────────────────────────────────────────────────────────────────────────

type Comet = {
  id: number;
  from: [number, number];
  to: [number, number];
  type: AttackKey;
  duration: number;
  archHeight: number;
};

function arcPath(from: [number, number], to: [number, number], arch: number) {
  const cx = (from[0] + to[0]) / 2;
  const cy = (from[1] + to[1]) / 2 - arch;
  return `M ${from[0].toFixed(2)} ${from[1].toFixed(2)} Q ${cx.toFixed(2)} ${cy.toFixed(2)} ${to[0].toFixed(2)} ${to[1].toFixed(2)}`;
}

const CometParticle = memo(function CometParticle({
  comet,
}: {
  comet: Comet;
}) {
  const color = ATTACK_COLORS[comet.type];
  const path = useMemo(
    () => arcPath(comet.from, comet.to, comet.archHeight),
    [comet.from, comet.to, comet.archHeight],
  );
  const gradId = `bsc-grad-${comet.type}`;

  return (
    <>
      {/* Faint base trail of the bezier — gives the "graceful arch" silhouette */}
      <path
        d={path}
        stroke={color}
        strokeOpacity={0.08}
        strokeWidth={0.45}
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
      {/* Comet body — bright head + fading gradient tail, motion via offset-path */}
      <g
        className="bsc-comet"
        style={
          {
            offsetPath: `path('${path}')`,
            offsetRotate: "auto",
            WebkitOffsetPath: `path('${path}')`,
            animationDuration: `${comet.duration}ms`,
          } as CSSProperties
        }
      >
        {/* Tail */}
        <rect
          x={-34}
          y={-0.55}
          width={34}
          height={1.1}
          rx={0.55}
          fill={`url(#${gradId})`}
        />
        {/* Bright head */}
        <circle cx={0} cy={0} r={1.5} fill={color} />
        <circle cx={0} cy={0} r={2.6} fill={color} fillOpacity={0.35} />
      </g>
      {/* Impact ring at landing */}
      <circle
        cx={comet.to[0]}
        cy={comet.to[1]}
        r={1}
        fill="none"
        stroke={color}
        strokeWidth={0.7}
        className="bsc-impact"
        style={{
          animationDelay: `${Math.max(0, comet.duration - 180)}ms`,
        }}
      />
    </>
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export function ThreatMap2D({
  onAttack,
}: {
  onAttack?: (type: AttackKey) => void;
}) {
  const [countries, setCountries] = useState<Country[] | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    name: string;
  } | null>(null);
  const [comets, setComets] = useState<Comet[]>([]);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const cometIdRef = useRef(0);
  const hoveredIdRef = useRef<string | null>(null);
  const onAttackRef = useRef(onAttack);
  const moveRafRef = useRef<number | null>(null);

  useEffect(() => {
    onAttackRef.current = onAttack;
  }, [onAttack]);

  // Load topology
  useEffect(() => {
    let cancelled = false;
    fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
      .then((r) => r.json())
      .then((topo) => {
        if (cancelled) return;
        setCountries(decodeTopo(topo));
      })
      .catch(() => {
        if (!cancelled) setCountries([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Comet spawn loop — rapid, randomized, bi-directional
  useEffect(() => {
    if (!countries || countries.length === 0) return;
    const pool = countries.filter(
      (c) =>
        c.centroid[0] > 5 &&
        c.centroid[0] < W - 5 &&
        c.centroid[1] > 5 &&
        c.centroid[1] < H - 5,
    );
    if (!pool.length) return;

    let active = true;
    let spawnTimer: ReturnType<typeof setTimeout>;
    const removeTimers = new Set<ReturnType<typeof setTimeout>>();

    const tick = () => {
      if (!active) return;

      const a = pool[Math.floor(Math.random() * pool.length)];
      let b = pool[Math.floor(Math.random() * pool.length)];
      let guard = 0;
      while ((b === a || Math.abs(b.centroid[0] - a.centroid[0]) > W * 0.6) && guard < 6) {
        b = pool[Math.floor(Math.random() * pool.length)];
        guard++;
      }
      if (b === a) {
        spawnTimer = setTimeout(tick, 40);
        return;
      }

      const type = ATTACK_KEYS[Math.floor(Math.random() * ATTACK_KEYS.length)];
      const id = cometIdRef.current++;
      const dist = Math.hypot(
        b.centroid[0] - a.centroid[0],
        b.centroid[1] - a.centroid[1],
      );
      const duration = Math.max(700, Math.min(1600, dist * 3.2));
      const archHeight = Math.min(dist * 0.5, 130);

      const comet: Comet = {
        id,
        from: a.centroid,
        to: b.centroid,
        type,
        duration,
        archHeight,
      };

      setComets((prev) => [...prev, comet]);
      onAttackRef.current?.(type);

      const removeTimer = setTimeout(() => {
        setComets((prev) => prev.filter((c) => c.id !== id));
        removeTimers.delete(removeTimer);
      }, duration + 400);
      removeTimers.add(removeTimer);

      // Rapid-fire spawn — burst-y, not metronomic
      const next = 55 + Math.random() * 110;
      spawnTimer = setTimeout(tick, next);
    };

    tick();
    return () => {
      active = false;
      clearTimeout(spawnTimer);
      removeTimers.forEach(clearTimeout);
    };
  }, [countries]);

  // Country lookup
  const countriesById = useMemo(() => {
    const map: Record<string, Country> = {};
    countries?.forEach((c) => (map[c.id] = c));
    return map;
  }, [countries]);

  // Hover handlers (event delegation on country group)
  const handleEnter = useCallback(
    (e: React.MouseEvent<SVGGElement>) => {
      const target = e.target as SVGElement;
      const id = target.getAttribute("data-id");
      if (!id || !countriesById[id]) return;
      if (hoveredIdRef.current === id) return;
      hoveredIdRef.current = id;
      setHoveredId(id);
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      const rect = wrapper.getBoundingClientRect();
      setTooltip({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        name: countriesById[id].name,
      });
    },
    [countriesById],
  );

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (!hoveredIdRef.current) return;
    if (moveRafRef.current !== null) return;
    const cx = e.clientX;
    const cy = e.clientY;
    moveRafRef.current = requestAnimationFrame(() => {
      moveRafRef.current = null;
      const wrapper = wrapperRef.current;
      if (!wrapper || !hoveredIdRef.current) return;
      const c = countriesById[hoveredIdRef.current];
      if (!c) return;
      const rect = wrapper.getBoundingClientRect();
      setTooltip({
        x: cx - rect.left,
        y: cy - rect.top,
        name: c.name,
      });
    });
  }, [countriesById]);

  const handleLeave = useCallback(() => {
    hoveredIdRef.current = null;
    setHoveredId(null);
    setTooltip(null);
  }, []);

  // Memoized country layer — only re-renders when countries change
  const countryLayer = useMemo(() => {
    if (!countries) return null;
    return (
      <g
        onMouseOver={handleEnter}
        onMouseOut={(e) => {
          // only clear if leaving to a non-country target
          const related = e.relatedTarget as SVGElement | null;
          if (!related || !related.getAttribute?.("data-id")) {
            // handled by container leave
          }
        }}
      >
        {countries.map((c) => (
          <path
            key={c.id}
            d={c.d}
            data-id={c.id}
            fill="#1a1530"
            stroke="#22e7d6"
            strokeOpacity={0.5}
            strokeWidth={0.32}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>
    );
  }, [countries, handleEnter]);

  const meridians = useMemo(
    () => Array.from({ length: 23 }, (_, i) => ((i + 1) * W) / 24),
    [],
  );
  const parallels = useMemo(
    () => Array.from({ length: 11 }, (_, i) => ((i + 1) * H) / 12),
    [],
  );

  const hovered = hoveredId ? countriesById[hoveredId] : null;

  return (
    <div
      ref={wrapperRef}
      className="relative w-full h-full min-h-[500px] overflow-hidden bg-[#040816]"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full select-none"
      >
        <defs>
          {ATTACK_KEYS.map((k) => {
            const color = ATTACK_COLORS[k];
            return (
              <linearGradient
                key={k}
                id={`bsc-grad-${k}`}
                x1="0"
                x2="1"
                y1="0"
                y2="0"
              >
                <stop offset="0%" stopColor={color} stopOpacity="0" />
                <stop offset="55%" stopColor={color} stopOpacity="0.35" />
                <stop offset="100%" stopColor={color} stopOpacity="1" />
              </linearGradient>
            );
          })}
          <radialGradient id="bsc-vignette" cx="50%" cy="50%" r="78%">
            <stop offset="0%" stopColor="#040816" stopOpacity="0" />
            <stop offset="80%" stopColor="#000104" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.85" />
          </radialGradient>
          <filter id="bsc-hover-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid */}
        <g stroke="#1faabf" strokeWidth={0.22} opacity={0.16}>
          {meridians.map((x, i) => (
            <line key={`m${i}`} x1={x} y1={0} x2={x} y2={H} />
          ))}
          {parallels.map((y, i) => (
            <line key={`p${i}`} x1={0} y1={y} x2={W} y2={y} />
          ))}
        </g>
        <g stroke="#1faabf" strokeWidth={0.55} opacity={0.3}>
          <line x1={0} y1={H / 2} x2={W} y2={H / 2} />
          <line x1={W / 2} y1={0} x2={W / 2} y2={H} />
        </g>

        {countryLayer}

        {/* Hover overlay */}
        {hovered && (
          <path
            d={hovered.d}
            fill="rgba(34,231,214,0.18)"
            stroke="#7ef4ff"
            strokeWidth={1.1}
            strokeOpacity={0.95}
            vectorEffect="non-scaling-stroke"
            pointerEvents="none"
            filter="url(#bsc-hover-glow)"
          />
        )}

        {/* Comet particles */}
        <g pointerEvents="none">
          {comets.map((c) => (
            <CometParticle key={c.id} comet={c} />
          ))}
        </g>

        {/* Vignette */}
        <rect
          width={W}
          height={H}
          fill="url(#bsc-vignette)"
          pointerEvents="none"
        />
      </svg>

      {/* Loading shimmer */}
      {!countries && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/30">
            Loading global telemetry…
          </span>
        </div>
      )}

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute pointer-events-none px-2.5 py-1 rounded border border-cyan-400/40 bg-black/85 text-[10px] font-mono uppercase tracking-[0.2em] text-cyan-200 shadow-[0_0_18px_-4px_rgba(34,231,214,0.6)] z-20 whitespace-nowrap"
          style={{
            left: tooltip.x + 14,
            top: tooltip.y - 26,
            transform: "translateZ(0)",
          }}
        >
          {tooltip.name}
        </div>
      )}

      {/* Live indicator */}
      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-black/60 border border-white/5 rounded pointer-events-none">
        <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
        <span className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-white/55">
          Tactical Telemetry · Live
        </span>
      </div>

      <div className="absolute bottom-4 right-4 flex flex-col items-end gap-0.5 pointer-events-none">
        <span className="font-mono text-[8px] text-white/30 tracking-[0.18em]">
          PROJ · EQUIRECTANGULAR
        </span>
        <span className="font-mono text-[8px] text-white/20 tracking-[0.18em]">
          SECTOR · GLOBAL
        </span>
      </div>

      <style jsx>{`
        :global(.bsc-comet) {
          animation-name: bsc-comet-fly;
          animation-iteration-count: 1;
          animation-fill-mode: forwards;
          animation-timing-function: cubic-bezier(0.42, 0, 0.62, 1);
          will-change: offset-distance, opacity;
        }
        @keyframes bsc-comet-fly {
          0% {
            offset-distance: 0%;
            opacity: 1;
          }
          92% {
            opacity: 1;
          }
          100% {
            offset-distance: 100%;
            opacity: 0;
          }
        }
        :global(.bsc-impact) {
          opacity: 0;
          animation-name: bsc-impact;
          animation-duration: 520ms;
          animation-iteration-count: 1;
          animation-fill-mode: forwards;
          animation-timing-function: ease-out;
          will-change: r, opacity;
        }
        @keyframes bsc-impact {
          0% {
            r: 1;
            opacity: 0.95;
          }
          100% {
            r: 7;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
