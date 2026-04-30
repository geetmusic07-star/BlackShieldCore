export type CalloutTone = "note" | "redflag" | "tip";

export type ChapterKind =
  | "briefing"
  | "threat"
  | "mechanics"
  | "exploit"
  | "debrief";

export type BodyBlock =
  | { kind: "h3"; value: string }
  | { kind: "p"; value: string }
  | { kind: "ul"; items: string[] }
  | { kind: "code"; value: string }
  | { kind: "callout"; tone: CalloutTone; value: string };

export type Question = {
  prompt: string;
  answer: string;
  placeholder?: string;
  hint?: string;
  xp?: number;
};

export type Chapter = {
  number: number;
  title: string;
  kind: ChapterKind;
  minutes: number;
  body: BodyBlock[];
  questions: Question[];
};

export type PracticalKind = "jwt" | "graphql" | "ssrf";

export type LabProfile = {
  // unique key for selector / routing
  key: string;
  // pretty target string shown in the BootLab launcher
  target: string;
  // canonical capture-the-flag string
  flag: string;
  // which practical UI to render in the play page
  practicalKind: PracticalKind;
  // categorisation surfaced in the brief
  category: string;
  // MITRE technique reference shown in the brief header
  mitre: string;
  chapters: Chapter[];
};
