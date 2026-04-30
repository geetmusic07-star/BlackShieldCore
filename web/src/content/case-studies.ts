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
    body: `## Background\n\nThis is a reconstruction of a documented dependency-confusion class compromise against a CI/CD pipeline. The technique is well-known; the value of this writeup is in the operational detail - what made it succeed, where it should have been caught, and what the detection patterns look like.\n\n## How it worked\n\nThe target organisation used a private npm registry for internal packages, scoped without the namespace prefix that npm requires for proper resolution. An attacker noticed the package name in publicly-leaked code samples, registered the same name on the public registry under a higher version number, and added a benign-looking preinstall script.\n\nWhen the build pipeline ran, npm resolved the package name to the public registry - because the public version number was higher than the internal one - and executed the preinstall script. The script had network access during build and ran as the build user.\n\n## Dwell time\n\nThe malicious package was published 14 days before detection. Three production builds executed it in that window. Detection came from an outbound connection alert flagged by the cloud network team - not from the build pipeline itself.\n\n## What detection should look like\n\nThree complementary controls would have flagged this earlier:\n\n1. **Registry pinning per package name.** The build configuration should hard-pin internal packages to the internal registry only. This is a config change, not a tool change.\n2. **Preinstall script monitoring.** The CI runner should log every preinstall and lifecycle script execution. This data is often discarded.\n3. **Outbound network policy on builders.** Build runners should have a strict allow-list for outbound connections. A new destination domain should produce an alert.\n\nNone of these are novel - they are well-known controls. The lesson here is that not having one of them is fine; not having any of them is the failure mode.`,
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
