"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;       // 0–1 normalised
  y: number;
  radius: number;  // world units
  opacity: number;
  r: number; g: number; b: number;
}

export function SectionStars({ count = 130 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Generate once — static starfield, no animation loop needed
    const stars: Star[] = Array.from({ length: count }, () => {
      // Power-law brightness so most stars are dim, few are bright
      const brightness = Math.pow(Math.random(), 2.4) * 0.7 + 0.06;
      const type = Math.random();
      let r, g, b;
      if      (type < 0.55) { r = 175; g = 208; b = 255; } // blue-white (hot)
      else if (type < 0.80) { r = 255; g = 255; b = 255; } // pure white
      else if (type < 0.93) { r = 255; g = 238; b = 185; } // warm yellow-white
      else                  { r = 150; g = 175; b = 255; } // pale violet-blue
      return {
        x: Math.random(),
        y: Math.random(),
        radius: 0.4 + Math.random() * 1.5,
        opacity: brightness,
        r, g, b,
      };
    });

    const draw = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width  = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const s of stars) {
        const x  = s.x * canvas.width;
        const y  = s.y * canvas.height;
        const gR = s.radius * 5;

        const grd = ctx.createRadialGradient(x, y, 0, x, y, gR);
        grd.addColorStop(0,    `rgba(${s.r},${s.g},${s.b},${s.opacity.toFixed(3)})`);
        grd.addColorStop(0.35, `rgba(${s.r},${s.g},${s.b},${(s.opacity * 0.22).toFixed(3)})`);
        grd.addColorStop(1,    `rgba(${s.r},${s.g},${s.b},0)`);

        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(x, y, gR, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    draw();
    const ro = new ResizeObserver(draw);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    return () => ro.disconnect();
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
