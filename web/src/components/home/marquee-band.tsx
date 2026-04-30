"use client";

const topics = [
  "Threat Intelligence",
  "Zero-Day Analysis",
  "Neural Network Defense",
  "Exploit Development",
  "Red Team Operations",
  "Adversarial ML",
  "SIEM Integration",
  "Cryptographic Audit",
  "Incident Response",
  "Supply Chain Security",
];

export function MarqueeBand() {
  return (
    <div className="relative border-y border-white/[0.06] bg-[color-mix(in_oklch,var(--bsc-void)_80%,black)] py-5 overflow-hidden">
      <div className="flex animate-[bsc-marquee_40s_linear_infinite] gap-10 whitespace-nowrap will-change-transform">
        {[...topics, ...topics].map((t, i) => (
          <span
            key={`${t}-${i}`}
            className="inline-flex items-center gap-3 text-[12px] font-mono tracking-wider uppercase text-[color:var(--bsc-text-3)]"
          >
            <span className="size-1 rounded-full bg-[color:var(--bsc-accent)]" />
            {t}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes bsc-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
