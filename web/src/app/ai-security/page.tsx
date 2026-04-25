import type { Metadata } from "next";
import { PreviewPage } from "@/components/site/preview-page";

export const metadata: Metadata = {
  title: "AI Security",
  description: "LLM red-teaming, adversarial ML experiments, and AI security research.",
};

export default function AISecurityPage() {
  return (
    <PreviewPage
      eyebrow="AI Security Lab"
      title={
        <>
          LLM red-teaming,
          <br />
          <span className="text-[color:var(--bsc-accent)]">as a surface.</span>
        </>
      }
      lede="Hands-on adversarial AI work — prompt-injection taxonomy, indirect-injection demos, phishing classifiers, and adversarial evaluation harnesses. Grounded in documented attack patterns and real model behavior."
      stage="build"
      roadmap={[
        "Indirect prompt injection lab — four-step escalation against a tool-using agent",
        "Phishing classifier with detection-layer explanations and false-positive scoring",
        "Adversarial prompt taxonomy writeup and bypass regression harness",
        "Log anomaly detection: transformer-on-SIEM-logs experiment with recall scoring",
      ]}
      continueTo={{ href: "/research", label: "Read the research notes instead" }}
    />
  );
}
