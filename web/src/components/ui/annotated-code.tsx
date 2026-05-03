"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "@phosphor-icons/react";

interface AnnotatedCodeProps {
  code: string;
  language?: string;
  annotations?: Record<number, string>;
}

export default function AnnotatedCode({ 
  code, 
  language = "javascript", 
  annotations = {} 
}: AnnotatedCodeProps) {
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  const lines = code.trim().split("\n");

  return (
    <div className="relative w-full bg-black/40 border border-white/5 rounded-xl overflow-hidden font-mono text-[13px]">
      {/* Header / Meta */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
        </div>
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/20">
          {language} // secure_buffer.v2
        </span>
      </div>

      <div className="flex relative">
        {/* Gutter / Line Numbers */}
        <div className="flex flex-col items-end py-4 px-3 bg-black/20 border-r border-white/5 select-none text-white/20 min-w-[3rem]">
          {lines.map((_, i) => {
            const lineNum = i + 1;
            const hasAnnotation = !!annotations[lineNum];
            
            return (
              <div 
                key={i} 
                className="h-6 flex items-center gap-2 group relative"
              >
                {hasAnnotation && (
                  <motion.div
                    onMouseEnter={() => setHoveredLine(lineNum)}
                    onMouseLeave={() => setHoveredLine(null)}
                    initial={{ opacity: 0.3 }}
                    animate={{ 
                      opacity: hoveredLine === lineNum ? 1 : 0.3,
                      scale: hoveredLine === lineNum ? 1.2 : 1
                    }}
                    className="cursor-help text-white/40 hover:text-white transition-colors"
                  >
                    <Info size={12} />
                  </motion.div>
                )}
                <span className={`transition-colors ${hoveredLine === lineNum ? "text-white/60" : ""}`}>
                  {lineNum}
                </span>
              </div>
            );
          })}
        </div>

        {/* Code Area */}
        <div className="flex-1 py-4 px-6 overflow-x-auto relative">
          {lines.map((line, i) => {
            const lineNum = i + 1;
            const isHighlighted = hoveredLine === lineNum;
            
            return (
              <div 
                key={i} 
                className={`h-6 flex items-center transition-colors relative ${isHighlighted ? "bg-white/[0.03] -mx-6 px-6" : ""}`}
              >
                <span className={`whitespace-pre ${isHighlighted ? "text-white" : "text-white/70"}`}>
                  {line}
                </span>

                {/* Inline Tooltip */}
                <AnimatePresence>
                  {isHighlighted && annotations[lineNum] && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="absolute left-full ml-8 z-50 w-72 p-4 bg-white/5 border border-white/10 backdrop-blur-md rounded-lg shadow-2xl pointer-events-none"
                    >
                      <div className="font-mono text-[9px] uppercase tracking-[0.3em] text-white/30 mb-2">
                        Vulnerability Breakdown
                      </div>
                      <p className="text-[11px] text-white/80 leading-relaxed">
                        {annotations[lineNum]}
                      </p>
                      <div className="absolute top-1/2 -left-2 w-4 h-4 bg-white/5 border-l border-b border-white/10 rotate-45 -translate-y-1/2" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
