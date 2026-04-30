"use client";

const integrations = [
  "Splunk", "Elastic", "Microsoft Sentinel", "CrowdStrike", "SentinelOne",
  "Palo Alto Cortex XDR", "Wiz", "Snyk", "Cloudflare WAF", "AWS GuardDuty",
  "Azure Defender", "Okta", "Auth0", "Datadog", "Zeek", "Suricata",
  "BloodHound CE", "MISP", "OpenCTI",
];

export function CapabilityTicker() {
  const items = [...integrations, ...integrations];
  return (
    <section className="relative border-y border-white/[0.06] bg-[color-mix(in_oklch,var(--bsc-void)_85%,black)] py-7">
      <div className="mb-4 text-center text-[10px] font-mono uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
        Designed to integrate across your stack
      </div>
      <div
        className="relative mask-fade overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <div className="flex animate-[bsc-tick_55s_linear_infinite] gap-10 whitespace-nowrap will-change-transform">
          {items.map((t, i) => (
            <span
              key={`${t}-${i}`}
              className="inline-flex items-center gap-2.5 text-[14px] font-medium tracking-[-0.01em] text-[color:var(--bsc-text-2)]"
            >
              <span className="size-1 rounded-full bg-[color:var(--bsc-accent)]/60" />
              {t}
            </span>
          ))}
        </div>
      </div>
      <style>{`@keyframes bsc-tick { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </section>
  );
}
