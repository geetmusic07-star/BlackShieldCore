"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const SAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjk5OTk5OTk5OTl9.kK2Rg2TTJlUkSVQiVJ8m7PR3UO0G6GcUAOIo3tKJ5oU";

interface DecodedPart {
  raw: string;
  json?: Record<string, unknown>;
  error?: string;
}

interface Decoded {
  header: DecodedPart;
  payload: DecodedPart;
  signature: string;
  warnings: { level: "warn" | "alert" | "info"; message: string }[];
}

function base64UrlDecode(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  try {
    return atob(padded + padding);
  } catch {
    throw new Error("Not a valid base64url segment");
  }
}

function parseSegment(segment: string): DecodedPart {
  if (!segment) return { raw: "", error: "Missing segment" };
  let decoded = "";
  try {
    decoded = base64UrlDecode(segment);
  } catch (e) {
    return { raw: segment, error: (e as Error).message };
  }
  try {
    const json = JSON.parse(decoded);
    return { raw: decoded, json };
  } catch {
    return { raw: decoded, error: "Segment did not contain valid JSON" };
  }
}

function decode(token: string): Decoded | { error: string } {
  const cleaned = token.trim().replace(/^Bearer\s+/i, "");
  const parts = cleaned.split(".");
  if (parts.length !== 3) {
    return { error: "JWT must have exactly three dot-separated segments." };
  }
  const header = parseSegment(parts[0]);
  const payload = parseSegment(parts[1]);
  const signature = parts[2];

  const warnings: Decoded["warnings"] = [];
  const headerJson = header.json as { alg?: string; typ?: string; kid?: string } | undefined;

  if (headerJson?.alg === "none") {
    warnings.push({
      level: "alert",
      message: "alg:none - token claims to be unsigned. Many libraries treat this as valid; this is a critical bypass class.",
    });
  }
  if (headerJson?.alg && headerJson.alg.startsWith("HS") && signature.length < 24) {
    warnings.push({
      level: "warn",
      message: "Short signature segment - likely a small or test secret, susceptible to offline brute-force.",
    });
  }
  if (headerJson?.alg === "RS256" || headerJson?.alg === "ES256") {
    warnings.push({
      level: "info",
      message: `Asymmetric algorithm (${headerJson.alg}). Verify the implementation does not silently accept HS256 with the public key.`,
    });
  }
  if (headerJson?.kid && /[\.\\\/]/.test(headerJson.kid)) {
    warnings.push({
      level: "warn",
      message: "kid header contains path-style characters. Some implementations resolve this against the filesystem or DB without validation.",
    });
  }
  const payloadJson = payload.json as { exp?: number; iat?: number } | undefined;
  if (payloadJson?.exp && payloadJson.exp < Date.now() / 1000) {
    warnings.push({ level: "warn", message: "Token has expired (exp is in the past)." });
  }
  if (payloadJson?.exp && payloadJson.exp - (payloadJson.iat ?? 0) > 60 * 60 * 24 * 365) {
    warnings.push({ level: "warn", message: "Token validity exceeds 1 year - long-lived tokens are a credential-handling risk." });
  }

  return { header, payload, signature, warnings };
}

import { useHandshake } from "@/components/ui";

export function JwtDecoderClient() {
  const [token, setToken] = useState(SAMPLE);
  const [analyzing, setAnalyzing] = useState(false);
  const { startHandshake } = useHandshake();
  const result = useMemo(() => decode(token), [token]);

  const handleDecode = () => {
    if (!token.trim()) return;
    startHandshake(() => {
      setAnalyzing(true);
    });
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="rounded-2xl border border-white/[0.08] bg-[color-mix(in_oklch,var(--bsc-surface)_70%,transparent)] p-5">
        <div className="mb-3 flex items-center justify-between">
          <label
            htmlFor="jwt-input"
            className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]"
          >
            Paste JWT
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setToken(SAMPLE);
                setAnalyzing(false);
              }}
              className="rounded-md border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-[11px] font-mono text-[color:var(--bsc-text-2)] hover:bg-white/[0.05]"
            >
              Load sample
            </button>
            <button
              type="button"
              onClick={() => {
                setToken("");
                setAnalyzing(false);
              }}
              className="rounded-md border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-[11px] font-mono text-[color:var(--bsc-text-2)] hover:bg-white/[0.05]"
            >
              Clear
            </button>
          </div>
        </div>
        <textarea
          id="jwt-input"
          value={token}
          onChange={(e) => {
            setToken(e.target.value);
            setAnalyzing(false);
          }}
          spellCheck={false}
          rows={5}
          placeholder="eyJhbGciOi..."
          className="w-full resize-none rounded-lg border border-white/[0.06] bg-[color-mix(in_oklch,var(--bsc-void)_55%,transparent)] p-3 font-mono text-[12.5px] text-[color:var(--bsc-text-1)] outline-none focus:border-[color:var(--bsc-accent)]/40"
        />

        <button
          onClick={handleDecode}
          disabled={!token.trim()}
          className="mt-4 w-full py-3 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-xl font-mono text-[11px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Decode & Verify Token
        </button>
      </div>

      {analyzing && ("error" in result ? (
        <div className="rounded-2xl border border-[color-mix(in_oklch,var(--bsc-rose)_40%,transparent)] bg-[color-mix(in_oklch,var(--bsc-rose)_8%,transparent)] p-5 font-mono text-[12.5px] text-[color:var(--bsc-rose)]">
          {result.error}
        </div>
      ) : (
        <>
          {/* Header + Payload */}
          <div className="grid gap-3 md:grid-cols-2">
            <SegmentPanel title="Header" tone="accent" part={result.header} />
            <SegmentPanel title="Payload" tone="violet" part={result.payload} />
          </div>

          {/* Signature */}
          <div className="rounded-2xl border border-white/[0.08] bg-[color-mix(in_oklch,var(--bsc-surface)_70%,transparent)] p-5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
              Signature
            </div>
            <div className="mt-2 break-all font-mono text-[12px] text-[color:var(--bsc-text-2)]">
              {result.signature || <em>(none)</em>}
            </div>
          </div>

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className="rounded-2xl border border-white/[0.08] bg-[color-mix(in_oklch,var(--bsc-surface)_70%,transparent)] p-5">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
                Flagged
              </div>
              <ul className="mt-3 space-y-2.5">
                {result.warnings.map((w, i) => (
                  <li
                    key={i}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border p-3 text-[12.5px] leading-[1.55]",
                      w.level === "alert" &&
                        "border-[color-mix(in_oklch,var(--bsc-rose)_30%,transparent)] bg-[color-mix(in_oklch,var(--bsc-rose)_8%,transparent)] text-[color:var(--bsc-rose)]",
                      w.level === "warn" &&
                        "border-[color-mix(in_oklch,var(--bsc-amber)_30%,transparent)] bg-[color-mix(in_oklch,var(--bsc-amber)_8%,transparent)] text-[color:var(--bsc-amber)]",
                      w.level === "info" &&
                        "border-white/[0.08] bg-white/[0.02] text-[color:var(--bsc-text-2)]",
                    )}
                  >
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-current" />
                    <span>{w.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ))}
    </div>
  );
}

function SegmentPanel({
  title,
  tone,
  part,
}: {
  title: string;
  tone: "accent" | "violet";
  part: DecodedPart;
}) {
  const toneColor =
    tone === "accent" ? "text-[color:var(--bsc-accent)]" : "text-[color:var(--bsc-violet)]";
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[color-mix(in_oklch,var(--bsc-surface)_70%,transparent)] p-5">
      <div className={cn("text-[10px] font-mono uppercase tracking-wider", toneColor)}>{title}</div>
      {part.error ? (
        <div className="mt-3 font-mono text-[12.5px] text-[color:var(--bsc-rose)]">{part.error}</div>
      ) : (
        <pre className="mt-3 overflow-x-auto rounded-lg border border-white/[0.06] bg-[color-mix(in_oklch,var(--bsc-void)_55%,transparent)] p-3 font-mono text-[12px] leading-[1.65] text-[color:var(--bsc-text-1)]">
{JSON.stringify(part.json, null, 2)}
        </pre>
      )}
    </div>
  );
}
