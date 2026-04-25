export type Stage = "available" | "build" | "research" | "beta" | "planned";

export interface Lab {
  slug: string;
  title: string;
  category: "Web" | "Auth" | "Cloud" | "AI" | "Forensics" | "CTF";
  difficulty: "Easy" | "Medium" | "Hard";
  durationMinutes: number;
  xp: number;
  stage: Stage;
  summary: string;
  tags: string[];
  body?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  kicker: string;
  date: string;
  minutes: number;
  tags: string[];
  stage: Stage;
  excerpt: string;
  body?: string;
}

export interface ResearchNote {
  slug: string;
  title: string;
  type: "Deep Analysis" | "Technical Note" | "Architecture" | "Methodology";
  date: string;
  minutes: number;
  tags: string[];
  stage: Stage;
  abstract: string;
  findings?: string[];
  body?: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  category: "Supply Chain" | "Ransomware" | "AI" | "Insider" | "Cloud";
  date: string;
  minutes: number;
  stage: Stage;
  summary: string;
  attackVector: string;
  findings: string[];
  tags: string[];
  body?: string;
}

export interface Tool {
  slug: string;
  name: string;
  category: "Token" | "Crypto" | "SIEM" | "Recon" | "Offensive" | "Forensics";
  stage: Stage;
  description: string;
  tags: string[];
}

export interface Talk {
  slug: string;
  title: string;
  venue: string;
  date: string;
  duration: string;
  stage: Stage;
  summary: string;
  resources: { label: string; available: boolean }[];
}

export interface OsintCase {
  slug: string;
  caseId: string;
  title: string;
  category: "Phishing" | "Domain" | "Actor" | "Infrastructure" | "Supply Chain";
  status: "Active" | "Published" | "Closed";
  date: string;
  summary: string;
  findings: string[];
  tags: string[];
}

export interface HomeLabComponent {
  category: "Cyber Range" | "Detection" | "Identity" | "Network" | "Tooling";
  name: string;
  role: string;
  notes: string;
  stage: Stage;
}
