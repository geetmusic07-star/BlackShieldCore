"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ArrowLeft, Key, ShieldAlert, ShieldCheck, Zap } from "lucide-react";

// 100 Billion hashes per second (~100 GH/s) -> Modern 8x GPU rig against fast hashes like MD5/NTLM
const HASH_RATE_PER_SECOND = 100_000_000_000;

function calculateEntropy(password: string) {
  const len = password.length;
  if (len === 0) return { entropy: 0, poolSize: 0, crackTimeSeconds: 0 };

  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;

  const entropy = len * Math.log2(poolSize);
  
  // Total possible combinations = poolSize^length
  // Crack time = combinations / hash_rate / 2 (on average)
  const combinations = Math.pow(poolSize, len);
  const crackTimeSeconds = combinations / HASH_RATE_PER_SECOND / 2;

  return { entropy, poolSize, crackTimeSeconds };
}

function formatTime(seconds: number) {
  if (seconds < 1) return "Instant (< 1s)";
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  
  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.round(minutes)} minutes`;
  
  const hours = minutes / 60;
  if (hours < 24) return `${Math.round(hours)} hours`;
  
  const days = hours / 24;
  if (days < 365) return `${Math.round(days)} days`;
  
  const years = days / 365;
  if (years < 1000) return `${Math.round(years)} years`;
  if (years < 1_000_000) return `${Math.round(years / 1000)} thousand years`;
  if (years < 1_000_000_000) return `${Math.round(years / 1_000_000)} million years`;
  
  return "Billions of years (Effectively uncrackable)";
}

export default function PasswordEntropyPage() {
  const [password, setPassword] = useState("");
  const { entropy, poolSize, crackTimeSeconds } = calculateEntropy(password);

  const isSecure = entropy >= 80;

  return (
    <div className="pt-32 pb-24">
      <Container className="max-w-[800px]">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 font-mono text-[12px] text-[color:var(--bsc-text-3)] hover:text-[color:var(--bsc-text-1)]"
        >
          <ArrowLeft size={13} />
          All Tools
        </Link>

        <h1 className="mt-6 text-[28px] font-semibold tracking-[-0.018em] text-[color:var(--bsc-text-1)]">
          Password Entropy
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--bsc-text-2)]">
          Calculate mathematical entropy and estimate offline cracking time against a hypothetical 100 GH/s GPU rig targeting fast hashes (e.g., NTLM, MD5).
        </p>

        <div className="mt-8 rounded-xl border border-white/[0.08] bg-black/40 p-5">
          <div className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
            <Key size={13} /> Password Input
          </div>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            spellCheck={false}
            placeholder="Type a password to analyze..."
            className="w-full rounded-md border border-white/[0.08] bg-black/50 px-4 py-3 font-mono text-[14px] text-[color:var(--bsc-text-1)] outline-none focus:border-[oklch(0.78_0.18_140)]/50"
          />
        </div>

        {password && (
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-white/[0.08] bg-[color-mix(in_oklch,var(--bsc-surface)_60%,transparent)] p-5">
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
                Entropy Bits
              </div>
              <div className="mt-2 text-[24px] font-semibold text-[color:var(--bsc-text-1)]">
                {entropy.toFixed(1)}
              </div>
              <p className="mt-1 text-[12px] text-[color:var(--bsc-text-2)]">
                {entropy < 60 ? "Weak (< 60)" : entropy < 80 ? "Moderate (60 - 80)" : "Strong (> 80)"}
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-[color-mix(in_oklch,var(--bsc-surface)_60%,transparent)] p-5">
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
                Character Pool
              </div>
              <div className="mt-2 text-[24px] font-semibold text-[color:var(--bsc-text-1)]">
                {poolSize}
              </div>
              <p className="mt-1 text-[12px] text-[color:var(--bsc-text-2)]">
                possible characters
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-[color-mix(in_oklch,var(--bsc-surface)_60%,transparent)] p-5">
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
                Length
              </div>
              <div className="mt-2 text-[24px] font-semibold text-[color:var(--bsc-text-1)]">
                {password.length}
              </div>
              <p className="mt-1 text-[12px] text-[color:var(--bsc-text-2)]">
                characters
              </p>
            </div>
          </div>
        )}

        {password && (
          <div className={`mt-4 flex gap-4 rounded-xl border p-5 ${
            isSecure 
              ? "border-[oklch(0.85_0.14_140)]/30 bg-[oklch(0.85_0.14_140)]/[0.06]" 
              : "border-[color:var(--bsc-amber)]/30 bg-[color:var(--bsc-amber)]/[0.06]"
          }`}>
            <div className="mt-0.5 shrink-0">
              {isSecure ? (
                <ShieldCheck className="text-[oklch(0.85_0.14_140)]" size={20} />
              ) : (
                <ShieldAlert className="text-[color:var(--bsc-amber)]" size={20} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-[color:var(--bsc-text-1)]">
                  Estimated Crack Time: <span className="font-mono">{formatTime(crackTimeSeconds)}</span>
                </h3>
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--bsc-text-2)]">
                {isSecure 
                  ? "This password has sufficient mathematical entropy to withstand offline brute-force attacks against fast hashing algorithms."
                  : "This password does not have enough entropy. An attacker with a modern GPU rig cracking fast hashes (like NTLM) could recover it."}
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-[12px] text-[color:var(--bsc-text-3)]">
                <Zap size={12} /> Assumes brute-force rate of 100 GH/s (100 billion/sec)
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
