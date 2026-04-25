import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ListingLayout } from "@/components/listings/listing-layout";
import { Reveal } from "@/components/ui/reveal";
import { StatusBadge } from "@/components/ui/status-badge";
import { aiExperiments } from "@/content/ai-experiments";

export const metadata: Metadata = {
  title: "AI Security",
  description:
    "Curated AI security experiments — prompt injection, phishing detection, log anomaly, and malware static classification.",
};

export default function AISecurityPage() {
  return (
    <ListingLayout
      eyebrow="AI Security"
      title={
        <>
          Adversarial AI,
          <br />
          <span className="text-[color:var(--bsc-text-3)]">treated as a security surface.</span>
        </>
      }
      lede="Curated experiments in adversarial AI — prompt injection, phishing classification, log anomaly detection, and static malware scoring. Each is a documented walkthrough with sample inputs, sample outputs, and the methodology behind it."
    >
      <Container>
        <div className="space-y-4">
          {aiExperiments.map((e, i) => (
            <Reveal key={e.slug} delay={i * 0.04}>
              <article className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[color-mix(in_oklch,var(--bsc-surface)_72%,transparent)]">
                <div className="grid gap-px bg-white/[0.05] md:grid-cols-[1.2fr_1fr]">
                  {/* Left: title + description + notes */}
                  <div className="bg-[color-mix(in_oklch,var(--bsc-surface)_70%,transparent)] p-7">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-violet)]">
                        {e.category}
                      </span>
                      <StatusBadge variant={e.stage} />
                    </div>
                    <h2 className="mt-3 text-[20px] font-semibold leading-[1.2] tracking-[-0.018em] text-[color:var(--bsc-text-1)]">
                      {e.title}
                    </h2>
                    <p className="mt-3 text-[14px] leading-relaxed text-[color:var(--bsc-text-2)]">
                      {e.description}
                    </p>
                    <ul className="mt-5 space-y-2">
                      {e.notes.map((n) => (
                        <li
                          key={n}
                          className="flex items-start gap-2.5 text-[12.5px] leading-[1.55] text-[color:var(--bsc-text-3)]"
                        >
                          <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[color:var(--bsc-violet)]" />
                          {n}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Right: sample input/output */}
                  <div className="bg-[color-mix(in_oklch,var(--bsc-surface)_60%,transparent)] p-7">
                    <div className="space-y-3">
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-text-3)]">
                          {e.inputLabel}
                        </div>
                        <pre className="mt-2 overflow-x-auto rounded-lg border border-white/[0.05] bg-[color-mix(in_oklch,var(--bsc-void)_55%,transparent)] p-3 font-mono text-[11.5px] leading-[1.65] text-[color:var(--bsc-text-2)] whitespace-pre-wrap">
{e.inputSample}
                        </pre>
                      </div>
                      <div>
                        <div className="text-[10px] font-mono uppercase tracking-wider text-[color:var(--bsc-accent)]">
                          {e.outputLabel}
                        </div>
                        <pre className="mt-2 overflow-x-auto rounded-lg border border-white/[0.05] bg-[color-mix(in_oklch,var(--bsc-void)_55%,transparent)] p-3 font-mono text-[11.5px] leading-[1.65] text-[color:var(--bsc-accent)] whitespace-pre-wrap">
{e.outputSample}
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-12 text-center text-[12.5px] text-[color:var(--bsc-text-3)]">
            All experiments are curated walkthroughs. Each will publish full reproducibility
            notes and code as it stabilises.
          </p>
        </Reveal>
      </Container>
    </ListingLayout>
  );
}
