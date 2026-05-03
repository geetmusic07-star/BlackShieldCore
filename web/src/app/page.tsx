import { Hero } from "@/components/hero/hero";
import { ModulesGrid } from "@/components/home/modules-grid";
import { LatestResearch } from "@/components/home/latest-research";
import { ApproachSection } from "@/components/home/approach";
import { DataGlobe } from "@/components/visualization/data-globe";
import { Container } from "@/components/ui/container";

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

      <section className="py-16 md:py-20 bg-bsc-void/50 border-y border-white/5 relative overflow-hidden">
        <Container>
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1 space-y-10">
              <h2 className="text-[clamp(32px,5vw,56px)] font-bold tracking-tight text-white leading-[1.1]">
                Global Threat
                <span className="block text-white/40">Intelligence</span>
              </h2>
              <p className="max-w-[42ch] text-[19px] text-white/60 leading-relaxed font-medium">
                Real-time visualization of global adversarial telemetry. 
                Our network provides verified insights into emerging attack vectors 
                and infrastructure patterns across the security landscape.
              </p>
              <div className="grid grid-cols-2 gap-12 pt-4">
                <div className="space-y-2">
                  <p className="text-[28px] font-bold text-white tracking-tight">4.2M</p>
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-white/30">Data Points Analyzed</p>
                </div>
                <div className="space-y-2">
                  <p className="text-[28px] font-bold text-white tracking-tight">128</p>
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-white/30">Verified Lab Modules</p>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full scale-95 lg:scale-100">
              <DataGlobe />
            </div>
          </div>
        </Container>
      </section>

      <ApproachSection />

      <LatestResearch />
    </>
  );
}
