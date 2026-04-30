import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { ListingLayout } from "@/components/listings/listing-layout";
import { Reveal } from "@/components/ui/reveal";
import { StatusBadge } from "@/components/ui/status-badge";
import { aiExperiments } from "@/content/ai-experiments";
import { InjectionSandbox } from "@/components/ai-security/injection-sandbox";
import { JailbreakRolodex } from "@/components/ai-security/jailbreak-rolodex";
import { InjectionRange } from "@/components/ai-security/injection-range";

export const metadata: Metadata = {
  title: "AI Security",
  description:
    "Adversarial AI as a security surface - live prompt-injection sandbox, jailbreak rolodex, and curated red-team experiments.",
};

export default function AISecurityPage() {
  return (
    <ListingLayout
      eyebrow="AI Security"
      title={
        <>
          Adversarial AI,
          <br />
          <span className="text-[color:var(--bsc-text-3)]">
            treated as a security surface.
          </span>
        </>
      }
      lede="Three escalating surfaces in one place. A browser-side prompt-injection classifier you can probe directly; a curated rolodex of documented jailbreak techniques to study; and the Indirect Injection Range - a five-level adversarial CTF where you play attacker against a simulated agent with progressively stacked defenses. Curated red-team experiments at the bottom document the methodology."
    >
      {/* ─────────────── 1. Live Sandbox ─────────────── */}
      <Container>
        <Reveal>
          <SectionHeader
            eyebrow="01 · Live"
            title="Prompt-injection sandbox"
            sub="Type or paste a prompt. The classifier runs entirely in your browser, scoring against the rule catalogue used in the production filter. Pick a preset to see what classic attacks look like under inspection."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <InjectionSandbox />
        </Reveal>
      </Container>

      {/* ─────────────── 2. Jailbreak Rolodex ─────────────── */}
      <Container className="mt-24">
        <Reveal>
          <SectionHeader
            eyebrow="02 · Catalogue"
            title="Jailbreak rolodex"
            sub="Documented attack techniques against LLM safety, organised by category and effectiveness. Search by name, mechanism, or payload shape; click any entry to see sanitised illustrations and mitigation guidance."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <JailbreakRolodex />
        </Reveal>
      </Container>

      {/* ─────────────── 3. Indirect Injection Range ─────────────── */}
      <Container className="mt-24">
        <Reveal>
          <SectionHeader
            eyebrow="03 · Range"
            title="Indirect Injection Range - adversarial CTF"
            sub="Five progressively harder levels against a simulated agent named Atlas. Each level adds one defense layer (hidden-content scrubber → URL blocklist → tool gating → intent classifier), and each requires a genuinely different bypass to clear. Edit the page payload, watch Atlas's full processing trace, and capture the per-level flag."
          />
        </Reveal>
        <Reveal delay={0.05}>
          <InjectionRange />
        </Reveal>
      </Container>

      {/* ─────────────── 4. Curated Experiments ─────────────── */}
      <Container className="mt-24">
        <Reveal>
          <SectionHeader
            eyebrow="04 · Methodology"
            title="Curated AI security experiments"
            sub="Walkthroughs of the classifiers, detectors, and scoring methods behind the surfaces above. Each experiment publishes its own input/output samples, signals, and reproducibility notes."
          />
        </Reveal>

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
            All experiments are curated walkthroughs. Each will publish full
            reproducibility notes and code as it stabilises.
          </p>
        </Reveal>
      </Container>
    </ListingLayout>
  );
}

function SectionHeader({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub: string;
}) {
  return (
    <div className="mb-8 max-w-3xl">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--bsc-text-3)]">
        {eyebrow}
      </div>
      <h2 className="mt-2 text-[clamp(24px,3.2vw,32px)] font-semibold tracking-[-0.018em] text-[color:var(--bsc-text-1)]">
        {title}
      </h2>
      <p className="mt-3 text-[14.5px] leading-relaxed text-[color:var(--bsc-text-2)]">
        {sub}
      </p>
    </div>
  );
}
