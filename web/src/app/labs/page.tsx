import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { LabCard } from "@/components/labs/lab-card";
import { Reveal } from "@/components/ui/reveal";
import type { Lab, Stage } from "@/content/types";
import { createClient } from "@supabase/supabase-js";
import { ListingLayout } from "@/components/listings/listing-layout";

export const metadata: Metadata = {
  title: "Labs",
  description:
    "Hands-on offensive security scenarios: web exploitation, auth bypasses, cloud abuse, and AI adversarial work.",
};

export interface SupabaseLabRow {
  id: string | number;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  durationMinutes?: number;
  xp?: number;
  stage?: Stage;
  summary?: string;
  tags?: string[];
}


const categoryMeta: Record<string, { desc: string; color: string }> = {
  Web: {
    desc: "SQL injection, XSS, IDOR, deserialization, and server-side request forgery — scenarios built from real CVE chains.",
    color: "var(--bsc-accent)",
  },
  Auth: {
    desc: "OAuth misconfigurations, JWT forgery, Kerberoasting, and session fixation attacks with full detection coverage.",
    color: "var(--bsc-amber)",
  },
  Cloud: {
    desc: "AWS IAM escalation, Azure privilege abuse, and Kubernetes escape scenarios drawn from cloud-native incident reports.",
    color: "var(--bsc-violet)",
  },
  "AI / ML": {
    desc: "Prompt injection, jailbreak chains, model extraction, and adversarial input attacks against LLM-backed applications.",
    color: "var(--bsc-rose)",
  },
  General: {
    desc: "Cross-surface attack chains and multi-step exploitation scenarios combining web, auth, and infrastructure techniques.",
    color: "var(--bsc-text-3)",
  },
};

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.1] bg-[color-mix(in_oklch,var(--bsc-surface)_50%,transparent)] px-8 py-20 text-center">
      <div className="mb-4 grid size-12 place-items-center rounded-xl border border-white/[0.1] bg-white/[0.03]">
        <svg viewBox="0 0 24 24" className="size-5 fill-none stroke-[color:var(--bsc-accent)]" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      </div>
      <p className="text-[15px] font-semibold text-[color:var(--bsc-text-1)]">Labs are loading</p>
      <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-[color:var(--bsc-text-3)]">
        Scenarios are being provisioned. Check back shortly or verify your environment configuration.
      </p>
    </div>
  );
}

export default async function LabsPage() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  let formattedLabs: Lab[] = [];
  let hasError = false;

  if (!supabaseUrl || !supabaseKey) {
    hasError = true;
  } else {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.from("labs").select("*");

    if (error || !data) {
      hasError = true;
    } else {
      const mapCategory = (difficulty: string): Lab["category"] => {
        switch (difficulty) {
          case "Easy":   return "Web";
          case "Medium": return "Auth";
          case "Hard":   return "Cloud";
          default:       return "Web";
        }
      };

      formattedLabs = data.map((lab: SupabaseLabRow) => ({
        slug: String(lab.id),
        title: lab.title,
        description: lab.description,
        difficulty: lab.difficulty,
        category: mapCategory(lab.difficulty),
        durationMinutes: lab.durationMinutes ?? 0,
        xp: lab.xp ?? 0,
        stage: lab.stage ?? "available",
        summary: lab.summary ?? "",
        tags: lab.tags ?? [],
      }));
    }
  }

  const byCategory: Record<string, Lab[]> = {};
  for (const lab of formattedLabs) {
    const cat = lab.category ?? "General";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(lab);
  }

  const totalLabs = formattedLabs.length;
  const easyCount = formattedLabs.filter((l) => l.difficulty === "Easy").length;
  const mediumCount = formattedLabs.filter((l) => l.difficulty === "Medium").length;
  const hardCount = formattedLabs.filter((l) => l.difficulty === "Hard").length;
  const categoryCount = Object.keys(byCategory).length;

  return (
    <ListingLayout
      eyebrow="Offensive Labs"
      title={
        <>
          Hands-on attack scenarios.
          <br />
          <span className="text-[color:var(--bsc-text-3)]">Grounded in real TTPs.</span>
        </>
      }
      lede="Structured offensive scenarios covering web exploitation, auth bypasses, cloud privilege escalation, and AI adversarial techniques — each mapped to documented attacker behavior and paired with detection engineering guidance."
    >
      {/* Stats bar */}
      {!hasError && totalLabs > 0 && (
        <Container>
          <Reveal>
            <div className="mb-16 grid grid-cols-2 gap-3 rounded-2xl border border-[color:var(--bsc-line)] bg-[color-mix(in_oklch,var(--bsc-surface)_60%,transparent)] p-5 sm:grid-cols-4">
              {[
                { value: totalLabs, label: "Total Scenarios", color: "var(--bsc-accent)" },
                { value: categoryCount, label: "Categories", color: "var(--bsc-violet)" },
                { value: easyCount || mediumCount, label: "Introductory", color: "var(--bsc-amber)" },
                { value: hardCount, label: "Advanced", color: "var(--bsc-rose)" },
              ].map(({ value, label, color }) => (
                <div key={label} className="text-center">
                  <div
                    className="text-[28px] font-semibold tracking-[-0.026em] tabular-nums"
                    style={{ color }}
                  >
                    {value}
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[color:var(--bsc-text-3)]">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      )}

      {/* Error / empty state */}
      {hasError && (
        <Container>
          <div className="mb-16 rounded-2xl border border-[color:var(--bsc-rose)]/20 bg-[color-mix(in_oklch,var(--bsc-rose)_5%,var(--bsc-surface))] p-6">
            <p className="font-mono text-[13px] text-[color:var(--bsc-rose)]">
              Environment configuration missing — check SUPABASE_URL and SUPABASE_ANON_KEY.
            </p>
          </div>
        </Container>
      )}

      {/* Lab categories */}
      <div className="space-y-20 pb-32">
        {Object.entries(byCategory).length === 0 && !hasError ? (
          <Container>
            <EmptyState />
          </Container>
        ) : (
          Object.entries(byCategory).map(([cat, items]) => {
            const meta = categoryMeta[cat] ?? categoryMeta.General;
            return (
              <section key={cat}>
                <Container>
                  {/* Category header */}
                  <Reveal>
                    <div className="mb-8 flex flex-col gap-3 border-b border-[color:var(--bsc-line)] pb-5 md:flex-row md:items-end md:justify-between">
                      <div>
                        <div className="mb-1.5 flex items-center gap-2.5">
                          <span
                            className="size-2 rounded-full"
                            style={{ background: meta.color, boxShadow: `0 0 8px ${meta.color}` }}
                          />
                          <h2
                            className="text-[13px] font-mono uppercase tracking-[0.14em]"
                            style={{ color: meta.color }}
                          >
                            {cat}
                          </h2>
                          <span className="rounded-full border border-white/[0.1] bg-white/[0.04] px-2 py-0.5 font-mono text-[10px] text-[color:var(--bsc-text-3)]">
                            {items.length} scenario{items.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <p className="max-w-lg text-[13px] leading-relaxed text-[color:var(--bsc-text-3)]">
                          {meta.desc}
                        </p>
                      </div>
                    </div>
                  </Reveal>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((lab, i) => (
                      <LabCard key={lab.slug} lab={lab} index={i} />
                    ))}
                  </div>
                </Container>
              </section>
            );
          })
        )}
      </div>
    </ListingLayout>
  );
}
