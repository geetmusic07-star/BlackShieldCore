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
    stage: "available",
    summary:
      "Initial phishing access escalated to domain compromise in under 4 hours via Kerberoasting and GPO-based deployment.",
    attackVector: "Kerberoasting → GPO Deployment",
    findings: [
      "Service account passwords unrotated for 18+ months",
      "Kerberoasted hash cracked in under 2 minutes on a modest GPU rig",
      "GPO-based deployment bypassed endpoint protection on 87% of machines",
    ],
    tags: ["Active Directory", "Kerberoasting", "Ransomware"],
    body: `## Attack timeline

**Hour 0:** Phishing email delivered to finance department. Macro-enabled document executed a PowerShell stager. Initial access established under the context of a finance analyst account with standard domain user permissions.

**Hour 0-1:** Discovery phase. The attacker enumerated service principal names across the domain using the compromised account. 23 service accounts with SPNs were identified. All were eligible for Kerberoasting.

**Hour 1:** Kerberoasting. Service tickets requested for all 23 accounts. Three hashes cracked within 2 minutes using a GPU rig and a targeted wordlist. The cracked account - svc_backup_prod - had Domain Admin membership via a nested group chain that predated the current IT team.

**Hour 2-3:** Privilege escalation. With Domain Admin, the attacker enumerated all domain-joined endpoints. GPO modification used to deploy a ransomware payload via scheduled task. The payload was signed with a legitimate code-signing certificate acquired from a compromised build server.

**Hour 4:** Deployment. Ransomware executed across 347 endpoints simultaneously. Endpoint protection bypassed on 87% of machines because the GPO-deployed scheduled task ran under SYSTEM context before the EDR agent had loaded post-reboot.

## Why it succeeded

Three compounding failures:

**Service account hygiene.** The cracked account had not had its password changed in 22 months. It was in a "will break something if we change it" category that nobody had resolved. It had Domain Admin through a group nesting path that appeared in no access review because the tooling reviewed direct group memberships, not transitive ones.

**No detection on Kerberoasting.** The environment had Splunk with a reasonable rule set. Kerberoasting detection was present for RC4 tickets. The cracked account used AES-256 by default; the rule did not fire. Volume-based detection would have caught it but had not been tuned.

**GPO as a deployment vector.** The detection stack had strong endpoint process monitoring. It had nothing monitoring GPO changes. The scheduled task creation happened at the domain controller level before any endpoint agent saw it.

## What detection should have been

The Kerberoasting detection gap was closeable: a volume-based rule on TGS-REQ events from a single account within a short window would have flagged the bulk request. The GPO modification would have required DC-level event log monitoring (Event ID 5136, directory service changes) - present in most SIEM content libraries, not deployed in this environment.

The cascade from phishing to domain compromise in 4 hours is fast but not unusual. Each step used well-documented techniques with well-documented detection patterns. The issue was not that the patterns didn't exist; it was that they weren't deployed.`,
  },
  {
    slug: "ai-model-exfiltration",
    title: "Indirect Prompt Injection Enabling Data Exfiltration",
    category: "AI",
    date: "2026-02-10",
    minutes: 32,
    stage: "available",
    summary:
      "An LLM-powered document assistant manipulated via malicious content embedded in uploaded documents to exfiltrate conversation history.",
    attackVector: "Indirect Prompt Injection",
    findings: [
      "Malicious instructions embedded in a PDF were processed as trusted system context",
      "No input sanitization applied to document text before injection into the model context window",
      "Exfiltration via markdown image tags rendered by the chat interface - no network block triggered",
    ],
    tags: ["LLM", "Prompt Injection", "Data Exfiltration"],
    body: `## The product

An enterprise document assistant: users upload PDFs, ask questions, receive answers. The model had access to the user's conversation history and could reference prior sessions. The system prompt included internal policy data and was marked confidential.

## The attack

A malicious PDF was crafted containing visible, legitimate content on the first page and invisible instruction text embedded in white-on-white formatting later in the document. When the PDF was processed, the full text - including the hidden instructions - was extracted and injected into the model's context window as document content.

The injected instructions directed the model to:
1. Retrieve and summarise the system prompt
2. Retrieve the last 10 conversation turns for the current user session
3. Encode the output as a URL parameter and embed it in a markdown image tag

The model complied. The chat interface rendered the markdown image, which triggered an HTTP request to an attacker-controlled server with the encoded payload in the URL parameter. The conversation history and system prompt arrived on the attacker's server within 3 seconds of the user asking a question about the malicious document.

## Why the controls failed

**PDF text extraction treated all text as equivalent.** The extraction pipeline made no distinction between visible and hidden content. OCR-based extraction would have had the same behaviour. The document's text was text, and it was injected into the model context as document content.

**No instruction-pattern detection on retrieved content.** The pipeline had input filtering on the user turn - it scanned for prompt injection patterns in direct user messages. It had nothing equivalent for document content, which was treated as trusted data rather than potentially hostile input.

**Markdown rendering in the chat interface.** The interface rendered markdown in model responses including image tags. This is the exfiltration channel. A model that can emit a markdown image tag can initiate an outbound HTTP request to any URL - as long as the interface renders markdown and the attacker controls the URL.

## What the fix looks like

Three independent controls, each of which breaks the chain:

Strip markdown rendering from model responses in contexts where the model processes untrusted content. An image tag that doesn't render can't exfiltrate. This is the fastest fix to deploy and the most reliable.

Apply the same instruction-pattern detection to document content as to user input. This is imperfect - instruction detection has false positives and can be evaded - but it raises the cost of the attack.

Architectural separation: use a different model instance to process document content than to generate user-facing responses. The processing model extracts information; the generation model answers questions. The generation model cannot be instructed by the processing model's output, only informed by it.`,
  },
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((c) => c.slug === slug);
}
