"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { ArrowLeft, TerminalSquare, AlertTriangle, CheckCircle2 } from "lucide-react";

interface LogAlert {
  line: number;
  type: string;
  severity: "high" | "medium" | "low";
  match: string;
  description: string;
}

function parseLogs(logs: string): LogAlert[] {
  const lines = logs.split("\n");
  const alerts: LogAlert[] = [];

  const patterns = [
    {
      type: "SQL Injection",
      severity: "high",
      regex: /UNION\s+SELECT|['"]\s*OR\s*['"]\d+['"]\s*=\s*['"]\d+|waitfor\s+delay/i,
      description: "SQL injection payload detected. Attackers may be trying to extract database records or bypass authentication."
    },
    {
      type: "Path Traversal",
      severity: "high",
      regex: /\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e\//i,
      description: "Path traversal sequence detected. Attackers may be attempting to read arbitrary files like /etc/passwd."
    },
    {
      type: "Cross-Site Scripting (XSS)",
      severity: "medium",
      regex: /<script>|javascript:|onerror=|onload=/i,
      description: "Potential XSS payload detected in parameters. Attackers might be trying to execute malicious scripts."
    },
    {
      type: "Command Injection / LOLBin",
      severity: "high",
      regex: /;\s*(bash|sh|cmd|powershell|wget|curl|nc|netcat)\b/i,
      description: "Command injection sequence or Living-off-the-Land Binary (LOLBin) execution detected."
    },
    {
      type: "Automated Scanner",
      severity: "low",
      regex: /nmap|sqlmap|dirb|nikto|burpcollaborator/i,
      description: "Known automated security scanner User-Agent or payload detected."
    }
  ];

  lines.forEach((line, index) => {
    if (!line.trim()) return;

    patterns.forEach(pattern => {
      const match = line.match(pattern.regex);
      if (match) {
        alerts.push({
          line: index + 1,
          type: pattern.type,
          severity: pattern.severity as "high" | "medium" | "low",
          match: match[0],
          description: pattern.description
        });
      }
    });
  });

  return alerts;
}

export default function LogParserPage() {
  const [logs, setLogs] = useState("");
  const alerts = parseLogs(logs);

  return (
    <div className="pt-32 pb-24">
      <Container className="max-w-[1000px]">
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 font-mono text-[12px] text-[color:var(--bsc-text-3)] hover:text-[color:var(--bsc-text-1)]"
        >
          <ArrowLeft size={13} />
          All Tools
        </Link>

        <h1 className="mt-6 text-[28px] font-semibold tracking-[-0.018em] text-[color:var(--bsc-text-1)]">
          Log Pattern Parser
        </h1>
        <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-[color:var(--bsc-text-2)]">
          Paste raw access logs (e.g. Nginx, Apache) below. The parser extracts Indicators of Compromise (IoCs) and flags suspicious patterns such as path traversal, SQLi, and LOLBin invocations.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Left Column: Input */}
          <div className="rounded-xl border border-white/[0.08] bg-black/40 p-5">
            <div className="mb-2 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
              <TerminalSquare size={13} /> Raw Logs
            </div>
            <textarea
              value={logs}
              onChange={(e) => setLogs(e.target.value)}
              spellCheck={false}
              placeholder="192.168.1.100 - - [10/Oct/2026:13:55:36 -0700] &quot;GET /login.php?user=admin' OR '1'='1 HTTP/1.1&quot; 200..."
              className="h-[500px] w-full resize-none bg-transparent font-mono text-[13px] leading-relaxed text-[color:var(--bsc-text-1)] outline-none"
            />
          </div>

          {/* Right Column: Results */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
                Analysis Alerts
              </div>
              <div className="font-mono text-[11px] text-[color:var(--bsc-text-3)]">
                {alerts.length} detections
              </div>
            </div>

            {logs.trim() === "" ? (
              <div className="flex h-[200px] items-center justify-center rounded-xl border border-white/[0.05] bg-white/[0.02] p-8 text-center">
                <div>
                  <TerminalSquare size={24} className="mx-auto mb-3 text-[color:var(--bsc-text-3)] opacity-50" />
                  <div className="text-[14px] text-[color:var(--bsc-text-2)]">
                    Waiting for log input...
                  </div>
                </div>
              </div>
            ) : alerts.length > 0 ? (
              <div className="space-y-3 overflow-y-auto pr-2" style={{ maxHeight: "500px" }}>
                {alerts.map((alert, i) => (
                  <div
                    key={i}
                    className={`rounded-xl border p-4 ${
                      alert.severity === "high" 
                        ? "border-[color:var(--bsc-amber)]/30 bg-[color:var(--bsc-amber)]/[0.05]" 
                        : alert.severity === "medium"
                        ? "border-[oklch(0.7_0.15_60)]/30 bg-[oklch(0.7_0.15_60)]/[0.05]"
                        : "border-white/[0.08] bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <AlertTriangle 
                          size={14} 
                          className={alert.severity === "high" ? "text-[color:var(--bsc-amber)]" : "text-[oklch(0.7_0.15_60)]"} 
                        />
                        <span className="font-semibold text-[color:var(--bsc-text-1)]">
                          {alert.type}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] text-[color:var(--bsc-text-3)]">
                        Line {alert.line}
                      </span>
                    </div>
                    <div className="mt-2 font-mono text-[12px] text-[color:var(--bsc-text-2)]">
                      Matched: <span className="text-[color:var(--bsc-text-1)]">"{alert.match}"</span>
                    </div>
                    <p className="mt-2 text-[13px] leading-relaxed text-[color:var(--bsc-text-3)]">
                      {alert.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-[200px] items-center justify-center rounded-xl border border-[oklch(0.85_0.14_140)]/20 bg-[oklch(0.85_0.14_140)]/[0.05] p-8 text-center">
                <div>
                  <CheckCircle2 size={24} className="mx-auto mb-3 text-[oklch(0.85_0.14_140)]" />
                  <div className="text-[14px] text-[color:var(--bsc-text-1)]">
                    No threats detected
                  </div>
                  <div className="mt-1 text-[13px] text-[color:var(--bsc-text-3)]">
                    The parsed logs did not match any known attack signatures.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
