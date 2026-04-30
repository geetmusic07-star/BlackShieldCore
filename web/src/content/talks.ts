import type { Talk } from "./types";

export const talks: Talk[] = [
  {
    slug: "attacking-llm-agents-bsides-2026",
    title: "Attacking LLM Agents in Production",
    venue: "BSides London 2026",
    date: "2026-04",
    duration: "45 min",
    stage: "available",
    summary:
      "Three production-viable attack chains against LLM agents with external tool access. Walkthrough escalating indirect injection to data exfiltration.",
    resources: [
      { label: "Slides", available: false },
      { label: "Recording", available: false },
      { label: "Demo Repo", available: false },
    ],
    body: [
      { kind: "p", value: "This talk covers the practical exploitation of LLM agents hooked into enterprise APIs." },
      { kind: "h2", value: "The Attack Chains" },
      { kind: "p", value: "We walked through three distinct scenarios during the presentation." },
      { kind: "ul", items: [
        "Cross-Plugin Request Forgery (CPRF)",
        "Data Exfiltration via Markdown Images",
        "Indirect Prompt Injection leading to RCE"
      ]},
      { kind: "callout", tone: "warn", value: "The demo environment used live models; your reproduction results may vary depending on model updates." },
    ],
  },
  {
    slug: "detection-engineering-steelcon-2025",
    title: "Detection Engineering at Scale",
    venue: "SteelCon 2025",
    date: "2025-07",
    duration: "30 min",
    stage: "available",
    summary:
      "Writing Sigma rules that survive red-team validation - architectural patterns, review loops, and KPI-driven rule design.",
    resources: [
      { label: "Slides", available: false },
      { label: "Recording", available: false },
    ],
  },
  {
    slug: "kerberoasting-defcon-2025",
    title: "Kerberoasting Beyond RC4",
    venue: "DEF CON Blue Team Village 2025",
    date: "2025-08",
    duration: "25 min",
    stage: "available",
    summary:
      "Hunting AES-encrypted service-ticket extraction and the detection patterns that actually hold up in real AD environments.",
    resources: [
      { label: "Slides", available: false },
      { label: "Demo", available: false },
    ],
  },
];

export function getTalk(slug: string) {
  return talks.find((t) => t.slug === slug);
}
