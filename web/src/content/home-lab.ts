import type { HomeLabComponent } from "./types";

export const homeLab: HomeLabComponent[] = [
  // Cyber range
  { slug: "proxmox-ve", category: "Cyber Range", name: "Proxmox VE", role: "Hypervisor", notes: "Hosts the AD lab, target VMs, and isolated attack-surface segments.", stage: "available" },
  { slug: "windows-ad", category: "Cyber Range", name: "Windows AD (2-DC, 6-host)", role: "Target environment", notes: "Two-domain Active Directory with realistic GPO and service-account misconfigurations.", stage: "available" },
  { slug: "linux-target-stack", category: "Cyber Range", name: "Linux target stack", role: "Target environment", notes: "Web app, DB, message bus, and SSRF/SSRF-adjacent edge surfaces for lab work.", stage: "available" },
  // Detection
  { 
    slug: "elastic-stack", 
    category: "Detection", 
    name: "Elastic Stack", 
    role: "SIEM", 
    notes: "Centralised log ingestion, detection-as-code rules, and lab telemetry visualisation.", 
    stage: "available",
    body: [
      {
        kind: "p",
        value: "The BlackShield Core SIEM architecture relies on a self-hosted instance of the Elastic Stack (Elasticsearch, Logstash, Kibana, and Fleet Server) acting as the central nervous system of the cyber range."
      },
      { kind: "h3", value: "Deployment Architecture" },
      {
        kind: "ul",
        items: [
          "Elasticsearch (Hot/Warm/Cold architecture for cost-efficient long-term threat hunting).",
          "Kibana (Exposed internally via Nginx reverse proxy).",
          "Fleet Server (Manages Elastic Agents deployed on Windows endpoints and Linux containers)."
        ]
      },
      {
        kind: "p",
        value: "Elastic Agents are deployed to all Active Directory domain controllers, workstations, and application servers. They are configured with the 'Endpoint Security', 'Windows', and 'System' integrations."
      },
      { kind: "h3", value: "Custom Detection Engineering" },
      {
        kind: "p",
        value: "The lab utilizes a custom CI/CD pipeline to convert Sigma rules into Elasticsearch DSL, which are then pushed directly to the Kibana Detection Engine via API. This allows the lab to rapidly simulate a threat, write a Sigma rule, and verify it fires in real-time."
      },
      {
        kind: "code",
        lang: "yaml",
        value: "title: Suspicious PowerShell Download\nid: 3b6ab547-8ec2-4991-b9d2-2b06702a48d7\nstatus: experimental\ndescription: Detects powershell downloading payloads via net.webclient or invoke-webrequest.\nlogsource:\n    product: windows\n    service: powershell\ndetection:\n    selection:\n        EventID: 4104\n        ScriptBlockText|contains:\n            - 'Net.WebClient'\n            - 'DownloadString'\n            - 'Invoke-WebRequest'\n    condition: selection\nlevel: high"
      },
      {
        kind: "callout",
        tone: "note",
        value: "The entire deployment is managed via Terraform and Ansible, ensuring the SIEM can be wiped and re-provisioned from scratch within 12 minutes."
      }
    ]
  },
  { slug: "wazuh", category: "Detection", name: "Wazuh", role: "EDR / HIDS", notes: "Endpoint telemetry across the lab - process trees, file integrity, syscalls.", stage: "available" },
  { slug: "sigma-rules", category: "Detection", name: "Sigma rule library", role: "Detection-as-code", notes: "Hand-written rule set covering the techniques exercised in the lab tracks.", stage: "available" },
  // Identity
  { slug: "bloodhound-ce", category: "Identity", name: "BloodHound CE", role: "AD graph", notes: "Privilege-path analysis on the AD environment for both red and blue exercises.", stage: "available" },
  { slug: "keycloak", category: "Identity", name: "Keycloak", role: "OIDC / OAuth", notes: "Local OIDC provider used for OAuth lab tracks and federation experiments.", stage: "build" },
  // Network
  { slug: "suricata", category: "Network", name: "Suricata", role: "IDS", notes: "Lab-edge IDS with custom rules tuned against the documented exploit chains.", stage: "available" },
  { slug: "zeek", category: "Network", name: "Zeek", role: "Network analytics", notes: "Protocol-aware analysis on lab traffic for forensics and detection engineering.", stage: "available" },
  // Tooling
  { slug: "misp", category: "Tooling", name: "MISP", role: "Threat intel", notes: "Local MISP instance for IOC management and OSINT case enrichment.", stage: "available" },
  { slug: "opencti", category: "Tooling", name: "OpenCTI", role: "Intel modeling", notes: "STIX-shaped storage of actor, infrastructure, and TTP relationships from OSINT work.", stage: "available" },
];

export const homeLabRepos = [
  { name: "bsc-homelab-infra", lang: "HCL", note: "Terraform + Ansible for the lab" },
  { name: "bsc-detection-rules", lang: "YAML", note: "Sigma + Elastic detection rules" },
  { name: "bsc-ad-attack-scripts", lang: "Python", note: "AD walkthrough harnesses" },
  { name: "bsc-ai-security-toolkit", lang: "Python", note: "Adversarial-prompt regression suite" },
];

export function getHomeLabComponent(slug: string) {
  return homeLab.find((c) => c.slug === slug);
}
