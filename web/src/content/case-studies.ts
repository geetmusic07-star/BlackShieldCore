import type { CaseStudy } from "./types";

export const caseStudies: CaseStudy[] = [
  {
    slug: "supply-chain-npm",
    title: "Supply Chain Compromise via Dependency Confusion in CI/CD",
    category: "Supply Chain",
    date: "2026-04-08",
    minutes: 45,
    stage: "available",
    summary:
      "Reconstruction of an internal npm package substitution: the build resolved to a malicious public version and executed attacker-controlled code during CI.",
    attackVector: "Dependency Confusion (npm)",
    findings: [
      "Package manager resolved public registry over private registry for the same package name",
      "Attacker-controlled version executed preinstall scripts with network access during build",
      "Dwell time: 14 days in CI before anomalous outbound connections triggered an alert",
    ],
    tags: ["CI/CD", "Dependency Confusion", "npm"],
  },
  {
    slug: "ransomware-ad-lateral",
    title: "Ransomware via Active Directory Lateral Movement",
    category: "Ransomware",
    date: "2026-03-18",
    minutes: 38,
    stage: "build",
    summary:
      "Initial phishing access escalated to domain compromise in under 4 hours via Kerberoasting and GPO-based deployment.",
    attackVector: "Kerberoasting → GPO Deployment",
    findings: [
      "Service account passwords unrotated for 18+ months",
      "Kerberoasted hash cracked in under 2 minutes on a modest GPU rig",
      "GPO-based deployment bypassed endpoint protection on 87% of machines",
    ],
    tags: ["Active Directory", "Kerberoasting", "Ransomware"],
  },
  {
    slug: "ai-model-exfiltration",
    title: "Indirect Prompt Injection Enabling Data Exfiltration",
    category: "AI",
    date: "2026-02-10",
    minutes: 32,
    stage: "build",
    summary:
      "An LLM-powered document assistant manipulated via malicious content embedded in uploaded documents.",
    attackVector: "Indirect Prompt Injection",
    findings: [
      "Malicious instructions inside a PDF were processed as trusted content",
      "No input sanitization applied to document text before passing to model context",
    ],
    tags: ["LLM", "Prompt Injection", "Data Exfiltration"],
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
