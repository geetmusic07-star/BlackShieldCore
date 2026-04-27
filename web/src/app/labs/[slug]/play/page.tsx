"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Container } from "@/components/ui/container";
import {
  ArrowLeft,
  Play,
  Sparkles,
  Terminal,
  FileWarning,
  KeyRound,
  Send,
  Globe,
  Database,
  Shield,
} from "lucide-react";
import { getLabProfile, type LabProfile } from "@/content/labs";

// Helper: tiny base64url codec used by the JWT practical
const b64url = (str: string) =>
  btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const decodeB64url = (s: string) =>
  atob(s.replace(/-/g, "+").replace(/_/g, "/"));

// ════════════════════════════════════════════════════════════════
// PAGE — dispatches to the right practical based on lab profile
// ════════════════════════════════════════════════════════════════

export default function PlayPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [labMeta, setLabMeta] = useState<{ title?: string } | null>(null);

  useEffect(() => {
    fetch("/api/labs", { cache: "no-store" })
      .then((r) => r.json())
      .then((labs) => {
        const lab = (labs as any[]).find((l) => String(l.id) === slug);
        if (lab) setLabMeta({ title: lab.title });
      })
      .catch(() => {});
  }, [slug]);

  const profile = getLabProfile(labMeta);

  return (
    <div className="pt-32 pb-24">
      <Container className="max-w-[1080px]">
        <Link
          href={`/labs/${slug}`}
          className="inline-flex items-center gap-2 font-mono text-[12px] text-[color:var(--bsc-text-3)] hover:text-[color:var(--bsc-text-1)]"
        >
          <ArrowLeft size={13} />
          Back to room
        </Link>

        {profile.practicalKind === "jwt" && <JwtPractical profile={profile} />}
        {profile.practicalKind === "graphql" && (
          <GraphqlPractical profile={profile} />
        )}
        {profile.practicalKind === "ssrf" && <SsrfPractical profile={profile} />}
      </Container>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// SHARED — Console + Flag panel
// ════════════════════════════════════════════════════════════════

type LogLine = { tone: "info" | "ok" | "err"; text: string };

function Console({ logs }: { logs: LogLine[] }) {
  return (
    <div className="mt-8 rounded-xl border border-white/[0.08] bg-black/60 p-4">
      <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
        Server response
      </div>
      <div className="space-y-1.5 font-mono text-[12.5px] leading-relaxed">
        {logs.map((l, i) => (
          <div
            key={i}
            className={
              l.tone === "ok"
                ? "text-[oklch(0.85_0.14_140)]"
                : l.tone === "err"
                  ? "text-[oklch(0.85_0.12_20)]"
                  : "text-[color:var(--bsc-text-2)]"
            }
          >
            <span className="opacity-50">›</span>{" "}
            <span className="whitespace-pre-wrap">{l.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlagPanel({ flag }: { flag: string }) {
  return (
    <div className="mt-6 rounded-xl border border-[oklch(0.78_0.18_140)]/40 bg-[oklch(0.78_0.18_140)]/[0.08] p-5">
      <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[oklch(0.85_0.14_140)]">
        Flag captured
      </div>
      <div className="mt-2 font-mono text-[14px] text-[color:var(--bsc-text-1)]">
        {flag}
      </div>
      <p className="mt-3 text-[13px] text-[color:var(--bsc-text-2)]">
        Copy the flag back to the practical chapter in the room and submit it to
        complete the lab.
      </p>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// JWT PRACTICAL
// ════════════════════════════════════════════════════════════════

const SAMPLE_HEADER = `{
  "alg": "HS256",
  "typ": "JWT"
}`;

const SAMPLE_PAYLOAD = `{
  "sub": "u_4812",
  "role": "user",
  "iat": 1735689600,
  "exp": 1735776000
}`;

function JwtPractical({ profile }: { profile: LabProfile }) {
  const [header, setHeader] = useState(SAMPLE_HEADER);
  const [payload, setPayload] = useState(SAMPLE_PAYLOAD);
  const [token, setToken] = useState("");
  const [logs, setLogs] = useState<LogLine[]>([
    { tone: "info", text: "Endpoint: POST /api/auth/verify" },
    {
      tone: "info",
      text: "Sample token issued for role=user. Try escalating to admin.",
    },
  ]);
  const [flagFound, setFlagFound] = useState(false);

  useEffect(() => {
    try {
      const initial =
        b64url(JSON.stringify(JSON.parse(SAMPLE_HEADER))) +
        "." +
        b64url(JSON.stringify(JSON.parse(SAMPLE_PAYLOAD))) +
        ".dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";
      setToken(initial);
    } catch {
      /* ignore */
    }
  }, []);

  const log = (tone: LogLine["tone"], text: string) =>
    setLogs((l) => [...l, { tone, text }]);

  const buildToken = () => {
    try {
      const h = JSON.parse(header);
      const p = JSON.parse(payload);
      const sig = h.alg === "none" ? "" : "tampered_signature_value";
      const t = `${b64url(JSON.stringify(h))}.${b64url(JSON.stringify(p))}.${sig}`;
      setToken(t);
      log("ok", "Token rebuilt from header + payload.");
    } catch {
      log("err", "Invalid JSON in header or payload.");
    }
  };

  const submitToken = () => {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        log("err", "Malformed token: expected 3 dot-separated segments.");
        return;
      }
      const h = JSON.parse(decodeB64url(parts[0]));
      const p = JSON.parse(decodeB64url(parts[1]));
      const sig = parts[2];

      log("info", `Header parsed → alg=${h.alg ?? "?"}`);
      log("info", `Payload parsed → role=${p.role ?? "?"}, sub=${p.sub ?? "?"}`);

      if (h.alg === "none") {
        if (sig === "") {
          log(
            "ok",
            "alg=none accepted, signature segment empty — verifier skipped.",
          );
          if (p.role === "admin") {
            log("ok", `Authenticated as admin. Flag: ${profile.flag}`);
            setFlagFound(true);
            return;
          } else {
            log(
              "err",
              "Token accepted, but role is not admin. Try escalating the role claim.",
            );
            return;
          }
        } else {
          log("err", "alg=none requires the signature segment to be EMPTY.");
          return;
        }
      }

      log("err", "Signature verification failed. Token rejected.");
    } catch {
      log("err", "Could not decode token segments. Check base64url encoding.");
    }
  };

  return (
    <>
      <h1 className="mt-6 text-[28px] font-semibold tracking-[-0.018em] text-[color:var(--bsc-text-1)]">
        Practical: Forge an Admin Token
      </h1>
      <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-[color:var(--bsc-text-2)]">
        The endpoint below trusts the token's <code className="font-mono">alg</code>{" "}
        field. Edit the header, escalate the payload, rebuild the token, and submit.
        The flag is in the format{" "}
        <code className="font-mono text-[oklch(0.78_0.18_140)]">BSC{"{...}"}</code>.
      </p>

      <TargetCard
        target={`POST https://${profile.target}`}
        warning="The verifier is naive: it reads header.alg from the token to decide how to verify."
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <EditorCard
          label="Header"
          icon={<KeyRound size={12} />}
          value={header}
          onChange={setHeader}
        />
        <EditorCard
          label="Payload"
          icon={<Sparkles size={12} />}
          value={payload}
          onChange={setPayload}
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={buildToken}
          className="inline-flex items-center gap-2 rounded-md border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-[13px] text-[color:var(--bsc-text-1)] hover:bg-white/[0.08]"
        >
          Rebuild Token
        </button>
      </div>

      <div className="mt-6">
        <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
          Token (Authorization: Bearer)
        </div>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          spellCheck={false}
          className="h-24 w-full resize-none rounded-md border border-white/[0.08] bg-black/50 p-3 font-mono text-[12.5px] leading-relaxed text-[color:var(--bsc-text-1)] outline-none focus:border-[oklch(0.78_0.18_140)]/50"
        />
      </div>

      <button
        type="button"
        onClick={submitToken}
        className="mt-4 inline-flex items-center gap-2 rounded-md bg-[oklch(0.78_0.18_140)] px-5 py-2.5 text-[13px] font-medium text-black hover:bg-[oklch(0.82_0.18_140)]"
      >
        <Play size={13} /> Submit to /verify
      </button>

      <Console logs={logs} />
      {flagFound && <FlagPanel flag={profile.flag} />}
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// GRAPHQL PRACTICAL — introspect → hidden mutation → flag
// ════════════════════════════════════════════════════════════════

const SAMPLE_QUERY = `# Try an introspection query first.
{
  __schema {
    types {
      name
      fields { name }
    }
  }
}`;

// Simulated schema. The "internal__setRole" mutation is the hidden one.
const FAKE_SCHEMA_TYPES = [
  { name: "Query", fields: ["me", "user", "post", "search"] },
  {
    name: "Mutation",
    fields: ["createPost", "deletePost", "updateProfile", "internal__setRole"],
  },
  { name: "User", fields: ["id", "name", "email", "role"] },
  { name: "Post", fields: ["id", "title", "body", "author"] },
  { name: "Role", fields: ["USER", "MODERATOR", "ADMIN"] },
];

function GraphqlPractical({ profile }: { profile: LabProfile }) {
  const [query, setQuery] = useState(SAMPLE_QUERY);
  const [logs, setLogs] = useState<LogLine[]>([
    { tone: "info", text: `Endpoint: POST /graphql · target ${profile.target}` },
    {
      tone: "info",
      text: "Tip: introspection is a meta-query. Run one first to map the schema.",
    },
  ]);
  const [flagFound, setFlagFound] = useState(false);

  const log = (tone: LogLine["tone"], text: string) =>
    setLogs((l) => [...l, { tone, text }]);

  const submitQuery = () => {
    const q = query.trim();

    // 1) Introspection
    if (q.includes("__schema")) {
      log("ok", "Introspection accepted — schema returned.");
      const dump = FAKE_SCHEMA_TYPES.map(
        (t) => `  type ${t.name} { ${t.fields.join(", ")} }`,
      ).join("\n");
      log("info", `data.__schema.types →\n${dump}`);
      log(
        "info",
        "Notice anything in Mutation that doesn't belong in a public API?",
      );
      return;
    }

    // 2) Field-suggestion teaser when guessing
    if (/setRole|set_role|setrole/i.test(q) && !q.includes("internal__setRole")) {
      log(
        "err",
        'Cannot query field "setRole" on type "Mutation". Did you mean "internal__setRole"?',
      );
      return;
    }

    // 3) The hidden mutation (must include role: ADMIN)
    if (/internal__setRole/.test(q)) {
      const wantsAdmin = /role:\s*ADMIN/i.test(q) || /"role":\s*"ADMIN"/i.test(q);
      const hasUser = /id:\s*"?(me|self|u_\w+)"?/i.test(q) || /id:/i.test(q);
      if (!hasUser) {
        log("err", "Mutation accepted but missing the id argument.");
        return;
      }
      if (!wantsAdmin) {
        log(
          "err",
          "Mutation executed — but role is not ADMIN. The endpoint accepts USER/MODERATOR/ADMIN.",
        );
        return;
      }
      log("ok", "internal__setRole → role updated to ADMIN.");
      log("ok", `Authorization upgraded. Flag: ${profile.flag}`);
      setFlagFound(true);
      return;
    }

    // 4) Other queries
    if (/\bme\b/.test(q)) {
      log(
        "info",
        'data.me → { id: "u_4812", name: "operative", role: "USER" }',
      );
      return;
    }

    log(
      "err",
      "Query accepted but resolved to no useful data. Try introspecting first.",
    );
  };

  return (
    <>
      <h1 className="mt-6 text-[28px] font-semibold tracking-[-0.018em] text-[color:var(--bsc-text-1)]">
        Practical: Forge an Unauthorised Mutation
      </h1>
      <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-[color:var(--bsc-text-2)]">
        The simulated GraphQL server below has introspection enabled and a hidden
        mutation that escalates roles. Map the schema first, then call the
        mutation to capture the flag — format{" "}
        <code className="font-mono text-[oklch(0.78_0.18_140)]">BSC{"{...}"}</code>.
      </p>

      <TargetCard
        target={`POST https://${profile.target}`}
        warning="Introspection is on. Mutations are not authorisation-checked. Treat the schema as your map."
      />

      <div className="mt-6 rounded-xl border border-white/[0.08] bg-black/40">
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
          <Database size={12} /> Query
        </div>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          spellCheck={false}
          className="h-56 w-full resize-none bg-transparent p-4 font-mono text-[13px] leading-relaxed text-[color:var(--bsc-text-1)] outline-none"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={submitQuery}
          className="inline-flex items-center gap-2 rounded-md bg-[oklch(0.78_0.18_140)] px-5 py-2.5 text-[13px] font-medium text-black hover:bg-[oklch(0.82_0.18_140)]"
        >
          <Send size={13} /> Send query
        </button>
        <button
          type="button"
          onClick={() => setQuery(SAMPLE_QUERY)}
          className="inline-flex items-center gap-2 rounded-md border border-white/[0.08] bg-transparent px-4 py-2 text-[13px] text-[color:var(--bsc-text-3)] hover:text-[color:var(--bsc-text-1)]"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() =>
            setQuery(`mutation {
  internal__setRole(id: "u_4812", role: ADMIN) {
    id
    role
  }
}`)
          }
          className="inline-flex items-center gap-2 rounded-md border border-white/[0.08] bg-transparent px-4 py-2 text-[13px] text-[color:var(--bsc-text-3)] hover:text-[color:var(--bsc-text-1)]"
        >
          Mutation template
        </button>
      </div>

      <Console logs={logs} />
      {flagFound && <FlagPanel flag={profile.flag} />}
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// SSRF PRACTICAL — webhook tester → metadata → credentials → flag
// ════════════════════════════════════════════════════════════════

function SsrfPractical({ profile }: { profile: LabProfile }) {
  const [url, setUrl] = useState("https://example.com/health");
  const [creds, setCreds] = useState<{
    AccessKeyId: string;
    SecretAccessKey: string;
    Token: string;
  } | null>(null);
  const [logs, setLogs] = useState<LogLine[]>([
    {
      tone: "info",
      text: `Endpoint: POST /webhook/test · target ${profile.target}`,
    },
    {
      tone: "info",
      text: "The fetcher follows redirects. It refuses to fetch URLs containing the literal string '169.254'.",
    },
  ]);
  const [flagFound, setFlagFound] = useState(false);

  const log = (tone: LogLine["tone"], text: string) =>
    setLogs((l) => [...l, { tone, text }]);

  const submit = () => {
    const u = url.trim();

    if (!u) {
      log("err", "URL required.");
      return;
    }

    // Block the literal IP — naive filter
    if (u.includes("169.254")) {
      log("err", "URL rejected: blocked by hostname filter (matched '169.254').");
      return;
    }

    // Public probes
    if (/example\.com|google\.com/i.test(u)) {
      log("info", `GET ${u} → 200 OK · "alive"`);
      return;
    }

    // Localhost / loopback
    if (/(localhost|127\.0\.0\.1)/i.test(u)) {
      log(
        "ok",
        `GET ${u} → 200 OK · service responded. The fetcher CAN reach localhost.`,
      );
      return;
    }

    // Decimal-encoded metadata IP (2852039166 == 169.254.169.254)
    const isDecimalMetadata =
      /\b2852039166\b/.test(u) || /0xa9fea9fe/i.test(u);

    // Hostname-pointing-to-metadata
    const isAttackerControlledHost =
      /metadata\.[a-z0-9.-]+/i.test(u) || /imds\.[a-z0-9.-]+/i.test(u);

    if (isDecimalMetadata || isAttackerControlledHost) {
      log(
        "ok",
        `GET ${u} → 200 OK · response from 169.254.169.254 (filter bypassed via ${
          isDecimalMetadata ? "IP encoding" : "DNS-pointing host"
        }).`,
      );

      if (/\/iam\/security-credentials\/?$/.test(u)) {
        log("info", "body → MyAppRole");
        log(
          "info",
          "Hint: append /MyAppRole to the path to fetch the role's credentials.",
        );
        return;
      }
      if (/\/iam\/security-credentials\/MyAppRole/.test(u)) {
        const c = {
          AccessKeyId: "ASIA" + randomString(16),
          SecretAccessKey: randomString(40),
          Token: randomString(48),
        };
        setCreds(c);
        log(
          "ok",
          `body → ${JSON.stringify(c, null, 2)}\n\nCredentials captured. Send them to the crown-jewel endpoint at /api/v1/secrets to capture the flag.`,
        );
        return;
      }
      log(
        "info",
        "body → instance-id, public-keys, etc. Try /latest/meta-data/iam/security-credentials/.",
      );
      return;
    }

    // Crown jewel endpoint — accepts captured credentials
    if (/\/api\/v1\/secrets/.test(u)) {
      if (!creds) {
        log(
          "err",
          "GET /api/v1/secrets → 401 Unauthorized · valid IAM credentials required.",
        );
        return;
      }
      log(
        "ok",
        `GET ${u} → 200 OK · authenticated as MyAppRole. Flag: ${profile.flag}`,
      );
      setFlagFound(true);
      return;
    }

    log(
      "err",
      `GET ${u} → no useful response. Try probing internal addresses (the fetcher's network is more permissive than you'd expect).`,
    );
  };

  return (
    <>
      <h1 className="mt-6 text-[28px] font-semibold tracking-[-0.018em] text-[color:var(--bsc-text-1)]">
        Practical: Capture the Metadata Credentials
      </h1>
      <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-[color:var(--bsc-text-2)]">
        The webhook tester below fetches whatever URL you give it. The blunt
        hostname filter blocks the literal string{" "}
        <code className="font-mono">169.254</code> — re-read Chapter 4 for ways
        around that. Then walk the metadata path to credentials, and use them at{" "}
        <code className="font-mono">/api/v1/secrets</code> to capture the flag.
      </p>

      <TargetCard
        target={`POST https://${profile.target}`}
        warning="Naive URL filter blocks '169.254' but follows redirects and accepts any IP encoding."
      />

      <div className="mt-6 rounded-xl border border-white/[0.08] bg-black/40 p-4">
        <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
          URL
        </div>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          spellCheck={false}
          placeholder="https://example.com/health"
          className="w-full rounded-md border border-white/[0.08] bg-black/50 px-3 py-2.5 font-mono text-[13px] text-[color:var(--bsc-text-1)] placeholder:text-[color:var(--bsc-text-3)] outline-none focus:border-[oklch(0.78_0.18_140)]/50"
        />

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={submit}
            className="inline-flex items-center gap-2 rounded-md bg-[oklch(0.78_0.18_140)] px-5 py-2.5 text-[13px] font-medium text-black hover:bg-[oklch(0.82_0.18_140)]"
          >
            <Globe size={13} /> Fetch
          </button>
          <PreloadBtn label="naive (blocked)" url="http://169.254.169.254/" set={setUrl} />
          <PreloadBtn
            label="decimal-encoded"
            url="http://2852039166/latest/meta-data/iam/security-credentials/"
            set={setUrl}
          />
          <PreloadBtn
            label="role creds"
            url="http://2852039166/latest/meta-data/iam/security-credentials/MyAppRole"
            set={setUrl}
          />
          <PreloadBtn
            label="crown jewel"
            url="https://internal.acme.local/api/v1/secrets"
            set={setUrl}
          />
        </div>

        {creds && (
          <div className="mt-4 rounded-md border border-[oklch(0.82_0.14_75)]/30 bg-[oklch(0.82_0.14_75)]/[0.06] p-3 font-mono text-[12px] text-[oklch(0.88_0.12_75)]">
            <div className="mb-1 flex items-center gap-1.5">
              <Shield size={12} /> Captured credentials (ready to use)
            </div>
            <div>AccessKeyId: {creds.AccessKeyId}</div>
            <div>SecretAccessKey: {creds.SecretAccessKey.slice(0, 8)}…</div>
            <div>Token: {creds.Token.slice(0, 12)}…</div>
          </div>
        )}
      </div>

      <Console logs={logs} />
      {flagFound && <FlagPanel flag={profile.flag} />}
    </>
  );
}

function PreloadBtn({
  label,
  url,
  set,
}: {
  label: string;
  url: string;
  set: (s: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => set(url)}
      className="inline-flex items-center gap-2 rounded-md border border-white/[0.08] bg-transparent px-3 py-1.5 font-mono text-[11px] text-[color:var(--bsc-text-3)] hover:text-[color:var(--bsc-text-1)]"
    >
      {label}
    </button>
  );
}

function randomString(len: number) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < len; i++)
    s += chars.charAt(Math.floor(Math.random() * chars.length));
  return s;
}

// ════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ════════════════════════════════════════════════════════════════

function TargetCard({ target, warning }: { target: string; warning: string }) {
  return (
    <div className="mt-8 rounded-xl border border-white/[0.08] bg-black/40 p-5">
      <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
        <Terminal size={12} /> Target
      </div>
      <div className="mt-2 font-mono text-[13px] text-[color:var(--bsc-text-1)]">
        {target}
      </div>
      <div className="mt-3 flex items-start gap-2 rounded-md border border-[oklch(0.82_0.14_75)]/30 bg-[oklch(0.82_0.14_75)]/[0.06] px-3 py-2 text-[12.5px] text-[oklch(0.88_0.12_75)]">
        <FileWarning size={13} className="mt-0.5 shrink-0" />
        <span>{warning}</span>
      </div>
    </div>
  );
}

function EditorCard({
  label,
  icon,
  value,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
  onChange: (s: string) => void;
}) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-black/40">
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
        {icon}
        {label}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="h-44 w-full resize-none bg-transparent p-4 font-mono text-[13px] leading-relaxed text-[color:var(--bsc-text-1)] outline-none"
      />
    </div>
  );
}
