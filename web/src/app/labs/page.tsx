import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { LabCard } from "@/components/labs/lab-card";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Labs",
  description:
    "Hands-on offensive security scenarios: web exploitation, auth bypasses, cloud abuse, and AI adversarial work.",
};

// ✅ Import the official Lab type which includes all required fields
import type { Lab } from "@/content/types";

export default async function LabsPage() {
  const res = await fetch("http://localhost:3000/api/labs", {
    cache: "no-store",
  });

  const data = await res.json();

  // ✅ Helper to map difficulty to a category (fallback to "Web")
  const mapCategory = (difficulty: string): Lab["category"] => {
    switch (difficulty) {
      case "Easy":
        return "Web";
      case "Medium":
        return "Auth";
      case "Hard":
        return "Cloud";
      default:
        return "Web";
    }
  };

  // ✅ Typed formatting
  const formattedLabs: Lab[] = data.map((lab: any) => ({
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

  // ✅ Typed grouping – safe fallback for missing category
  const byCategory: Record<string, Lab[]> = {};

  formattedLabs.forEach((lab) => {
    // Ensure we always have a string key
    const cat = lab.category ?? "General";

    if (!byCategory[cat]) {
      byCategory[cat] = [];
    }
    byCategory[cat].push(lab);
  });


  return (
    <>
      <section className="relative pt-40 pb-16 md:pt-48 md:pb-20">
        <Container>
          <Reveal>
            <div className="mb-4 text-[10px] font-medium uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)] font-mono">
              Cyber Playground
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="max-w-3xl text-[clamp(40px,5.2vw,64px)] font-semibold leading-[1.04] tracking-[-0.028em] text-[color:var(--bsc-text-1)]">
              Offensive scenarios,
              <br />
              <span className="text-[color:var(--bsc-text-3)]">
                grounded in real attack patterns.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl text-[15px] md:text-base leading-relaxed text-[color:var(--bsc-text-2)]">
              Each lab reconstructs a documented vulnerability class. The goal is understanding
              — not payload memorization. Start with{" "}
              {formattedLabs[0]?.title || "your first lab"}, which is the first lab
              we have taken through to a finished, documented walkthrough.
            </p>
          </Reveal>
        </Container>
      </section>

      <div className="space-y-24 pb-32 md:space-y-28">
        {Object.entries(byCategory).map(([cat, items]) => (
          <section key={cat}>
            <Container>
              <div className="mb-6 flex items-baseline justify-between border-b border-white/[0.06] pb-3">
                <h2 className="text-[18px] font-semibold tracking-[-0.012em] text-[color:var(--bsc-text-1)]">
                  {cat}
                </h2>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
                  {items.length} labs
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((lab, i) => (
                  <LabCard key={lab.slug} lab={lab} index={i} />
                ))}
              </div>
            </Container>
          </section>
        ))}
      </div>
    </>
  );
}