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
    body: `Most lateral movement in segmented enterprise networks does not happen by exploiting the perimeter. It happens by walking privilege relationships that already exist — through transitive group membership, over-permissioned service accounts, and constrained delegation that was set up once and never reviewed.\n\nThis note maps four lab-recreated AD topologies, runs the same attacker workflow against each, and looks at where the attack succeeded, where it stalled, and what detection coverage existed against it.\n\n## Methodology\n\nFour AD topologies were built from real architectural patterns: a flat single-domain layout, a two-domain forest with one-way trust, a hub-and-spoke layout with a central admin domain, and a layered tier model. Each environment was instrumented identically with Elastic + Wazuh.\n\nThe attacker workflow used five stages: AS-REP Roasting → Kerberoasting → constrained delegation discovery → privilege-path traversal → Tier-0 asset access. The same scripts and the same telemetry stack across all four environments — only the AD shape changed.\n\n## Where the attack succeeded\n\nIn six of eight runs, transitive group membership exposed a Tier-0 asset within three hops. The simplest variant was a service account in a "service-admins" group that was, two layers up, a member of "Domain Admins" via nested groups added years earlier and never audited.\n\nAS-REP Roasting succeeded against the default configuration in all four topologies. Two of them used short, dictionary-derived passwords for service accounts; the other two had stronger passwords but still leaked the hash format, allowing offline workflow.\n\n## Where detection consistently failed\n\nThe most underdetected stage across all environments was constrained delegation abuse. The default Elastic and Splunk rule sets did not flag the Kerberos exchange pattern at all. Custom rules covered it, but only after the workflow had been exercised and explicitly mapped.\n\nThis matches a broader pattern: detection coverage drifts toward what teams have already seen. Environments that had previously responded to a Kerberoasting incident had strong rules for it, and weaker rules for everything adjacent.`,
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
