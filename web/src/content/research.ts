import type { ResearchNote } from "./types";

export const research: ResearchNote[] = [
  {
    slug: "attack-path-modeling",
    title: "Attack Path Modeling in Segmented Enterprise Networks",
    type: "Deep Analysis",
    date: "2026-04-10",
    minutes: 35,
    tags: ["Active Directory", "Attack Paths"],
    stage: "available",
    abstract:
      "Maps how attackers traverse segmented environments using legitimate credentials, trusted tools, and protocol abuse rather than perimeter bypasses.",
    findings: [
      "Tier-0 asset exposure through transitive group membership in 6 of 8 lab simulations",
      "AS-REP Roasting effective against default configurations in all tested environments",
      "Constrained delegation abuse consistently underdetected across Elastic and Splunk baselines",
    ],
  },
  {
    slug: "adversarial-prompt-taxonomy",
    title: "Adversarial Prompt Taxonomy: Classification and Bypass Analysis",
    type: "Technical Note",
    date: "2026-03-02",
    minutes: 22,
    tags: ["LLM", "AI Security"],
    stage: "build",
    abstract:
      "Structured classification of prompt injection and jailbreak techniques, mapped to the safety mechanism they bypass.",
  },
  {
    slug: "telemetry-coverage-gaps",
    title: "Telemetry Coverage Gaps in Standard SIEM Deployments",
    type: "Deep Analysis",
    date: "2026-02-14",
    minutes: 28,
    tags: ["SIEM", "Coverage"],
    stage: "build",
    abstract:
      "Systematic review of ATT&CK techniques consistently under-logged in baseline Elastic and Splunk deployments.",
  },
  {
    slug: "lab-design-tradeoffs",
    title: "Lab Design Tradeoffs: Realism vs. Safety in Cyber Range Environments",
    type: "Architecture",
    date: "2025-12-05",
    minutes: 15,
    tags: ["Lab", "Architecture"],
    stage: "build",
    abstract:
      "Design decisions in building offensive labs — balancing environmental realism against isolation and operational safety.",
  },
];

export function getResearch(slug: string) {
  return research.find((r) => r.slug === slug);
}
