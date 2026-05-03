"use client";

import React, { useState, useRef, ReactNode } from "react";
import { motion } from "framer-motion";

export default function ToolLayout({ children }: { children: ReactNode }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen pt-32 pb-24 overflow-hidden"
    >
      {/* Dynamic Background Ripple */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg width="100%" height="100%" className="opacity-[0.05]">
          <defs>
            <pattern id="toolGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
            <radialGradient id="toolRipple" cx={`${mousePos.x}%`} cy={`${mousePos.y}%`} r="30%">
              <stop offset="0%" stopColor="white" stopOpacity="0.4" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#toolGrid)" />
          <rect width="100%" height="100%" fill="url(#toolRipple)" />
        </svg>
      </div>

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
