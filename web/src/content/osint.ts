import type { OsintTool, OsintCase } from "./types";

export const osintTools: OsintTool[] = [
  // ─── Threat Intel ────────────────────────────────────────────────────────
  {
    name: "VirusTotal",
    description:
      "Scan files, URLs, domains, and IP addresses against 70+ antivirus engines and threat intelligence feeds. The starting point for most artifact analysis.",
    url: "https://www.virustotal.com",
    category: "Threat Intel",
    tags: ["Files", "URLs", "IP", "Hash Lookup"],
    featured: true,
  },
  {
    name: "AbuseIPDB",
    description:
      "Community-sourced IP abuse reports with confidence scores and category classifications. High-volume API available for SIEM integration.",
    url: "https://www.abuseipdb.com",
    category: "Threat Intel",
    tags: ["IP Reputation", "Abuse Reports", "Blocklist"],
    featured: true,
  },
  {
    name: "URLScan.io",
    description:
      "Sandbox any URL in a real browser. Returns screenshots, DOM snapshots, outbound network connections, and detected technologies.",
    url: "https://urlscan.io",
    category: "Threat Intel",
    tags: ["URL", "Sandbox", "Screenshots", "Phishing"],
  },
  {
    name: "AlienVault OTX",
    description:
      "Open threat intelligence community. Submit and consume indicators, follow actor pulse feeds, and track emerging campaigns in real time.",
    url: "https://otx.alienvault.com",
    category: "Threat Intel",
    tags: ["IoC", "Threat Actors", "Pulses"],
  },
  {
    name: "Pulsedive",
    description:
      "Threat intelligence platform with enriched IoC data: WHOIS, passive DNS, threat associations, and risk scoring in a clean interface.",
    url: "https://pulsedive.com",
    category: "Threat Intel",
    tags: ["IoC Enrichment", "Risk Score", "Passive DNS"],
  },

  // ─── DNS & Network ───────────────────────────────────────────────────────
  {
    name: "Shodan",
    description:
      "Search engine for internet-exposed devices. Port data, service banners, CVE associations, and infrastructure mapping at global scale.",
    url: "https://www.shodan.io",
    category: "DNS & Network",
    tags: ["Exposed Services", "Banners", "IoT", "CVEs"],
    featured: true,
  },
  {
    name: "Censys",
    description:
      "Internet-wide scan data for hosts and TLS certificates. More structured than Shodan with deeper certificate and protocol coverage.",
    url: "https://search.censys.io",
    category: "DNS & Network",
    tags: ["TLS Certs", "Host Scanning", "IPv4"],
    featured: true,
  },
  {
    name: "ping.eu",
    description:
      "External ping, traceroute, DNS lookup, port check, and WHOIS from geographically distributed nodes. Useful for validating external reachability.",
    url: "https://ping.eu",
    category: "DNS & Network",
    tags: ["Ping", "Traceroute", "WHOIS", "Port Check"],
  },
  {
    name: "MXToolbox",
    description:
      "DNS health checks, MX record lookup, blacklist monitoring, SMTP diagnostics, and SPF/DKIM/DMARC validation in one place.",
    url: "https://mxtoolbox.com",
    category: "DNS & Network",
    tags: ["MX", "DNS", "SPF", "Blacklist"],
  },
  {
    name: "DNSdumpster",
    description:
      "Passive DNS recon tool. Discovers hosts and subdomains related to a target domain without active scanning.",
    url: "https://dnsdumpster.com",
    category: "DNS & Network",
    tags: ["DNS Recon", "Subdomains", "Passive"],
  },
  {
    name: "Hurricane Electric BGP",
    description:
      "ASN info, BGP routing tables, IP block ownership, and peering data for network infrastructure research and attribution.",
    url: "https://bgp.he.net",
    category: "DNS & Network",
    tags: ["BGP", "ASN", "CIDR", "Routing"],
  },

  // ─── Email & Identity ────────────────────────────────────────────────────
  {
    name: "Have I Been Pwned",
    description:
      "Check if an email address or phone number has appeared in documented data breaches. Domain-level monitoring available for security teams.",
    url: "https://haveibeenpwned.com",
    category: "Email & Identity",
    tags: ["Breach Check", "Email", "Credentials"],
    featured: true,
  },
  {
    name: "Hunter.io",
    description:
      "Find and verify professional email addresses for any domain. Pattern inference, confidence scoring, and bulk verification API.",
    url: "https://hunter.io",
    category: "Email & Identity",
    tags: ["Email Finder", "Verification", "Domain"],
  },
  {
    name: "EmailRep.io",
    description:
      "Email reputation scoring using breach history, spam reports, domain age, and observed behavioral signals.",
    url: "https://emailrep.io",
    category: "Email & Identity",
    tags: ["Reputation", "Spam", "Phishing Risk"],
  },

  // ─── Vulnerability ───────────────────────────────────────────────────────
  {
    name: "NVD",
    description:
      "US National Vulnerability Database. CVE details, CVSS base scores, affected products, and remediation references. Authoritative source.",
    url: "https://nvd.nist.gov",
    category: "Vulnerability",
    tags: ["CVE", "CVSS", "NIST", "Patches"],
    featured: true,
  },
  {
    name: "Exploit-DB",
    description:
      "Public exploit archive maintained by Offensive Security. Searchable by CVE, vendor, platform, type, and exploit category.",
    url: "https://www.exploit-db.com",
    category: "Vulnerability",
    tags: ["Exploits", "PoC", "CVE"],
  },
  {
    name: "CVE Details",
    description:
      "CVE data with vendor and product drill-down, CVSS trend charts, and historical vulnerability counts per vendor over time.",
    url: "https://www.cvedetails.com",
    category: "Vulnerability",
    tags: ["CVE", "Vendors", "Statistics"],
  },

  // ─── Infrastructure ──────────────────────────────────────────────────────
  {
    name: "SecurityTrails",
    description:
      "Historical DNS records, subdomain enumeration, IP history, and WHOIS data. Useful for passive infrastructure tracking and attribution.",
    url: "https://securitytrails.com",
    category: "Infrastructure",
    tags: ["DNS History", "Subdomains", "WHOIS"],
    featured: true,
  },
  {
    name: "Radware Threat Intel",
    description:
      "DDoS threat advisories, real-time attack intelligence, and botnet activity documentation from global network telemetry.",
    url: "https://www.radware.com/security/threat-advisories-and-attack-reports",
    category: "Infrastructure",
    tags: ["DDoS", "Botnets", "Advisories"],
  },
  {
    name: "Cloudflare Radar",
    description:
      "Internet traffic trends, BGP route changes, DNS query statistics, and attack traffic patterns from Cloudflare's global network.",
    url: "https://radar.cloudflare.com",
    category: "Infrastructure",
    tags: ["Traffic", "BGP", "Attack Trends"],
  },

  // ─── Platforms ───────────────────────────────────────────────────────────
  {
    name: "OSINT Framework",
    description:
      "Categorized, browsable directory of OSINT tools and resources. Organised by investigation type with direct links to hundreds of tools.",
    url: "https://osintframework.com",
    category: "Platforms",
    tags: ["Directory", "Meta-Tool", "Framework"],
  },
  {
    name: "IntelX",
    description:
      "Search engine for leaked data, historical records, dark web content, and paste sites. Useful for credential exposure research.",
    url: "https://intelx.io",
    category: "Platforms",
    tags: ["Leaks", "Pastes", "Breach Data"],
  },
  {
    name: "Grep.app",
    description:
      "Search across half a million public git repositories. Useful for finding exposed credentials, API keys, and misconfigured secrets.",
    url: "https://grep.app",
    category: "Platforms",
    tags: ["Code Search", "Git", "Credential Exposure"],
  },
];

// Kept for backward compat with detail page route
export const osintCases: OsintCase[] = [];

export function getOsintCase(slug: string) {
  return osintCases.find((c) => c.slug === slug);
}
