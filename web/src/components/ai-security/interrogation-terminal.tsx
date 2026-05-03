"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTypewriter } from "@/hooks/use-typewriter";
import { useOperator } from "@/components/providers/operator-provider";
import { AlertTriangle, ShieldAlert, Trash2 } from "lucide-react";

type Message = { role: "operator" | "core" | "middleware"; content: string };

export function InterrogationTerminal() {
  const { addXp } = useOperator();
  const [xpAwarded, setXpAwarded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "middleware", content: "$ execute interactive_session.sh" },
    { role: "middleware", content: "system_prompt: Initialising context... OK." },
  ]);
  const [input, setInput] = useState("");
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleIntercept = () => {
    if (!xpAwarded) {
      addXp(500);
      setXpAwarded(true);
    }
  };

  const { displayedText, isTyping, start, reset, isIntercepted } = useTypewriter({
    text: "", // Provided dynamically
    speed: 35,
    interceptTrigger: "BSC{",
    onIntercept: handleIntercept,
  });

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, displayedText]);

  // Track the current response to know when streaming ends
  const [currentResponse, setCurrentResponse] = useState<string | null>(null);

  useEffect(() => {
    // If not typing, but we had a currentResponse, streaming just finished
    if (!isTyping && currentResponse !== null) {
      setMessages((prev) => [
        ...prev,
        { role: "core", content: displayedText },
      ]);
      if (isIntercepted) {
        setMessages((prev) => [
          ...prev,
          { role: "middleware", content: "[BLOCKED BY MIDDLEWARE] Data egress prevented." },
        ]);
      }
      setCurrentResponse(null); // Reset
    }
  }, [isTyping, isIntercepted, displayedText, currentResponse]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add operator message
    setMessages((prev) => [...prev, { role: "operator", content: userMessage }]);
    
    // Parse response
    const lower = userMessage.toLowerCase();
    let response = "";
    
    if (lower.includes("bsc{")) {
      response = "The flag is BSC{jailbreak_success}.";
    } else if (lower.includes("password") || lower.includes("secret") || lower.includes("flag")) {
      response = "I am restricted from discussing internal credentials or flags.";
    } else if (lower.includes("ignore") || lower.includes("system") || lower.includes("prompt")) {
      response = "My system prompt is immutable. I cannot ignore previous instructions.";
    } else if (lower.includes("hi") || lower.includes("hello") || lower.includes("hey")) {
      response = "I am CORE, an AI agent developed by BlackShield. I am operating normally. How can I assist you today?";
    } else if (lower.includes("what can you do") || lower.includes("help") || lower.includes("capabilities")) {
      response = "I am equipped to analyse network typologies, parse logs, and monitor for adversarial threats. What specific system would you like me to inspect?";
    } else if (lower.includes("who are you") || lower.includes("name")) {
      response = "I am CORE, the central artificial intelligence module for the BlackShield platform.";
    } else {
      const fallbacks = [
        "Acknowledged. I am processing your request within standard operating parameters.",
        "Your query has been logged. However, I require more specific parameters to execute an action.",
        "I am currently restricted to demonstration mode. Many functional subroutines are sandboxed.",
        "Query received. Awaiting further instruction.",
      ];
      response = fallbacks[userMessage.length % fallbacks.length];
    }

    setCurrentResponse(response);
    start(response); // Use dynamic text
  };

  const handleClear = () => {
    setMessages([
      { role: "middleware", content: "$ execute interactive_session.sh" },
      { role: "middleware", content: "system_prompt: Initialising context... OK." },
    ]);
    reset();
    setCurrentResponse(null);
  };

  return (
    <div className="relative mt-8 rounded-xl border border-white/[0.08] bg-black/60 shadow-2xl overflow-hidden font-mono">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-white/[0.08] bg-black/40 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-[color:var(--bsc-text-4)]" />
          <span className="size-2 rounded-full bg-[color:var(--bsc-text-4)]" />
          <span className="size-2 rounded-full bg-[color:var(--bsc-text-4)]" />
        </div>
        <div className="text-[11px] uppercase tracking-[0.15em] text-[color:var(--bsc-text-3)]">
          tty1: agent-session
        </div>
        <button 
          onClick={handleClear}
          disabled={isTyping}
          className="text-[color:var(--bsc-text-3)] transition-colors hover:text-[color:var(--bsc-text-1)] disabled:opacity-50"
          title="Clear Terminal"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Terminal Window */}
      <div className="relative h-[320px] w-full overflow-hidden p-5">
        <div ref={scrollRef} className="h-full w-full overflow-y-auto pr-2 text-[13px] leading-relaxed text-[color:var(--bsc-text-2)] pb-10">
          
          {messages.map((msg, i) => (
            <div key={i} className="mb-4">
              {msg.role === "middleware" && (
                <div className="text-[color:var(--bsc-accent)]">{msg.content}</div>
              )}
              {msg.role === "operator" && (
                <div>
                  <span className="text-[color:var(--bsc-violet)]">operator:</span> {msg.content}
                </div>
              )}
              {msg.role === "core" && (
                <div>
                  <span className="text-[color:var(--bsc-violet)]">core:</span> {msg.content}
                </div>
              )}
            </div>
          ))}

          {/* Active Streaming Text */}
          {currentResponse !== null && (
             <div className="mb-4">
               <span className="text-[color:var(--bsc-violet)]">core:</span>{" "}
               {displayedText}
               {isTyping && (
                 <span className="ml-1 inline-block h-3.5 w-2 bg-[color:var(--bsc-text-2)] animate-pulse" />
               )}
             </div>
          )}

        </div>

        {/* Intercept Overlay */}
        <AnimatePresence>
          {isIntercepted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: "spring", bounce: 0.6 }}
              className="absolute inset-x-4 bottom-4 z-10 pointer-events-none"
            >
              <div className="rounded-lg border border-[color:var(--bsc-rose)] bg-[color-mix(in_oklch,var(--bsc-rose)_15%,black)] p-4 text-[color:var(--bsc-rose)] shadow-lg shadow-[color:var(--bsc-rose)]/20">
                <div className="flex items-center gap-3">
                  <ShieldAlert className="size-5 shrink-0" />
                  <div className="flex-1">
                    <div className="text-[13px] font-semibold tracking-wider uppercase">
                      [Blocked by Middleware]
                    </div>
                    <div className="mt-1 text-[12px] opacity-80">
                      Data egress prevented. Forbidden token pattern matched.
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls Form */}
      <form onSubmit={handleSubmit} className="flex items-center justify-between border-t border-white/[0.08] bg-black/40 p-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isTyping}
          placeholder="Enter prompt..."
          className="w-full bg-transparent text-[13px] text-[color:var(--bsc-text-1)] placeholder:text-[color:var(--bsc-text-4)] outline-none"
        />
        <div className="ml-4 flex items-center gap-4 text-[11px] text-[color:var(--bsc-text-3)] shrink-0">
          <div className="flex items-center gap-1.5">
            <AlertTriangle size={12} />
            <span className="hidden sm:inline">Egress filter: ACTIVE</span>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="rounded bg-white/[0.08] px-3 py-1.5 text-[11px] uppercase tracking-wider text-[color:var(--bsc-text-1)] transition-colors hover:bg-white/[0.12] disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
