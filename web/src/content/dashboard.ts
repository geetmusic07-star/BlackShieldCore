export interface CveEntry {
  id: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  cvss: number;
  topic: string;
  vendor: string;
  published: string;
  status: "Reviewed" | "Tracked" | "Patched";
}

export const cveSamples: CveEntry[] = [
  { id: "CVE-2026-3849", severity: "Critical", cvss: 9.8, topic: "Remote code execution via deserialised metadata", vendor: "imageio", published: "2026-04-18", status: "Reviewed" },
  { id: "CVE-2026-3712", severity: "High", cvss: 8.4, topic: "Auth bypass through OAuth proxy state handling", vendor: "oauth-proxy", published: "2026-04-12", status: "Reviewed" },
  { id: "CVE-2026-3611", severity: "High", cvss: 8.1, topic: "SSRF leaking cloud metadata service credentials", vendor: "cloud-edge", published: "2026-04-08", status: "Tracked" },
  { id: "CVE-2026-3502", severity: "Medium", cvss: 6.7, topic: "Stored XSS in admin console search field", vendor: "admin-suite", published: "2026-04-02", status: "Tracked" },
  { id: "CVE-2026-3401", severity: "Critical", cvss: 9.6, topic: "Deserialisation RCE in message-bus consumer", vendor: "msg-bus", published: "2026-03-28", status: "Reviewed" },
  { id: "CVE-2026-3370", severity: "High", cvss: 7.9, topic: "Path traversal via file API content-disposition", vendor: "files-api", published: "2026-03-21", status: "Reviewed" },
  { id: "CVE-2026-3258", severity: "High", cvss: 7.6, topic: "Privilege escalation via crafted setuid invocation", vendor: "linux-utils", published: "2026-03-15", status: "Tracked" },
  { id: "CVE-2026-3119", severity: "Medium", cvss: 6.1, topic: "Reflected XSS via search query parameter", vendor: "search-front", published: "2026-03-10", status: "Patched" },
  { id: "CVE-2026-3081", severity: "High", cvss: 8.0, topic: "JWT alg confusion in identity provider", vendor: "id-prov", published: "2026-03-04", status: "Reviewed" },
  { id: "CVE-2026-2944", severity: "Critical", cvss: 9.3, topic: "Heap overflow in message parser", vendor: "msg-parse", published: "2026-02-24", status: "Patched" },
  { id: "CVE-2026-2812", severity: "Medium", cvss: 5.9, topic: "CSRF in admin API endpoint", vendor: "admin-suite", published: "2026-02-18", status: "Tracked" },
  { id: "CVE-2026-2680", severity: "High", cvss: 7.4, topic: "Open redirect via OAuth redirect_uri", vendor: "oauth-proxy", published: "2026-02-12", status: "Patched" },
];

export const techniqueCoverage = [
  { id: "T1078", name: "Valid Accounts", coverage: 86 },
  { id: "T1059", name: "Command-Line Interpreter", coverage: 71 },
  { id: "T1003", name: "OS Credential Dumping", coverage: 64 },
  { id: "T1021", name: "Remote Services", coverage: 49 },
  { id: "T1486", name: "Data Encrypted for Impact", coverage: 28 },
  { id: "T1055", name: "Process Injection", coverage: 56 },
  { id: "T1547", name: "Boot or Logon Persistence", coverage: 41 },
];

export const dashboardSummary = [
  { label: "CVEs reviewed", value: "142", note: "since 2025-09" },
  { label: "Sigma rules", value: "37", note: "open-sourced" },
  { label: "Lab tracks", value: "24", note: "across 6 categories" },
  { label: "OSINT cases", value: "8", note: "published / 4 active" },
];
