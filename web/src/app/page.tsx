import { Hero } from "@/components/hero/hero";
import { ModulesGrid } from "@/components/home/modules-grid";
import { LatestResearch } from "@/components/home/latest-research";
import { ApproachSection } from "@/components/home/approach";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ModulesGrid />
      <ApproachSection />
      <LatestResearch />
    </>
  );
}
