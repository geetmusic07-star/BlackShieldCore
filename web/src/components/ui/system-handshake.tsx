"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HandshakeContextType {
  startHandshake: (callback: () => void) => void;
  isProcessing: boolean;
}

const HandshakeContext = createContext<HandshakeContextType | undefined>(undefined);

export function HandshakeProvider({ children }: { children: ReactNode }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const startHandshake = useCallback((callback: () => void) => {
    setIsProcessing(true);
    
    // Simulated latency between 150ms and 300ms
    const delay = Math.floor(Math.random() * (300 - 150 + 1)) + 150;
    
    setTimeout(() => {
      setIsProcessing(false);
      callback();
    }, delay);
  }, []);

  return (
    <HandshakeContext.Provider value={{ startHandshake, isProcessing }}>
      {children}
      <SystemHandshake isVisible={isProcessing} />
    </HandshakeContext.Provider>
  );
}

export function useHandshake() {
  const context = useContext(HandshakeContext);
  if (!context) {
    throw new Error("useHandshake must be used within a HandshakeProvider");
  }
  return context;
}

function SystemHandshake({ isVisible }: { isVisible: boolean }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-auto"
        >
          <div className="flex flex-col items-center gap-4 max-w-xs w-full px-6">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/70"
            >
              Handshake in progress...
            </motion.div>
            
            <div className="relative w-full h-[2px] bg-white/10 overflow-hidden rounded-full">
              <motion.div
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{ 
                  duration: 0.3, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className="absolute top-0 bottom-0 w-1/2 bg-white/60 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              />
            </div>
            
            <div className="flex justify-between w-full font-mono text-[8px] text-white/30 uppercase tracking-widest">
              <span>Auth_Core_v4</span>
              <span>Sync_OK</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
