"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ClearanceLevel = "Tier-III" | "Tier-II" | "Tier-I" | "Tier-0";

interface OperatorContextType {
  xp: number;
  completedLabs: string[];
  clearance: ClearanceLevel;
  addXp: (amount: number) => void;
  completeLab: (labId: string) => void;
}

const OperatorContext = createContext<OperatorContextType | undefined>(undefined);

function getClearance(xp: number): ClearanceLevel {
  if (xp >= 3000) return "Tier-0";
  if (xp >= 1500) return "Tier-I";
  if (xp >= 500) return "Tier-II";
  return "Tier-III";
}

export function OperatorProvider({ children }: { children: React.ReactNode }) {
  const [xp, setXp] = useState<number>(0);
  const [completedLabs, setCompletedLabs] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Hydrate from localStorage
    try {
      const storedXp = localStorage.getItem("bsc_operator_xp");
      const storedLabs = localStorage.getItem("bsc_operator_labs");
      
      if (storedXp) setXp(parseInt(storedXp, 10));
      if (storedLabs) setCompletedLabs(JSON.parse(storedLabs));
    } catch (e) {
      console.error("Failed to load operator state:", e);
    }
    setIsHydrated(true);
  }, []);

  const addXp = (amount: number) => {
    setXp((prev) => {
      const newXp = prev + amount;
      localStorage.setItem("bsc_operator_xp", newXp.toString());
      return newXp;
    });
  };

  const completeLab = (labId: string) => {
    setCompletedLabs((prev) => {
      if (prev.includes(labId)) return prev;
      const newLabs = [...prev, labId];
      localStorage.setItem("bsc_operator_labs", JSON.stringify(newLabs));
      return newLabs;
    });
  };

  const clearance = getClearance(xp);

  useEffect(() => {
    if (isHydrated) {
      document.documentElement.setAttribute("data-clearance", clearance.toLowerCase());
    }
  }, [clearance, isHydrated]);

  return (
    <OperatorContext.Provider value={{ xp, completedLabs, clearance, addXp, completeLab }}>
      {children}
    </OperatorContext.Provider>
  );
}

export function useOperator() {
  const context = useContext(OperatorContext);
  if (context === undefined) {
    throw new Error("useOperator must be used within an OperatorProvider");
  }
  return context;
}
