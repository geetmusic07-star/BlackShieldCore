"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ArrowLeft, Hash, ShieldAlert, ShieldCheck, Shield } from "lucide-react";

interface HashResult {
  name: string;
  secure: boolean;
  notes: string;
}

function analyzeHash(hash: string): HashResult[] {
  const h = hash.trim();
  if (!h) return [];

  const results: HashResult[] = [];

  // bcrypt
  if (/^\$2[abyx]\$[0-9]{2}\$[./A-Za-z0-9]{53}$/.test(h)) {
    results.push({
      name: "bcrypt",
      secure: true,
      notes: "Standard password hashing algorithm. Secure against brute-force due to tunable work factor.",
    });
  }

  // argon2
  if (/^\$argon2(i|d|id)\$v=\d+\$m=\d+,t=\d+,p=\d+\$[a-zA-Z0-9+/]+\$[a-zA-Z0-9+/]+/.test(h)) {
    results.push({
      name: "Argon2",
      secure: true,
      notes: "Winner of the Password Hashing Competition. Highly secure and memory-hard.",
    });
  }

  // 32 hex chars
  if (/^[a-fA-F0-9]{32}$/.test(h)) {
    results.push({
      name: "MD5",
      secure: false,
      notes: "Cryptographically broken. Vulnerable to fast collision attacks and extremely fast dictionary cracking.",
    });
    results.push({
      name: "NTLM",
      secure: false,
      notes: "Used in Windows environments. Not salted, making it highly vulnerable to pass-the-hash and cracking via rainbow tables.",
    });
    results.push({
      name: "MD4",
      secure: false,
      notes: "Completely broken. Extremely fast to crack.",
    });
  }

  // 40 hex chars
  if (/^[a-fA-F0-9]{40}$/.test(h)) {
    results.push({
      name: "SHA-1",
      secure: false,
      notes: "Deprecated. Vulnerable to chosen-prefix collisions (SHAttered attack). Should not be used for signatures or passwords.",
    });
  }

  // 64 hex chars
  if (/^[a-fA-F0-9]{64}$/.test(h)) {
    results.push({
      name: "SHA-256",
      secure: true,
      notes: "Secure cryptographic hash function. However, if used directly for passwords without a salt/key stretching (like PBKDF2), it is vulnerable to fast cracking.",
    });
  }

  // 128 hex chars
  if (/^[a-fA-F0-9]{128}$/.test(h)) {
    results.push({
      name: "SHA-512",
      secure: true,
      notes: "Secure cryptographic hash function. Strong collision resistance.",
    });
  }

  // MySQL 5.x
  if (/^\*[a-fA-F0-9]{40}$/.test(h)) {
    results.push({
      name: "MySQL 5.x",
      secure: false,
      notes: "Double SHA-1 hash. Vulnerable to fast offline cracking.",
    });
  }

  return results;
}

export default function HashAnalyzerPage() {
  const [input, setInput] = useState("");
  const results = analyzeHash(input);

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
          Hash Analyzer
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--bsc-text-2)]">
          Paste a cryptographic hash below to identify its likely algorithm, security properties, and usage context.
        </p>

        <div className="mt-8 rounded-xl border border-white/[0.08] bg-black/40">
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
            <Hash size={13} /> Input Hash
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            placeholder="e.g. 5d41402abc4b2a76b9719d911017c592"
            className="h-32 w-full resize-none bg-transparent p-5 font-mono text-[14px] leading-relaxed text-[color:var(--bsc-text-1)] outline-none"
          />
        </div>

        {input.trim() && (
          <div className="mt-8 space-y-4">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
              Analysis Results
            </h2>
            
            {results.length > 0 ? (
              <div className="grid gap-4">
                {results.map((r, i) => (
                  <div
                    key={i}
                    className="flex gap-4 rounded-xl border border-white/[0.08] bg-[color-mix(in_oklch,var(--bsc-surface)_60%,transparent)] p-5"
                  >
                    <div className="mt-0.5 shrink-0">
                      {r.secure ? (
                        <ShieldCheck className="text-[oklch(0.85_0.14_140)]" size={20} />
                      ) : (
                        <ShieldAlert className="text-[color:var(--bsc-amber)]" size={20} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-[color:var(--bsc-text-1)]">
                          {r.name}
                        </h3>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${
                            r.secure
                              ? "bg-[oklch(0.85_0.14_140)]/10 text-[oklch(0.85_0.14_140)]"
                              : "bg-[color:var(--bsc-amber)]/10 text-[color:var(--bsc-amber)]"
                          }`}
                        >
                          {r.secure ? "Secure" : "Insecure"}
                        </span>
                      </div>
                      <p className="mt-2 text-[14px] leading-relaxed text-[color:var(--bsc-text-2)]">
                        {r.notes}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-8 text-center">
                <Shield size={24} className="mx-auto mb-3 text-[color:var(--bsc-text-3)] opacity-50" />
                <div className="text-[14px] text-[color:var(--bsc-text-2)]">
                  Unknown hash format.
                </div>
                <div className="mt-1 text-[13px] text-[color:var(--bsc-text-3)]">
                  The length and character set do not match common signatures.
                </div>
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
