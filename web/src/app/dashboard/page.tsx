import type { Metadata } from "next";
import { PreviewPage } from "@/components/site/preview-page";

export const metadata: Metadata = {
  title: "Threat Dashboard",
  description: "Aggregated CVE feeds, severity filtering, and threat signal surfaces.",
};

export default function DashboardPage() {
  return (
    <PreviewPage
      eyebrow="Threat Dashboard"
      title={
        <>
          Signal, not noise.
          <br />
          <span className="text-[color:var(--bsc-text-3)]">Threat intelligence surfaces.</span>
        </>
      }
      lede="Aggregated CVE feeds, severity filtering, infrastructure tracking, and coordinated detection coverage. Built for analysis, not decoration."
      stage="build"
      roadmap={[
        "CVE feed aggregation with CVSS filtering and exploit-maturity signals",
        "Actor and campaign tracking with infrastructure fingerprinting",
        "Detection-coverage scoring against MITRE ATT&CK technique mapping",
        "OSINT lookups chained with known IOC and phishing-kit fingerprint feeds",
      ]}
      continueTo={{ href: "/platform", label: "Back to the platform overview" }}
    />
  );
}
