export type Stage = "available" | "build" | "research" | "beta" | "planned";

export type LabCategory = "Web" | "Auth" | "Cloud" | "AI" | "Forensics" | "CTF";

export interface Lab {
  slug: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";

  // Optional from backend
  category?: LabCategory;
  durationMinutes?: number;
  xp?: number;
  stage?: Stage;
  summary?: string;

  // ⚠️ Make this ALWAYS safe
  tags: string[];

  body?: string;
}

export type BlogBlock =
  | { kind: "h2"; value: string }
  | { kind: "h3"; value: string }
  | { kind: "p"; value: string }
  | { kind: "ul"; items: string[] }
  | { kind: "ol"; items: string[] }
  | { kind: "code"; lang?: string; value: string }
  | { kind: "callout"; tone: "note" | "warn" | "tip"; value: string }
  | { kind: "quote"; value: string; cite?: string };

export interface BlogPost {
  slug: string;
  title: string;
  kicker: string;
  date: string;
  minutes: number;
  tags: string[];
  stage: Stage;
  excerpt: string;
  body?: BlogBlock[];
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
  body?: BlogBlock[];
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
  stage?: Stage;
  body?: BlogBlock[];
}

export interface HomeLabComponent {
  slug?: string;
  category: "Cyber Range" | "Detection" | "Identity" | "Network" | "Tooling";
  name: string;
  role: string;
  notes: string;
  stage: Stage;
  body?: BlogBlock[];
}