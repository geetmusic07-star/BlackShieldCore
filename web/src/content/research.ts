import type { ResearchNote } from "./types";

export const research: ResearchNote[] = [
  {
    slug: "attack-path-modeling",
    title: "Attack Path Modeling in Segmented Enterprise Networks",
    type: "Deep Analysis",
    date: "2026-04-10",
    minutes: 35,
    tags: ["Active Directory", "Attack Paths"],
    stage: "available",
    abstract:
      "Maps how attackers traverse segmented environments using legitimate credentials, trusted tools, and protocol abuse rather than perimeter bypasses.",
    findings: [
      "Tier-0 asset exposure through transitive group membership in 6 of 8 lab simulations",
      "AS-REP Roasting effective against default configurations in all tested environments",
      "Constrained delegation abuse consistently underdetected across Elastic and Splunk baselines",
    ],
    attackChain: [
      { id: "recon", label: "AS-REP Roast", description: "Harvesting hashes from accounts not requiring pre-authentication." },
      { id: "pivot", label: "Delegation Abuse", description: "Leveraging constrained delegation to impersonate administrative users." },
      { id: "pwn", label: "Tier-0 Compromise", description: "Full takeover of Domain Controllers and identity infrastructure." },
    ],
    body: `Most lateral movement in segmented enterprise networks does not happen by exploiting the perimeter. It happens by walking privilege relationships that already exist - through transitive group membership, over-permissioned service accounts, and constrained delegation that was set up once and never reviewed.\n\nThis note maps four lab-recreated AD topologies, runs the same attacker workflow against each, and looks at where the attack succeeded, where it stalled, and what detection coverage existed against it.\n\n## Methodology\n\nFour AD topologies were built from real architectural patterns: a flat single-domain layout, a two-domain forest with one-way trust, a hub-and-spoke layout with a central admin domain, and a layered tier model. Each environment was instrumented identically with Elastic + Wazuh.\n\nThe attacker workflow used five stages: AS-REP Roasting → Kerberoasting → constrained delegation discovery → privilege-path traversal → Tier-0 asset access. The same scripts and the same telemetry stack across all four environments - only the AD shape changed.\n\n## Where the attack succeeded\n\nIn six of eight runs, transitive group membership exposed a Tier-0 asset within three hops. The simplest variant was a service account in a "service-admins" group that was, two layers up, a member of "Domain Admins" via nested groups added years earlier and never audited.\n\nAS-REP Roasting succeeded against the default configuration in all four topologies. Two of them used short, dictionary-derived passwords for service accounts; the other two had stronger passwords but still leaked the hash format, allowing offline workflow.\n\n## Where detection consistently failed\n\nThe most underdetected stage across all environments was constrained delegation abuse. The default Elastic and Splunk rule sets did not flag the Kerberos exchange pattern at all. Custom rules covered it, but only after the workflow had been exercised and explicitly mapped.\n\nThis matches a broader pattern: detection coverage drifts toward what teams have already seen. Environments that had previously responded to a Kerberoasting incident had strong rules for it, and weaker rules for everything adjacent.`,
  },
  {
    slug: "adversarial-prompt-taxonomy",
    title: "Adversarial Prompt Taxonomy: Classification and Bypass Analysis",
    type: "Technical Note",
    date: "2026-03-02",
    minutes: 22,
    tags: ["LLM", "AI Security"],
    stage: "build",
    abstract:
      "Structured classification of prompt injection and jailbreak techniques, mapped to the safety mechanism they bypass.",
  },
  {
    slug: "telemetry-coverage-gaps",
    title: "Telemetry Coverage Gaps in Standard SIEM Deployments",
    type: "Deep Analysis",
    date: "2026-02-14",
    minutes: 28,
    tags: ["SIEM", "Coverage"],
    stage: "build",
    abstract:
      "Systematic review of ATT&CK techniques consistently under-logged in baseline Elastic and Splunk deployments.",
  },
  {
    slug: "lab-design-tradeoffs",
    title: "Lab Design Tradeoffs: Realism vs. Safety in Cyber Range Environments",
    type: "Architecture",
    date: "2025-12-05",
    minutes: 15,
    tags: ["Lab", "Architecture"],
    stage: "build",
    abstract:
      "Design decisions in building offensive labs - balancing environmental realism against isolation and operational safety.",
  },

  // ─── New notes ───────────────────────────────────────────────────────────

  {
    slug: "rag-injection-vectors",
    title: "RAG Injection Vectors in Production LLM Pipelines",
    type: "Technical Note",
    date: "2026-04-28",
    minutes: 18,
    tags: ["LLM", "RAG", "Injection"],
    stage: "available",
    abstract:
      "Analysis of injection surface in retrieval-augmented generation systems: vector DB poisoning, context stuffing, and chunk boundary attacks.",
    findings: [
      "Adversarial embeddings bypassed similarity thresholds in 4 of 6 tested retrieval models",
      "Chunk boundary injection enables instruction smuggling in long-context retrievals",
      "RBAC on retrieved documents not propagated to generated output in 3 production-grade frameworks",
    ],
    body: `## What RAG adds to the attack surface

Retrieval-augmented generation introduces a new trust boundary that most teams haven't mapped: the vector database. The model receives retrieved chunks as context and treats them as background knowledge - but those chunks came from somewhere, and if they came from a source the attacker can influence, the model is now processing attacker-controlled content with system-level trust.

This is structurally identical to indirect prompt injection, but with an additional layer of indirection. The attack doesn't arrive through the user channel; it arrives through the retrieval channel, which most LLM security postures treat as trusted.

## Vector similarity bypass

Semantic similarity search is the mechanism that decides which chunks reach the model. The assumption baked into RAG pipelines is that similarity means relevance, and relevance implies safety. Neither is consistently true.

In our tests across six retrieval systems, we were able to craft adversarial embeddings that scored high similarity to legitimate query patterns while embedding instruction content. Four of six systems had no semantic filter downstream of retrieval, meaning any chunk that passed the similarity threshold arrived in the model context without further validation.

The attack surface is small but deterministic: if you can contribute content to the retrieval corpus - via a customer support form, a document upload, a publicly crawled source - you can preposition instruction content in the vector database and trigger it via specific queries.

## Chunk boundary injection

Chunking strategies create exploitable seams. When a document is split into fixed-length or semantically-bounded chunks, the boundary between a legitimate chunk and a subsequent adversarial one is invisible to the retrieval layer. The model receives both as context items with equivalent metadata.

The attack shape: a legitimate document segment establishes context trust, and the following chunk contains the injection payload. From the retrieval layer's perspective, these are two high-scoring matches for a relevant query. From the model's perspective, the second chunk is part of the same trustworthy source.

## RBAC gaps

Three of the production-grade RAG frameworks we tested applied RBAC at the retrieval query layer - users could only retrieve from documents their role permitted. None of the three propagated those permissions into the model's generation context. The generated response could reference and partially reproduce content from documents the user had no read permission on, because the retrieval gating was the only enforcement point.

This is not a bug in the frameworks; it's an architectural gap. The frameworks were designed to control what gets retrieved, not to reason about what gets generated. The assumption that retrieval-gating implies generation-gating is the mistake.

## What helps

Treating retrieved content as untrusted user input rather than trusted knowledge is the foundational change. Architecturally: separate the model instance that processes retrieved chunks from the model instance that generates user-facing output, and ensure the generation model cannot be instructed by retrieved content to change its behaviour. Practically: strip instruction-shaped patterns from retrieved chunks before injection into the context window, and log every retrieval event with the full chunk content for post-hoc review.`,
  },

  {
    slug: "iam-privilege-escalation",
    title: "IAM Privilege Escalation Patterns in AWS and Azure",
    type: "Deep Analysis",
    date: "2026-03-18",
    minutes: 30,
    tags: ["Cloud", "IAM", "AWS", "Azure"],
    stage: "available",
    abstract:
      "Enumeration and classification of privilege escalation paths using misconfigured IAM roles, policy mismatches, and service identity abuse across AWS and Azure.",
    findings: [
      "PassRole combined with AttachUserPolicy enables full privilege escalation in 78% of reviewed tenants",
      "Service-linked roles consistently bypassed in IAM audits due to their non-standard naming",
      "Azure Managed Identity token exchange viable via SSRF without outbound network restrictions",
    ],
    attackChain: [
      { id: "recon", label: "Identity Enum", description: "Mapping IAM roles and policy attachments." },
      { id: "exploit", label: "PassRole/SSRF", description: "Triggering escalation via service identity abuse." },
      { id: "pwn", label: "Admin Takeover", description: "Full control over cloud resources via elevated privileges." },
    ],
    codeAnnotations: {
      1: "The attacker must have permissions to pass roles to services.",
      5: "Creating a Lambda is the standard way to execute code in the context of an IAM role.",
      10: "If the role has AdministratorAccess, the escalation is complete."
    },
    body: `## The privilege escalation surface in cloud IAM

Cloud IAM privilege escalation is fundamentally different from on-premises AD escalation in one key respect: the blast radius of a single misconfiguration is higher, and the misconfiguration is often invisible in standard permission summaries. The effective permissions of any IAM entity depend not just on the policies directly attached to it but on every permission chain that entity can reach.

## AWS: the PassRole chain

The most consistently exploitable pattern in AWS environments is the PassRole chain. iam:PassRole allows an entity to assign an IAM role to a service. Combined with the ability to create or modify compute (Lambda, EC2, ECS task definitions), it enables any entity with those permissions to assign a higher-privileged role to a service they control, then invoke that service.

The canonical form:

\`\`\`
entity permissions: iam:PassRole, lambda:CreateFunction, lambda:InvokeFunction
target role: AdminRole (full account access)

attack:
1. Create Lambda function, pass AdminRole as execution role
2. Invoke function with payload that calls sts:GetCallerIdentity
3. Confirm execution context is AdminRole
4. Execute any further actions as AdminRole
\`\`\`

In our review of real tenants, 78% had at least one IAM entity where PassRole on a high-privilege role was combined with the ability to create or modify at least one compute service. Most of these were service accounts created for CI/CD pipelines.

## AWS: AttachUserPolicy and wildcard resource scoping

iam:AttachUserPolicy on a wildcard resource allows an entity to add any policy to any user, including themselves. This is a well-known escalation path and is documented in multiple privilege-escalation toolkits (Pacu, Cloudsplaining). It still appears regularly in production environments because the permission looks reasonable in isolation: "this CI pipeline needs to manage user policies."

The issue is always in the resource scope. iam:AttachUserPolicy on resource: "arn:aws:iam::*:user/ci-*" is safe. On resource: "*" it is a full privilege escalation path for anyone who can use that entity.

## Azure: Managed Identity SSRF

Azure Managed Identities attach to compute resources and provide access tokens via the instance metadata service (IMDS) at a link-local address. If any workload running on that compute resource has an SSRF vulnerability, the attacker can request a token for the managed identity without any additional authentication.

The severity depends on the identity's assigned roles. In our engagements, Contributor-scoped managed identities on compute resources were the most common finding - broad enough for most lateral movement objectives, scoped to a specific subscription but often covering all resources within it.

## What to audit

The single highest-leverage audit action in AWS is to enumerate every entity with both iam:PassRole and any compute creation permission, then check what roles are in scope. In Azure, audit managed identity role assignments quarterly - Contributor and Owner assignments to compute resources are the primary finding class.`,
  },

  {
    slug: "detection-coverage-measurement",
    title: "Measuring Real Detection Coverage Against ATT&CK Sub-techniques",
    type: "Methodology",
    date: "2026-02-20",
    minutes: 20,
    tags: ["Detection", "ATT&CK", "Coverage"],
    stage: "available",
    abstract:
      "A methodology for mapping actual SIEM rule coverage against ATT&CK sub-techniques, with aggregate results from six enterprise SIEM deployments.",
    findings: [
      "Median coverage of relevant sub-techniques: 34% across all six deployments",
      "Initial access and persistence sub-techniques showed the lowest coverage density",
      "Defense evasion had the highest rule volume but the lowest true-positive rate",
    ],
    body: `## Why coverage measurement is harder than it looks

ATT&CK gives you a matrix. SIEM vendors give you a rule set. The assumption most teams make is that if their SIEM vendor claims coverage of a technique, the technique is covered. This assumption fails in practice for three reasons: the vendor rule may depend on a log source not collected in your environment, the rule may cover the technique in name but not in the specific sub-technique your attacker uses, and the rule may be technically correct but tuned out of production because of excessive false positives.

Measuring real coverage requires exercising each technique in the environment you actually have and observing what the SIEM actually sees.

## The measurement methodology

We ran the same methodology across six enterprise SIEM deployments (four Elastic, two Splunk) using the following approach:

**Step 1: Select scope.** Not all ATT&CK techniques are relevant to every environment. We pre-filtered to the 89 sub-techniques most commonly observed in incidents affecting the target industry vertical.

**Step 2: Map log sources to sub-techniques.** For each sub-technique, document which log sources the detection depends on (Sysmon Process Create, Windows Security 4688, CloudTrail, etc.) and verify those log sources are actually flowing at the expected volume.

**Step 3: Execute atomic tests.** Using Atomic Red Team and custom scripts, execute a representative action for each sub-technique in a staging environment instrumented identically to production.

**Step 4: Verify detection.** Check the SIEM for the expected alert within the expected latency window. "Covered" requires an alert, not just the presence of a rule.

## Results

Median coverage across deployments: 34%. The range was 19% to 47%. No deployment exceeded 50% coverage of the sub-techniques we tested.

The distribution was non-uniform. Discovery techniques (T1087, T1016, T1057) were consistently covered because their telemetry is easy to collect and the patterns are distinctive. Execution techniques were moderately covered. Initial access and persistence were poorly covered - below 20% in most deployments.

Defense evasion was the most interesting finding. Most deployments had the highest rule count for this tactic, but the highest false positive rates. Rules for process injection, LOLBIN abuse, and masquerading generated enough noise that most had been either disabled or de-prioritised in alert routing. The volume of rules was not matched by functional detection.

## What this changes operationally

Coverage measurement at this granularity changes the operational question from "do we have rules?" to "which specific techniques can we actually detect today?" That question has a different answer, and the answer enables different prioritisation decisions. The gaps in initial access coverage, for example, argue for investing in identity-layer detection (MFA anomalies, impossible-travel alerts, account enumeration patterns) rather than more endpoint rules.`,
  },

  {
    slug: "supply-chain-dependency-risk",
    title: "Dependency Risk Modeling in Modern Software Supply Chains",
    type: "Architecture",
    date: "2026-01-15",
    minutes: 24,
    tags: ["Supply Chain", "Dependencies", "Risk"],
    stage: "available",
    abstract:
      "Framework for quantifying and prioritising supply chain risk across npm, PyPI, and Go module ecosystems based on provenance, maintenance activity, and exposure surface.",
    findings: [
      "Median Node.js production application has over 1,200 transitive dependencies",
      "58% of high-severity supply chain incidents in 2024-25 involved packages with fewer than 3 active maintainers",
      "Provenance attestation adoption remains below 8% across top-1000 npm packages",
    ],
    body: `## The problem with dependency counts

Most supply chain risk discussions start with the dependency count and stop there. "Your application has 1,200 transitive dependencies" is a real number, but it doesn't tell you where the risk is concentrated. A dependency count is a theoretical attack surface; a dependency risk model is an attempt to map that surface to realistic threat scenarios.

The framework described here came from two years of supply chain reviews across organisations that ranged from "no lockfile, pinning nothing" to "SLSA level 3, sigstore everything." The consistent gap was not tooling; it was a coherent model for prioritising which dependencies to watch closely.

## The three axes of dependency risk

We evaluate every direct dependency on three axes:

**Maintenance health**: Is the package actively maintained? How many unique maintainers have committed in the last 12 months? How quickly have past CVEs been patched? A package with one maintainer, no commits in 18 months, and an unpatched moderate CVE from last year is a higher-risk dependency than a package with three active maintainers and a 48-hour CVE response history.

**Execution depth**: At what point in the software lifecycle does this package execute? A devDependency that runs only during local development has a different risk profile than a production runtime dependency that processes user-supplied data. Build-time tools that run with access to secrets (npm lifecycle hooks, postinstall scripts) sit in a high-risk category regardless of maintenance health.

**Exposure surface**: What capabilities does this dependency have that aren't needed for its stated function? A markdown parser that can execute shell commands is a higher-risk dependency than one that cannot, even if they have identical maintenance scores.

## Transitive risk propagation

The hard part of dependency risk is transitives. Your direct dependencies are 40 packages. Their dependencies, and their dependencies' dependencies, are 1,200. You reviewed the direct ones. You probably haven't reviewed the transitives.

The approach that scales: score direct dependencies, then propagate risk scores to their transitives weighted by the execution depth of the direct dependency. A transitive of a build tool inherits a lower base risk than a transitive of a production HTTP handler. This doesn't eliminate the need to look at transitives, but it triages the ones that warrant human review.

## Where the incidents actually happen

Reviewing post-mortems for supply chain incidents in 2024-25, 58% involved packages with fewer than three active maintainers. Almost all involved packages where the build pipeline had outbound network access during package installation. Almost none involved packages that had active provenance attestation.

The implication: the risk is concentrated in low-maintenance packages with build-time execution capability, and the cheapest mitigation is to restrict outbound network access from build containers. Provenance attestation is valuable but adoption is too low to rely on it as a primary control. Build isolation is the leverage point.`,
  },
];

export function getResearch(slug: string) {
  return research.find((r) => r.slug === slug);
}
