import type { Metadata } from "next";
import { OsintDirectory } from "@/components/osint/osint-directory";
import { osintTools } from "@/content/osint";
import { ThreatDashboard } from "@/components/osint/threat-dashboard";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "OSINT & Live Threat Intelligence",
  description:
    "Real-time global cyber threat map and OSINT tool directory. Powered by BlackShield threat intelligence network.",
};

export default function OsintPage() {
  return (
    <>
      {/* Hero text — constrained width */}
      <section className="pt-28 pb-6 md:pt-36 md:pb-8">
        <Container>
          <div className="flex items-end justify-between gap-8 flex-wrap">
            <div className="max-w-[640px]">
              <div className="flex items-center gap-3 mb-4">
                <span className="font-sans text-[12px] font-semibold uppercase tracking-[0.2em] text-white/40">
                  Intelligence Network
                </span>
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-emerald-400/20 bg-emerald-400/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300/80">Live</span>
                </span>
              </div>
              <h1 className="text-[clamp(28px,4.5vw,48px)] font-bold tracking-[-0.03em] text-white leading-[1.05]">
                Live Cyber Threat Intelligence
              </h1>
              <p className="mt-5 text-[15px] md:text-[16px] leading-[1.55] text-white/55 max-w-[58ch]">
                Near real-time global attack telemetry, port scan analysis, and application violation tracking.
                Powered by BlackShield&apos;s global sensor network.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Full-width dashboard — touches both edges like Radware */}
      <section className="border-b border-white/5">
        <ThreatDashboard />
      </section>

      <OsintDirectory tools={osintTools} />
    </>
  );
}
