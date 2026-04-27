import type { LabProfile } from "./types";
import { JWT_EXPLOIT } from "./jwt-exploit";
import { GRAPHQL_ABUSE } from "./graphql-abuse";
import { SSRF_METADATA } from "./ssrf-metadata";

export type { LabProfile, Chapter, Question, BodyBlock, CalloutTone, ChapterKind, PracticalKind } from "./types";

const ALL_PROFILES: LabProfile[] = [JWT_EXPLOIT, GRAPHQL_ABUSE, SSRF_METADATA];

/**
 * Pick the right lab profile for a given lab. Matching is keyword-based on the
 * lab title so it survives database UUIDs changing across environments.
 *
 * Falls back to the JWT profile if nothing matches — the JWT lab is the most
 * polished and serves as a sensible default for any unknown lab.
 */
export function getLabProfile(lab: { title?: string } | null | undefined): LabProfile {
  const t = (lab?.title ?? "").toLowerCase();
  if (t.includes("graphql")) return GRAPHQL_ABUSE;
  if (t.includes("ssrf") || t.includes("metadata")) return SSRF_METADATA;
  if (t.includes("jwt") || t.includes("token")) return JWT_EXPLOIT;
  return JWT_EXPLOIT;
}

export { JWT_EXPLOIT, GRAPHQL_ABUSE, SSRF_METADATA, ALL_PROFILES };
