import type { OsintCase } from "./types";

export const osintCases: OsintCase[] = [
  {
    slug: "operation-fakeverify",
    caseId: "CASE-2026-0041",
    title: "Phishing Kit Infrastructure Mapping: Operation FakeVerify",
    category: "Phishing",
    status: "Active",
    date: "2026-04-18",
    summary:
      "Tracking a sophisticated phishing kit targeting enterprise Microsoft 365 accounts. The kit uses adversarial proxying to bypass MFA by relaying credentials in real time. Ongoing infrastructure mapping has identified 34 active domains across 8 hosting providers.",
    findings: [
      "34 active phishing domains identified",
      "Shared TLS certificate fingerprints traced to a common kit origin",
      "Adversary-in-the-middle (AiTM) proxy chain documented",
      "3 hosting providers notified · 12 domains taken down to date",
      "IoC list published to OpenCTI and MISP",
    ],
    tags: ["Phishing", "AiTM", "MS365", "Infrastructure"],
  },
  {
    slug: "finance-typosquat-q1",
    caseId: "CASE-2026-0038",
    title: "Domain Squatting Campaign: Finance Sector Q1 2026",
    category: "Domain",
    status: "Published",
    date: "2026-03-22",
    summary:
      "Typosquatting campaign targeting 14 major financial institutions. Homoglyph domains registered weeks before targeted phishing waves.",
    findings: [
      "91 lookalike domains catalogued",
      "Registration timing patterns identified across 3 registrars",
      "WHOIS clustering reveals 3 actor accounts",
      "Mailbox-side detection rules published as Sigma",
    ],
    tags: ["Domain", "Homoglyph", "WHOIS", "Finance"],
  },
  {
    slug: "apt-iridium-tracking",
    caseId: "CASE-2026-0028",
    title: "Actor Tracking: APT-Iridium Campaign Footprint",
    category: "Actor",
    status: "Published",
    date: "2026-02-10",
    summary:
      "Curated open-source profile of an actor cluster operating against EU professional-services firms. Infrastructure, TTPs, and overlap with previously documented campaigns.",
    findings: [
      "Reuse of three TLS server fingerprints across 9 campaigns",
      "Distinct kit handoff between phishing and post-exploit C2 stages",
      "Tooling overlap with two earlier reported clusters",
    ],
    tags: ["Actor", "Attribution", "C2", "EU"],
  },
  {
    slug: "cdn-staging-network",
    caseId: "CASE-2025-0098",
    title: "CDN-Hosted Staging Infrastructure",
    category: "Infrastructure",
    status: "Closed",
    date: "2025-12-04",
    summary:
      "Curated walkthrough of a multi-tenant CDN being abused as low-cost staging for short-lived phishing pages. Detection patterns published as proxy log queries.",
    findings: [
      "Pages had a median lifetime of 73 minutes",
      "Common URL path token pattern identified across tenants",
      "Detection ruleset open-sourced",
    ],
    tags: ["CDN", "Staging", "Detection"],
  },
];

export function getOsintCase(slug: string) {
  return osintCases.find((c) => c.slug === slug);
}
