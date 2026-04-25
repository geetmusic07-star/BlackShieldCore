import type { HomeLabComponent } from "./types";

export const homeLab: HomeLabComponent[] = [
  // Cyber range
  { category: "Cyber Range", name: "Proxmox VE", role: "Hypervisor", notes: "Hosts the AD lab, target VMs, and isolated attack-surface segments.", stage: "available" },
  { category: "Cyber Range", name: "Windows AD (2-DC, 6-host)", role: "Target environment", notes: "Two-domain Active Directory with realistic GPO and service-account misconfigurations.", stage: "available" },
  { category: "Cyber Range", name: "Linux target stack", role: "Target environment", notes: "Web app, DB, message bus, and SSRF/SSRF-adjacent edge surfaces for lab work.", stage: "available" },
  // Detection
  { category: "Detection", name: "Elastic Stack", role: "SIEM", notes: "Centralised log ingestion, detection-as-code rules, and lab telemetry visualisation.", stage: "available" },
  { category: "Detection", name: "Wazuh", role: "EDR / HIDS", notes: "Endpoint telemetry across the lab — process trees, file integrity, syscalls.", stage: "available" },
  { category: "Detection", name: "Sigma rule library", role: "Detection-as-code", notes: "Hand-written rule set covering the techniques exercised in the lab tracks.", stage: "available" },
  // Identity
  { category: "Identity", name: "BloodHound CE", role: "AD graph", notes: "Privilege-path analysis on the AD environment for both red and blue exercises.", stage: "available" },
  { category: "Identity", name: "Keycloak", role: "OIDC / OAuth", notes: "Local OIDC provider used for OAuth lab tracks and federation experiments.", stage: "build" },
  // Network
  { category: "Network", name: "Suricata", role: "IDS", notes: "Lab-edge IDS with custom rules tuned against the documented exploit chains.", stage: "available" },
  { category: "Network", name: "Zeek", role: "Network analytics", notes: "Protocol-aware analysis on lab traffic for forensics and detection engineering.", stage: "available" },
  // Tooling
  { category: "Tooling", name: "MISP", role: "Threat intel", notes: "Local MISP instance for IOC management and OSINT case enrichment.", stage: "available" },
  { category: "Tooling", name: "OpenCTI", role: "Intel modeling", notes: "STIX-shaped storage of actor, infrastructure, and TTP relationships from OSINT work.", stage: "available" },
];

export const homeLabRepos = [
  { name: "bsc-homelab-infra", lang: "HCL", note: "Terraform + Ansible for the lab" },
  { name: "bsc-detection-rules", lang: "YAML", note: "Sigma + Elastic detection rules" },
  { name: "bsc-ad-attack-scripts", lang: "Python", note: "AD walkthrough harnesses" },
  { name: "bsc-ai-security-toolkit", lang: "Python", note: "Adversarial-prompt regression suite" },
];
