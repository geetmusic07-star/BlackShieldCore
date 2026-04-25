import type { BlogPost } from "./types";

export const blogPosts: BlogPost[] = [
  {
    slug: "jwt-security-deep-dive",
    title: "JWT Security Deep Dive: Algorithm Confusion to Full Bypass",
    kicker: "Auth",
    date: "2026-04-17",
    minutes: 24,
    tags: ["JWT", "Auth", "Offensive"],
    stage: "available",
    excerpt:
      "A rigorous walkthrough of the five JWT failure modes that produce 90% of real-world auth bypasses: alg:none, key confusion, weak HMAC, kid injection, and jwks:// smuggling.",
    body: `JSON Web Tokens are not broken. Most implementations that use them are.\n\nThis post walks through the five failure modes that account for the overwhelming majority of real-world JWT auth bypasses we have reviewed in CVE analyses and red-team engagements.`,
  },
  {
    slug: "kerberos-attack-paths",
    title: "Kerberos Attack Paths: AS-REP Roasting to Domain Compromise",
    kicker: "Active Directory",
    date: "2026-04-12",
    minutes: 18,
    tags: ["Active Directory", "Offensive"],
    stage: "build",
    excerpt:
      "From unauthenticated AS-REP Roasting through Kerberoasting, constrained delegation abuse, and Silver Ticket forgery.",
  },
  {
    slug: "edr-bypass-telemetry",
    title: "EDR Bypass via Telemetry Gaps: What Most Rules Miss",
    kicker: "Detection",
    date: "2026-04-06",
    minutes: 15,
    tags: ["Detection", "Offensive"],
    stage: "build",
    excerpt:
      "Analysis of common EDR telemetry blind spots — direct syscalls, heaven's gate, and process injection via legitimate tools.",
  },
  {
    slug: "llm-jailbreak-taxonomy",
    title: "A Working Taxonomy of LLM Jailbreaks and What They Actually Bypass",
    kicker: "AI Security",
    date: "2026-03-28",
    minutes: 20,
    tags: ["LLM", "AI Security"],
    stage: "build",
    excerpt:
      "Structured classification of prompt injection, jailbreak, and extraction techniques against production LLMs.",
  },
  {
    slug: "supply-chain-detection",
    title: "Detecting Supply Chain Compromise via Build Pipeline Telemetry",
    kicker: "Supply Chain",
    date: "2026-03-19",
    minutes: 13,
    tags: ["Supply Chain", "Defensive"],
    stage: "build",
    excerpt:
      "CI/CD pipeline monitoring strategies that catch dependency substitution and malicious build-step injection.",
  },
  {
    slug: "sigma-rule-writing",
    title: "Writing Sigma Rules That Actually Fire",
    kicker: "Detection",
    date: "2026-01-30",
    minutes: 11,
    tags: ["Sigma", "Detection"],
    stage: "build",
    excerpt:
      "Common mistakes in detection rule writing — overly broad conditions, missing log source context, and rules that pass QA but miss production.",
  },
];

export function getPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
