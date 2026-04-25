import { Hero } from "@/components/hero/hero";
import { CapabilityTicker } from "@/components/home/capability-ticker";
import { AttackHypervisorSection } from "@/components/home/attack-hypervisor";
import { WorkflowSection } from "@/components/home/workflow";
import { ModulesGrid } from "@/components/home/modules-grid";
import { CoverageStrip } from "@/components/home/coverage-strip";
import { AIRedTeamSection } from "@/components/home/ai-redteam";
import { ThreatIntelSection } from "@/components/home/threat-intel";
import { DashboardPreviewSection } from "@/components/home/dashboard-preview";
import { LatestResearch } from "@/components/home/latest-research";
import { EnterpriseTrustSection } from "@/components/home/enterprise-trust";
import { FinalCTASection } from "@/components/home/final-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CapabilityTicker />
      <AttackHypervisorSection />
      <WorkflowSection />
      <ModulesGrid />
      <CoverageStrip />
      <AIRedTeamSection />
      <ThreatIntelSection />
      <DashboardPreviewSection />
      <LatestResearch />
      <EnterpriseTrustSection />
      <FinalCTASection />
    </>
  );
}
