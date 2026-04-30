import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { LabCard } from "@/components/labs/lab-card";
import { Reveal } from "@/components/ui/reveal";
import type { Lab } from "@/content/types";

export const metadata: Metadata = {
  title: "Labs",
  description:
    "Hands-on offensive security scenarios: web exploitation, auth bypasses, cloud abuse, and AI adversarial work.",
};

export default async function LabsPage() {
  const getBaseUrl = () => {
    if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
    return "http://localhost:3000";
  };

  const res = await fetch(`${getBaseUrl()}/api/labs`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.error("API failed:", res.status);
    return <div className="p-10 text-center">Failed to load labs</div>;
  }

  const data = await res.json();

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

  const byCategory: Record<string, Lab[]> = {};

  for (const lab of formattedLabs) {
    const cat = lab.category ?? "General";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(lab);
  }

  return (
    <>
      <section className="relative pt-40 pb-16 md:pt-48 md:pb-20">
        <Container>
          <Reveal>
            <div className="mb-4 text-[10px] font-mono uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
              Cyber Playground
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="text-[clamp(40px,5.2vw,64px)] font-semibold text-[color:var(--bsc-text-1)]">
              Offensive scenarios
              <br />
              <span className="text-[color:var(--bsc-text-3)]">
                grounded in real attack patterns
              </span>
            </h1>
          </Reveal>
        </Container>
      </section>

      <div className="space-y-24 pb-32">
        {Object.entries(byCategory).map(([cat, items]) => (
          <section key={cat}>
            <Container>
              <h2 className="mb-6 text-[18px] font-semibold">{cat}</h2>

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