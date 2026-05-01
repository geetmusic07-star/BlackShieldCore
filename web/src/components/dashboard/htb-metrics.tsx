import { getHTBProfile } from "@/lib/api/htb";
import { Terminal, Crosshair, Zap, ShieldAlert, Award } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

export async function HtbMetrics() {
  const data = await getHTBProfile();
  const profile = data.profile;

  // The HTB Omniscient / Guru ranks usually have a specific color map.
  // Using platform styling to match the BlackShield Core aesthetic.
  const rankColors: Record<string, string> = {
    "Omniscient": "from-[#FF4A5A] to-[#8C1621] text-[#FF4A5A]",
    "Guru": "from-[#FF4A5A] to-[#8C1621] text-[#FF4A5A]",
    "Elite": "from-[#5B8CFF] to-[#3A6CD9] text-[#5B8CFF]",
    "Pro": "from-[#00E676] to-[#009624] text-[#00E676]",
    "Hacker": "from-[#FF9800] to-[#E65100] text-[#FF9800]",
  };

  const rankGradient = rankColors[profile.rank] || "from-[color:var(--bsc-accent)] to-[color:var(--bsc-violet)]";
  const rankTextColor = rankColors[profile.rank]?.split(' ')[2] || "text-[color:var(--bsc-accent)]";

  return (
    <Reveal>
      <section className="relative overflow-hidden rounded-2xl border border-[color:var(--bsc-accent)]/20 bg-[color-mix(in_oklch,var(--bsc-surface)_70%,transparent)] p-6 transition-all hover:border-[color:var(--bsc-accent)]/40 hover:bg-[color-mix(in_oklch,var(--bsc-surface)_80%,transparent)]">
        {/* Subtle background glow based on rank */}
        <div className="absolute -right-20 -top-20 z-0 h-40 w-40 rounded-full bg-[color:var(--bsc-accent)] opacity-[0.03] blur-3xl" />
        
        <header className="relative z-10 flex items-center justify-between border-b border-white/[0.05] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02]">
              <Terminal size={14} className="text-[color:var(--bsc-text-1)]" />
            </div>
            <div>
              <h2 className="text-[14px] font-semibold tracking-[-0.012em] text-[color:var(--bsc-text-1)]">
                Active Operations
              </h2>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
                HackTheBox · Live Telemetry
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className={`text-[12px] font-mono font-bold uppercase tracking-wider ${rankTextColor}`}>
              {profile.rank}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
              Global Rank #{profile.ranking}
            </span>
          </div>
        </header>

        <div className="relative z-10 mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={<Crosshair size={13} />}
            label="System Owns"
            value={profile.system_owns.toString()}
            subtext={`${profile.system_bloods} Bloods`}
          />
          <MetricCard
            icon={<Zap size={13} />}
            label="User Owns"
            value={profile.user_owns.toString()}
            subtext={`${profile.user_bloods} Bloods`}
          />
          <MetricCard
            icon={<Award size={13} />}
            label="Respect"
            value={profile.respects.toString()}
            subtext="Platform Kudos"
          />
          <MetricCard
            icon={<ShieldAlert size={13} />}
            label="Rank Progress"
            value={`${profile.current_rank_progress}%`}
            subtext={`Req: ${profile.rank_ownership}`}
          />
        </div>

        {/* Progress Bar */}
        <div className="relative z-10 mt-5">
          <div className="mb-2 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider">
            <span className="text-[color:var(--bsc-text-3)]">{profile.rank}</span>
            <span className="text-[color:var(--bsc-text-3)]">{profile.next_rank !== "None" ? profile.next_rank : "MAX RANK"}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.04] border border-white/[0.02]">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${rankGradient} transition-all duration-1000 ease-out`}
              style={{ width: `${profile.current_rank_progress}%` }}
            />
          </div>
        </div>
      </section>
    </Reveal>
  );
}

function MetricCard({ icon, label, value, subtext }: { icon: React.ReactNode; label: string; value: string; subtext: string }) {
  return (
    <div className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-4">
      <div className="mb-2 flex items-center gap-2 text-[color:var(--bsc-text-3)]">
        {icon}
        <span className="text-[10px] font-mono uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-[20px] font-semibold text-[color:var(--bsc-text-1)]">
        {value}
      </div>
      <div className="mt-1 text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-4)]">
        {subtext}
      </div>
    </div>
  );
}
