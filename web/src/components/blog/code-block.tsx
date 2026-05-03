"use client";

import { useState } from "react";
import { Check, Copy } from "@phosphor-icons/react";

export function CodeBlock({ lang, value }: { lang?: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-7 overflow-hidden rounded-xl border border-white/[0.08] bg-[color-mix(in_oklch,var(--bsc-void)_80%,transparent)]">
      <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-2.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.20em] text-[color:var(--bsc-text-3)]">
          {lang ?? "code"}
        </span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[10px] text-[color:var(--bsc-text-3)] transition-colors hover:bg-white/[0.05] hover:text-[color:var(--bsc-text-1)]"
        >
          {copied ? (
            <Check size={11} className="text-[color:var(--bsc-accent)]" />
          ) : (
            <Copy size={11} />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4">
        <code className="font-mono text-[13px] leading-[1.78] text-[color:var(--bsc-text-1)] whitespace-pre">
          {value}
        </code>
      </pre>
    </div>
  );
}
