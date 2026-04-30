import type { Tool } from "./types";

export const tools: Tool[] = [
  {
    slug: "jwt-decoder",
    name: "JWT Decoder",
    category: "Token",
    stage: "available",
    description:
      "Decode, inspect, and manipulate JSON Web Tokens. Detect algorithm confusion, weak signing, and kid-header injection.",
    tags: ["JWT", "Auth"],
  },
  {
    slug: "hash-analyzer",
    name: "Hash Analyzer",
    category: "Crypto",
    stage: "available",
    description:
      "Identify hash algorithms from format and length. Flags deprecated algorithms and password-storage anti-patterns.",
    tags: ["Crypto", "Forensics"],
  },
  {
    slug: "log-parser",
    name: "Log Pattern Parser",
    category: "SIEM",
    stage: "build",
    description:
      "Extract IoCs from raw log output and flag suspicious patterns such as path traversal, SQLi, and LOLBin invocations.",
    tags: ["SIEM", "Detection"],
  },
  {
    slug: "password-entropy",
    name: "Password Entropy",
    category: "Crypto",
    stage: "build",
    description:
      "Calculate password entropy, detect patterns, and estimate crack time across common hashcat rule sets.",
    tags: ["Auth", "Entropy"],
  },
  {
    slug: "cve-lookup",
    name: "CVE Lookup",
    category: "Forensics",
    stage: "planned",
    description:
      "Search CVE metadata with CVSS scoring, affected version ranges, and patch tracking across advisories.",
    tags: ["CVE", "Intelligence"],
  },
  {
    slug: "port-scanner",
    name: "Port Scanner",
    category: "Recon",
    stage: "planned",
    description:
      "Service fingerprinting and banner grabbing with OS detection across specified target ranges.",
    tags: ["Recon", "Network"],
  },
  {
    slug: "payload-gen",
    name: "Payload Generator",
    category: "Offensive",
    stage: "planned",
    description:
      "Generate and encode payloads for XSS, SQLi, command injection, and SSRF scenarios.",
    tags: ["Offensive", "Payloads"],
  },
];

export function getTool(slug: string) {
  return tools.find((t) => t.slug === slug);
}
