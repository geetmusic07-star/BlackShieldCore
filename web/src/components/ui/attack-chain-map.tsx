"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ChainStep {
  id: string;
  label: string;
  description: string;
}

const DEFAULT_STEPS: ChainStep[] = [
  { id: "entry", label: "Entry Point", description: "Initial vector identified via edge node vulnerability. Authentication bypass suspected." },
  { id: "pivot", label: "Logic Flaw", description: "Internal routing logic manipulated to elevate privileges and bypass segment isolation." },
  { id: "exfil", label: "Data Leak", description: "Unauthorized data egress detected via encrypted tunnel. Integrity breach confirmed." },
];

export default function AttackChainMap({ steps = DEFAULT_STEPS }: { steps?: ChainStep[] }) {
  const [hoveredNode, setHoveredNode] = useState<ChainStep | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVertical, setIsVertical] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      if (window.innerWidth < 768) {
        setIsVertical(true);
      } else {
        setIsVertical(false);
      }
    };

    checkOrientation();
    window.addEventListener("resize", checkOrientation);
    return () => window.removeEventListener("resize", checkOrientation);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full p-8 bg-black/20 border border-white/5 rounded-2xl overflow-hidden"
    >
      <div className={`flex ${isVertical ? "flex-col items-center gap-16" : "flex-row justify-between items-center"} relative z-10`}>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <motion.div
              onMouseEnter={() => setHoveredNode(step)}
              onMouseLeave={() => setHoveredNode(null)}
              className="relative group"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
                className="w-16 h-16 rounded-full border-2 border-white/10 flex items-center justify-center bg-black/40 group-hover:border-white/40 transition-colors cursor-crosshair relative z-20"
              >
                <div className="w-2 h-2 rounded-full bg-white/60 group-hover:bg-white group-hover:scale-150 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 + 0.1 }}
                className={`absolute ${isVertical ? "left-20 top-1/2 -translate-y-1/2" : "top-20 left-1/2 -translate-x-1/2"} whitespace-nowrap text-center`}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 group-hover:text-white/80 transition-colors">
                  {step.label}
                </span>
              </motion.div>
            </motion.div>

            {/* Connecting Line (SVG) */}
            {index < steps.length - 1 && (
              <div className={`absolute pointer-events-none ${isVertical ? "w-[2px] h-16" : "h-[2px] flex-1"} bg-transparent`}>
                <svg 
                  className="absolute inset-0 overflow-visible"
                  width="100%" 
                  height="100%"
                >
                  <motion.line
                    x1={isVertical ? "50%" : "0%"}
                    y1={isVertical ? "0%" : "50%"}
                    x2={isVertical ? "50%" : "100%"}
                    y2={isVertical ? "100%" : "50%"}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: index * 0.2 + 0.1, duration: 0.8 }}
                  />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Floating Analyst Interpretation */}
      <AnimatePresence>
        {hoveredNode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{ 
              left: mousePos.x + 20, 
              top: mousePos.y + 20,
              pointerEvents: "none"
            }}
            className="absolute z-50 w-64 p-4 bg-white/5 border border-white/10 backdrop-blur-md rounded-lg shadow-2xl"
          >
            <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30 mb-2 border-b border-white/5 pb-1">
              Analyst Interpretation // {hoveredNode.id}
            </div>
            <p className="text-[12px] text-white/80 leading-relaxed font-light">
              {hoveredNode.description}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-white/40 animate-pulse" />
              <span className="font-mono text-[8px] text-white/20 uppercase">Confidence Level: High</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Grid (Subtle) */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="chainGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#chainGrid)" />
        </svg>
      </div>
    </div>
  );
}
