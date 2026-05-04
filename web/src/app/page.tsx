import { Hero } from "@/components/hero/hero";
import { ModulesGrid } from "@/components/home/modules-grid";
import { LatestResearch } from "@/components/home/latest-research";
import { ApproachSection } from "@/components/home/approach";


import { createClient } from "@supabase/supabase-js";
import { caseStudies } from "@/content/case-studies";
import { research } from "@/content/research";

export default async function HomePage() {
  // Fetch real counts
  let labsCount = 0;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { count } = await supabase.from("labs").select("*", { count: "exact", head: true });
    if (count !== null) labsCount = count;
  }

  const cvesCount = caseStudies.length + research.length; // Approximate "CVEs Analyzed" based on real content
  const whitepapersCount = research.filter(r => r.type === "Deep Analysis").length;
  const researchCount = research.length;

  const realStats: [number, string][] = [
    [labsCount, "Lab Tracks"],
    [cvesCount, "CVEs Analyzed"],
    [whitepapersCount, "Whitepapers"],
    [researchCount, "Research Modules"],
  ];

  return (
    <>
      <Hero stats={realStats} />
      
      <ModulesGrid />



      <ApproachSection />

      <LatestResearch />
    </>
  );
}
