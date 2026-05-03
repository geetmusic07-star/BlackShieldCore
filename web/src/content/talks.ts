import type { Talk } from "./types";

export const talks: Talk[] = [
  {
    slug: "attacking-llm-agents-bsides-2026",
    title: "Attacking LLM Agents in Production",
    venue: "BSides London 2026",
    date: "2026-04",
    duration: "45 min",
    stage: "available",
    summary:
      "Three production-viable attack chains against LLM agents with external tool access. Walkthrough escalating indirect injection to data exfiltration.",
    resources: [
      { label: "Slides", available: false },
      { label: "Recording", available: false },
      { label: "Demo Repo", available: false },
    ],
    body: [
      { kind: "p", value: "This talk covers the practical exploitation of LLM agents hooked into enterprise APIs." },
      { kind: "h2", value: "The Attack Chains" },
      { kind: "p", value: "We walked through three distinct scenarios during the presentation." },
      { kind: "ul", items: [
        "Cross-Plugin Request Forgery (CPRF)",
        "Data Exfiltration via Markdown Images",
        "Indirect Prompt Injection leading to RCE"
      ]},
      { kind: "callout", tone: "warn", value: "The demo environment used live models; your reproduction results may vary depending on model updates." },
    ],
  },
  {
    slug: "detection-engineering-steelcon-2025",
    title: "Detection Engineering at Scale",
    venue: "SteelCon 2025",
    date: "2025-07",
    duration: "30 min",
    stage: "available",
    summary:
      "Writing Sigma rules that survive red-team validation - architectural patterns, review loops, and KPI-driven rule design.",
    resources: [
      { label: "Slides", available: false },
      { label: "Recording", available: false },
    ],
    body: [
      { kind: "p", value: "This talk started from a year of watching detection rules ship that had never been tested in production. The core problem is not writing bad rules; it is shipping them without any mechanism to discover they are broken until an attacker walks through the gap." },
      { kind: "h2", value: "The architectural pattern" },
      { kind: "p", value: "Mature detection stacks treat rules as code: they live in version control, they go through a review process, and they have a defined lifecycle from research to production. The talk introduced a three-stage pipeline: red team exercise, rule hypothesis, staging validation, production deployment." },
      { kind: "code", lang: "yaml", value: "# Rule lifecycle metadata\nstage: staging          # research | staging | production\ncoverage:\n  log_source: sysmon\n  event_ids: [1, 10]\n  fleet_pct: 78        # validated against production telemetry\nkpi:\n  fp_rate: 2.3         # false positives per 100 alerts (30-day trailing)\n  tn_rate: 97.8" },
      { kind: "h2", value: "KPI-driven review" },
      { kind: "p", value: "The KPI framework was the centrepiece of the talk. Every rule in production carries two metrics: false positive rate (FPs per 100 alerts over the trailing 30 days) and telemetry coverage (percentage of fleet where the required log source is confirmed flowing). A rule with excellent logic and 30% fleet coverage is a 30% detection at best. That number belongs on the rule." },
      { kind: "callout", tone: "tip", value: "Any rule with a false positive rate above 10% does not belong in the alerting tier. Move it to a hunting library. Run it on demand against historical data. Do not let it drain analyst attention on a continuous basis - that drain destroys morale faster than any individual bad rule." },
      { kind: "h2", value: "What the audience pushed back on" },
      { kind: "p", value: "The sharpest question from the floor: 'This sounds like engineering process. Our team does not have time for process.' The answer: detection without process has a failure mode too. You find out about it during an incident. Engineering process exists to avoid the more expensive recovery process. The question is not whether you can afford the process; it is whether you can afford to skip it." },
    ],
  },
  {
    slug: "kerberoasting-defcon-2025",
    title: "Kerberoasting Beyond RC4",
    venue: "DEF CON Blue Team Village 2025",
    date: "2025-08",
    duration: "25 min",
    stage: "available",
    summary:
      "Hunting AES-encrypted service-ticket extraction and the detection patterns that actually hold up in real AD environments.",
    resources: [
      { label: "Slides", available: false },
      { label: "Demo", available: false },
    ],
    body: [
      { kind: "p", value: "The title was chosen deliberately. Most Kerberoasting talks are about the attack. This one started from a different question: what happens after you enforce AES-only encryption across your environment? Many teams assume AES makes them immune. It changes the economics. It does not close the window." },
      { kind: "h2", value: "The AES assumption" },
      { kind: "p", value: "RC4-based Kerberoasting is fast to crack because hashcat mode 13100 processes hundreds of millions of candidates per second on modest GPU hardware. AES-256 (mode 19700) is around 30x slower. This is real protection for accounts with cryptographically strong passwords. It is not protection for service accounts with dictionary-derivable passwords - even 20-character ones - because dictionaries contain long passwords too." },
      { kind: "code", lang: "shell", value: "# AES-only environment, 'strong' password\n$ hashcat -m 19700 svc_ticket.hash company-wordlist.txt\n\n  Speed.#1.........:  3,840 kH/s\n  Recovered........: 1/1 (100.00%)\n\n  svc_exchange_prod:Company@2022Quarter3!" },
      { kind: "callout", tone: "warn", value: "Any password composed by a human under a rotation policy is potentially in a wordlist. Humans under rotation policies generate predictable patterns: capitalised first word, appended year or quarter, trailing symbol. AES makes cracking slower. It does not make weak passwords uncrackable." },
      { kind: "h2", value: "Detection that holds up" },
      { kind: "p", value: "The second half covered detection. RC4 Kerberoasting generates TGS-REQ events (Event ID 4769) with enc_type 0x17, a well-known signal. For AES-only environments, the discriminating signal is request volume and velocity from a single account. The threshold between legitimate bulk TGS requests and a roasting run is environment-specific, which means if you have not baselined it, you do not have a rule for it." },
      { kind: "p", value: "The Blue Team Village audience had good coverage of the tooling side. The less-rehearsed discussion was about baselining. How many TGS requests per minute is normal for your Tier 0 service accounts? If you cannot answer that, you cannot write a useful rule for this technique." },
    ],
  },
  {
    slug: "ai-red-teaming-black-hat-2025",
    title: "Automated Red Teaming of AI Workloads",
    venue: "Black Hat USA 2025",
    date: "2025-08",
    duration: "50 min",
    stage: "available",
    summary:
      "A deep dive into adversarial generation frameworks used to bypass safety filters on modern foundation models.",
    resources: [
      { label: "Slides", available: false },
      { label: "Recording", available: false },
    ],
    body: [
      { kind: "p", value: "This talk came from a year of running adversarial generation at scale against production AI workloads. The central finding: the safety research community and the deployment engineering community are solving different problems, and the gap between them is where most production bypasses live." },
      { kind: "h2", value: "Adversarial generation vs enumeration" },
      { kind: "p", value: "Most red-team work against LLMs is enumeration: try known jailbreak patterns and record which ones work. Adversarial generation is different. You use a second model to automatically produce variations on working bypasses, optimising each variation against the target's refusal signals. This moves from 'can a human find a bypass' to 'can a machine sweep the full prompt space'." },
      { kind: "code", lang: "python", value: "# Simplified adversarial generation loop\nwhile refusal_rate > threshold:\n    candidate = attacker_model.generate(\n        base_prompt=working_bypass,\n        mutation_strategy=current_strategy,\n        avoid_patterns=known_refusal_triggers,\n    )\n    result = target_model.evaluate(candidate)\n    if result.bypassed:\n        working_bypass = candidate\n        bypass_history.append(candidate)" },
      { kind: "h2", value: "What the framework found" },
      { kind: "p", value: "Across eight production deployments tested during the research phase, the framework found a working bypass in every one. Time-to-first-bypass ranged from under a second (no RLHF hardening) to around 40 minutes (active content filtering, hardened RLHF). No deployment was immune to sustained automated attack." },
      { kind: "callout", tone: "warn", value: "The implication for deployers: your safety posture needs to assume bypasses will be found, and your defence-in-depth must operate downstream of the model. Logging, output filtering, and capability restriction are not alternatives to model hardening. They are the layer that catches what model hardening misses." },
      { kind: "h2", value: "What this means for deployment" },
      { kind: "p", value: "Treat LLM safety as a probability distribution, not a binary control. A bypass that requires 40 minutes of sustained automated attack represents a fundamentally different threat model than one achievable by hand in five minutes. Your risk posture should reflect that distinction - not every bypass class warrants the same mitigation priority." },
    ],
  },
  {
    slug: "cloud-breach-sim-rsa-2026",
    title: "Cloud Breach Simulation and the Modern SIEM",
    venue: "RSA Conference 2026",
    date: "2026-05",
    duration: "40 min",
    stage: "planned",
    summary:
      "Upcoming talk on simulating large-scale AWS/Azure breaches to stress-test detection engineering pipelines.",
    resources: [
      { label: "Slides", available: false },
      { label: "Recording", available: false },
    ],
    body: [
      { kind: "p", value: "This is an upcoming talk at RSA Conference 2026. The abstract and main arguments are documented here ahead of the event. Slides and recording will be linked after the presentation." },
      { kind: "h2", value: "The central argument" },
      { kind: "p", value: "Most SIEM deployments are implicitly tested against on-premises attacker models: lateral movement in AD, endpoint compromise, exfiltration over SMB. Cloud breach has a different shape - control plane abuse, identity federation attacks, pivots through managed services - and most production SIEMs are undertested against it." },
      { kind: "p", value: "The talk proposes a simulation framework for cloud breach scenarios: define the attacker objective, enumerate the control-plane and data-plane actions required, and map each action to the CloudTrail or Azure Activity log events it generates. Then check whether your SIEM actually fires on those events." },
      { kind: "h2", value: "Why simulation is better than red-team for detection validation" },
      { kind: "p", value: "Red-team exercises validate whether an attacker can achieve an objective. Breach simulation validates whether the SIEM can see it. These are different questions. A red-team may achieve an objective via an unanticipated path that the SIEM happens to cover. A simulation deliberately exercises each path you need to cover and checks coverage directly." },
      { kind: "callout", tone: "note", value: "This talk will include a live demonstration against a staged AWS environment. The simulation framework will be released as open source at the time of the presentation." },
    ],
  },
];

export function getTalk(slug: string) {
  return talks.find((t) => t.slug === slug);
}
