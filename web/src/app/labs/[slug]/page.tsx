"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Container } from "@/components/ui/container";
import {
  Check,
  ChevronDown,
  ExternalLink,
  Lightbulb,
  Sparkles,
  Radar,
  ShieldAlert,
  Wrench,
  Zap,
  ScrollText,
  BookOpen,
  Hash,
  Star,
  Compass,
} from "lucide-react";
import {
  getLabProfile,
  type Chapter,
  type Question,
  type BodyBlock,
  type ChapterKind,
  type LabProfile,
} from "@/content/labs";

// ════════════════════════════════════════════════════════════════
// CHAPTER METADATA - visual identity per kind
// ════════════════════════════════════════════════════════════════

const KIND_META: Record<
  ChapterKind,
  { label: string; rail: string; chip: string; Icon: React.ComponentType<{ size?: number; className?: string }> }
> = {
  briefing: {
    label: "Briefing",
    rail: "oklch(0.78 0.14 230)",
    chip: "border-[oklch(0.78_0.14_230)]/40 bg-[oklch(0.78_0.14_230)]/10 text-[oklch(0.85_0.13_230)]",
    Icon: Compass,
  },
  threat: {
    label: "Threat",
    rail: "oklch(0.72 0.18 25)",
    chip: "border-[oklch(0.72_0.18_25)]/40 bg-[oklch(0.72_0.18_25)]/10 text-[oklch(0.85_0.15_25)]",
    Icon: ShieldAlert,
  },
  mechanics: {
    label: "Mechanics",
    rail: "oklch(0.82 0.14 75)",
    chip: "border-[oklch(0.82_0.14_75)]/40 bg-[oklch(0.82_0.14_75)]/10 text-[oklch(0.88_0.12_75)]",
    Icon: Wrench,
  },
  exploit: {
    label: "Exploit",
    rail: "oklch(0.78 0.18 140)",
    chip: "border-[oklch(0.78_0.18_140)]/40 bg-[oklch(0.78_0.18_140)]/10 text-[oklch(0.85_0.14_140)]",
    Icon: Zap,
  },
  debrief: {
    label: "Debrief",
    rail: "oklch(0.72 0.10 290)",
    chip: "border-[oklch(0.72_0.10_290)]/40 bg-[oklch(0.72_0.10_290)]/10 text-[oklch(0.85_0.10_290)]",
    Icon: ScrollText,
  },
};

// ════════════════════════════════════════════════════════════════
// PAGE
// ════════════════════════════════════════════════════════════════

export default function LabRoomPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [labMeta, setLabMeta] = useState<{
    title?: string;
    description?: string;
    durationMinutes?: number;
  } | null>(null);

  // Resolve the per-lab content profile from the lab's title.
  // Defaults to JWT until the lab metadata loads - same chapter count and
  // shape across all profiles, so the layout stays stable across the swap.
  const labProfile: LabProfile = useMemo(
    () => getLabProfile(labMeta),
    [labMeta],
  );
  const chapters = labProfile.chapters;

  const [open, setOpen] = useState<Record<number, boolean>>({ 1: true });

  // Reset which chapter is open when the lab profile changes (e.g. metadata
  // arrives and we swap from the default JWT profile to the real one).
  useEffect(() => {
    setOpen(Object.fromEntries(chapters.map((c) => [c.number, c.number === 1])));
    setActiveChapter(1);
  }, [labProfile.key, chapters]);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [solved, setSolved] = useState<Record<string, boolean>>({});
  const [hintsUsed, setHintsUsed] = useState<Record<string, boolean>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [xpBurst, setXpBurst] = useState<{ key: string; amount: number } | null>(null);
  const [activeChapter, setActiveChapter] = useState<number>(1);

  const chapterRefs = useRef<Record<number, HTMLElement | null>>({});

  // Fetch lab metadata for the brief header
  useEffect(() => {
    fetch("/api/labs", { cache: "no-store" })
      .then((r) => r.json())
      .then((labs) => {
        const lab = (labs as any[]).find((l) => String(l.id) === slug);
        if (lab) {
          setLabMeta({
            title: lab.title,
            description: lab.description ?? lab.summary,
            durationMinutes: lab.durationMinutes ?? 60,
          });
        }
      })
      .catch(() => {});
  }, [slug]);

  // Track active chapter via IntersectionObserver - works correctly under Lenis
  // smooth-scroll (which decouples window.scrollY from visible scroll).
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .map((e) =>
            parseInt(e.target.getAttribute("data-chapter") ?? "0", 10),
          )
          .filter((n) => n > 0);
        if (visible.length > 0) {
          setActiveChapter(Math.min(...visible));
        }
      },
      { rootMargin: "-120px 0px -55% 0px", threshold: 0 },
    );
    for (const c of chapters) {
      const el = chapterRefs.current[c.number];
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [chapters]);

  // Nudge Lenis (and any scroll lib) to recompute max scroll height whenever a
  // chapter expands or collapses. Without this, Lenis caches the old document
  // height and the page becomes "stuck" - unable to scroll past the previous
  // max even though new content has been rendered below.
  useEffect(() => {
    const id = window.setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 60);
    return () => window.clearTimeout(id);
  }, [open]);

  // ── Aggregates ───────────────────────────────────────────────
  const totalQuestions = useMemo(
    () => chapters.reduce((n, c) => n + c.questions.length, 0),
    [chapters],
  );
  const totalXp = useMemo(
    () =>
      chapters.reduce(
        (sum, c) => sum + c.questions.reduce((s, q) => s + (q.xp ?? 0), 0),
        0,
      ),
    [chapters],
  );

  const solvedCount = Object.values(solved).filter(Boolean).length;
  const earnedXp = useMemo(() => {
    let xp = 0;
    for (const c of chapters) {
      c.questions.forEach((q, qi) => {
        const key = `${c.number}-${qi}`;
        if (solved[key]) {
          const base = q.xp ?? 0;
          xp += hintsUsed[key] ? Math.floor(base * 0.6) : base;
        }
      });
    }
    return xp;
  }, [chapters, solved, hintsUsed]);
  const hintCount = Object.values(hintsUsed).filter(Boolean).length;
  const progressPct = Math.round((solvedCount / totalQuestions) * 100);

  const chapterComplete = (c: Chapter) =>
    c.questions.every((_, qi) => solved[`${c.number}-${qi}`]);

  const verify = (chapterNo: number, qIndex: number, q: Question) => {
    const key = `${chapterNo}-${qIndex}`;
    const given = (answers[key] ?? "").trim().toLowerCase();
    const expected = q.answer.trim().toLowerCase();
    const ok = expected === "" || given === expected;
    if (ok) {
      setSolved((s) => ({ ...s, [key]: true }));
      const base = q.xp ?? 0;
      const reward = hintsUsed[key] ? Math.floor(base * 0.6) : base;
      if (reward > 0) {
        setXpBurst({ key, amount: reward });
        setTimeout(() => setXpBurst(null), 1200);
      }
    } else {
      setSolved((s) => ({ ...s, [key]: false }));
    }
  };

  const revealHint = (key: string) => {
    setRevealedHints((r) => ({ ...r, [key]: true }));
    setHintsUsed((h) => ({ ...h, [key]: true }));
  };

  const jumpTo = (chapterNo: number) => {
    setOpen((o) => ({ ...o, [chapterNo]: true }));
    requestAnimationFrame(() => {
      const el = chapterRefs.current[chapterNo];
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  };

  // ════════════════════════════════════════════════
  return (
    <div className="pt-28 pb-32">
      <Container className="max-w-[1200px]">
        <MissionBrief
          title={labMeta?.title ?? "Lab"}
          description={
            labMeta?.description ??
            "Hands-on offensive scenario - read the chapters, capture the flag in the practical."
          }
          minutes={labMeta?.durationMinutes ?? 60}
          slug={slug}
          totalXp={totalXp}
          chapters={chapters.length}
          category={labProfile.category}
          mitre={labProfile.mitre}
        />

        {/* ── Segmented progress meter ─────────────── */}
        <div className="mt-8 flex items-center gap-3">
          <div className="flex flex-1 gap-1.5">
            {chapters.map((c) => {
              const done = chapterComplete(c);
              const active = activeChapter === c.number;
              return (
                <div
                  key={c.number}
                  className="h-1 flex-1 overflow-hidden rounded-full bg-white/[0.06]"
                  aria-label={`Chapter ${c.number} progress`}
                >
                  <div
                    className="h-full transition-[width] duration-500 ease-out"
                    style={{
                      width: done ? "100%" : active ? "30%" : "0%",
                      background: KIND_META[c.kind].rail,
                    }}
                  />
                </div>
              );
            })}
          </div>
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
            {progressPct}%
          </span>
        </div>

        {/* ── Two-column layout: spine + content ───── */}
        <div className="mt-10 grid gap-10 lg:grid-cols-[200px_1fr]">
          <ChapterSpine
            chapters={chapters}
            activeChapter={activeChapter}
            isComplete={chapterComplete}
            onJump={jumpTo}
          />

          <div className="min-w-0 space-y-5">
            {chapters.map((chapter) => {
              const isOpen = open[chapter.number];
              const done = chapterComplete(chapter);
              const meta = KIND_META[chapter.kind];
              const Icon = meta.Icon;
              return (
                <section
                  key={chapter.number}
                  data-chapter={chapter.number}
                  ref={(el) => {
                    chapterRefs.current[chapter.number] = el;
                  }}
                  className="overflow-hidden rounded-xl border border-white/[0.07] bg-[color-mix(in_oklch,var(--bsc-surface)_70%,transparent)]"
                  style={{
                    boxShadow: done
                      ? `inset 3px 0 0 0 ${meta.rail}`
                      : `inset 3px 0 0 0 color-mix(in oklch, ${meta.rail} 30%, transparent)`,
                  }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpen((o) => ({ ...o, [chapter.number]: !isOpen }))
                    }
                    className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.03]"
                  >
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-10 w-12 shrink-0 flex-col items-center justify-center rounded-md border border-white/[0.08] bg-black/40">
                        <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[color:var(--bsc-text-3)]">
                          CH
                        </span>
                        <span className="font-mono text-[12px] font-semibold leading-none text-[color:var(--bsc-text-1)]">
                          {String(chapter.number).padStart(2, "0")}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] ${meta.chip}`}
                          >
                            <Icon size={10} /> {meta.label}
                          </span>
                          <span className="font-mono text-[10px] text-[color:var(--bsc-text-3)]">
                            · {chapter.minutes} min
                          </span>
                          {done && (
                            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-[oklch(0.78_0.18_140)]">
                              <Check size={10} strokeWidth={3} /> cleared
                            </span>
                          )}
                        </div>
                        <h2 className="text-[15px] font-semibold tracking-[-0.012em] text-[color:var(--bsc-text-1)]">
                          {chapter.title}
                        </h2>
                      </div>
                    </div>

                    <ChevronDown
                      size={16}
                      className={`mt-3 shrink-0 text-[color:var(--bsc-text-3)] transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-8 pt-2">
                      <article className="prose-room">
                        {chapter.body.map((b, i) => (
                          <BodyBlockView key={i} block={b} />
                        ))}
                      </article>

                      {chapter.kind === "exploit" && (
                        <BootLab
                          slug={slug}
                          target={labProfile.target}
                          hint={
                            labProfile.practicalKind === "graphql"
                              ? "Introspection enabled · hidden mutation in scope · awaiting query"
                              : labProfile.practicalKind === "ssrf"
                                ? "Webhook fetcher · follows redirects · awaiting probe"
                                : "Naïve verifier · trusts header.alg · awaiting forged token"
                          }
                        />
                      )}

                      {/* Questions */}
                      <div className="mt-10 space-y-4">
                        <div className="flex items-center gap-2">
                          <Sparkles
                            size={13}
                            className="text-[oklch(0.78_0.18_140)]"
                          />
                          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--bsc-text-2)]">
                            Knowledge probes · {chapter.questions.length}
                          </span>
                        </div>

                        {chapter.questions.map((q, qi) => {
                          const key = `${chapter.number}-${qi}`;
                          const isSolved = !!solved[key];
                          const noAnswerNeeded = q.answer === "";
                          const hintShown = !!revealedHints[key];

                          return (
                            <div
                              key={qi}
                              className="relative rounded-lg border border-white/[0.07] bg-black/30 p-4"
                            >
                              <div className="mb-2 flex items-start justify-between gap-3">
                                <p className="text-[13.5px] leading-relaxed text-[color:var(--bsc-text-2)]">
                                  {q.prompt}
                                </p>
                                {q.xp !== undefined && q.xp > 0 && (
                                  <span className="shrink-0 inline-flex items-center gap-1 rounded border border-white/[0.08] bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-[color:var(--bsc-text-3)]">
                                    <Star size={9} /> {q.xp} XP
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-col gap-2 sm:flex-row">
                                <input
                                  disabled={noAnswerNeeded || isSolved}
                                  value={answers[key] ?? ""}
                                  onChange={(e) =>
                                    setAnswers((a) => ({
                                      ...a,
                                      [key]: e.target.value,
                                    }))
                                  }
                                  placeholder={q.placeholder ?? "Your answer"}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") verify(chapter.number, qi, q);
                                  }}
                                  className="flex-1 rounded-md border border-white/[0.08] bg-black/50 px-3 py-2.5 font-mono text-[13px] text-[color:var(--bsc-text-1)] placeholder:text-[color:var(--bsc-text-3)] outline-none focus:border-[oklch(0.78_0.18_140)]/60 disabled:opacity-60"
                                />
                                <button
                                  type="button"
                                  onClick={() => verify(chapter.number, qi, q)}
                                  disabled={isSolved}
                                  className={`relative inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-[13px] font-medium transition-colors ${
                                    isSolved
                                      ? "bg-[oklch(0.78_0.18_140)]/20 text-[oklch(0.78_0.18_140)]"
                                      : "bg-[oklch(0.78_0.18_140)] text-black hover:bg-[oklch(0.82_0.18_140)]"
                                  }`}
                                >
                                  {isSolved ? (
                                    <>
                                      <Check size={14} strokeWidth={3} /> Cleared
                                    </>
                                  ) : (
                                    <>
                                      <Radar size={14} /> Verify
                                    </>
                                  )}
                                </button>
                              </div>

                              {/* Hint affordance */}
                              {q.hint && !isSolved && (
                                <div className="mt-2.5">
                                  {hintShown ? (
                                    <div className="flex items-start gap-2 rounded border border-[oklch(0.82_0.14_75)]/30 bg-[oklch(0.82_0.14_75)]/[0.06] px-2.5 py-1.5 text-[12px] text-[oklch(0.88_0.12_75)]">
                                      <Lightbulb size={12} className="mt-0.5 shrink-0" />
                                      <span>
                                        {q.hint}{" "}
                                        <span className="opacity-60">
                                          (XP reduced 40%)
                                        </span>
                                      </span>
                                    </div>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => revealHint(key)}
                                      className="inline-flex items-center gap-1 font-mono text-[11px] text-[color:var(--bsc-text-3)] hover:text-[color:var(--bsc-text-1)]"
                                    >
                                      <Lightbulb size={11} /> Reveal hint
                                    </button>
                                  )}
                                </div>
                              )}

                              {/* XP burst */}
                              {xpBurst?.key === key && (
                                <div
                                  className="pointer-events-none absolute right-3 top-3 select-none font-mono text-[12px] font-semibold text-[oklch(0.85_0.14_140)]"
                                  style={{
                                    animation: "xpBurst 1.1s ease-out forwards",
                                  }}
                                >
                                  +{xpBurst.amount} XP
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </div>

        {/* ── Operator Debrief footer ─────────────── */}
        <OperatorDebrief
          chaptersDone={chapters.filter(chapterComplete).length}
          totalChapters={chapters.length}
          earnedXp={earnedXp}
          totalXp={totalXp}
          hintsUsed={hintCount}
        />
      </Container>

      {/* Floating reading-position telemetry */}
      <ReadingTelemetry
        active={activeChapter}
        total={chapters.length}
        progress={progressPct}
      />

      {/* Page-local styles */}
      <style jsx global>{`
        .prose-room h2 {
          font-size: 20px;
          font-weight: 600;
          letter-spacing: -0.012em;
          margin-top: 28px;
          margin-bottom: 12px;
          color: var(--bsc-text-1);
        }
        .prose-room h3 {
          font-size: 16px;
          font-weight: 600;
          letter-spacing: -0.008em;
          margin-top: 22px;
          margin-bottom: 8px;
          color: var(--bsc-text-1);
        }
        .prose-room p {
          font-size: 14.5px;
          line-height: 1.78;
          color: var(--bsc-text-2);
          margin-top: 0;
          margin-bottom: 14px;
        }
        .prose-room ul {
          margin: 8px 0 16px 0;
          padding-left: 22px;
          list-style: disc;
        }
        .prose-room li {
          font-size: 14.5px;
          line-height: 1.7;
          color: var(--bsc-text-2);
          margin-bottom: 6px;
        }
        .prose-room li::marker {
          color: color-mix(in oklch, oklch(0.78 0.18 140) 70%, transparent);
        }
        @keyframes xpBurst {
          0% {
            opacity: 0;
            transform: translateY(0) scale(0.95);
          }
          15% {
            opacity: 1;
            transform: translateY(-4px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-22px) scale(1);
          }
        }
      `}</style>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// MISSION BRIEF - replaces the THM action-pill row
// ════════════════════════════════════════════════════════════════

function MissionBrief({
  title,
  description,
  minutes,
  slug,
  totalXp,
  chapters,
  category,
  mitre,
}: {
  title: string;
  description: string;
  minutes: number;
  slug: string;
  totalXp: number;
  chapters: number;
  category: string;
  mitre: string;
}) {
  // Generate a stable hash-like id from the slug
  const labId = (() => {
    let h = 0;
    for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0;
    return ("00000000" + (h >>> 0).toString(16)).slice(-8).toUpperCase();
  })();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[color-mix(in_oklch,var(--bsc-surface)_75%,transparent)]">
      {/* Classification banner */}
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-black/30 px-5 py-1.5 font-mono text-[9px] uppercase tracking-[0.24em] text-[color:var(--bsc-text-3)]">
        <span className="text-[oklch(0.78_0.18_140)]">● Briefing</span>
        <span>Confidential - Tier II · Internal Use</span>
        <span>OP/Operative</span>
      </div>

      {/* Soft accent corner */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-[0.16]"
        style={{
          background:
            "radial-gradient(circle, oklch(0.78 0.18 140) 0%, transparent 65%)",
        }}
      />

      <div className="relative p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--bsc-text-3)]">
              <span className="inline-flex items-center gap-1.5">
                <Hash size={11} /> {labId}
              </span>
              <span>· {category}</span>
              <span>· {mitre}</span>
            </div>

            <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.018em] text-[color:var(--bsc-text-1)] sm:text-[32px]">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-[color:var(--bsc-text-2)]">
              {description}
            </p>
          </div>

          {/* Stats bay */}
          <div className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-white/[0.08] bg-white/[0.03] lg:w-[280px]">
            <Stat label="Read" value={`${minutes}m`} />
            <Stat label="Chapters" value={String(chapters)} />
            <Stat label="Max XP" value={String(totalXp)} />
          </div>
        </div>

        {/* Threat tier strip */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--bsc-text-3)]">
            Threat tier
          </span>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-7 rounded-full ${
                  i < 3
                    ? "bg-[oklch(0.78_0.18_140)]"
                    : "bg-white/[0.08]"
                }`}
              />
            ))}
          </div>
          <span className="font-mono text-[11px] text-[color:var(--bsc-text-2)]">
            III · Practical · Authentication-bypass
          </span>
        </div>

        {/* Action row - book-style verbs, not THM-y */}
        <div className="mt-6 flex flex-wrap gap-2">
          <BriefAction icon={<BookOpen size={13} />} label="Open notebook" />
          <BriefAction icon={<Compass size={13} />} label="Skim outline" />
          <BriefAction icon={<Star size={13} />} label="Track progress" />
          <Link
            href={`/labs/${slug}/play`}
            className="inline-flex items-center gap-2 rounded-md bg-[oklch(0.78_0.18_140)] px-4 py-1.5 text-[12px] font-medium text-black hover:bg-[oklch(0.82_0.18_140)]"
          >
            <Zap size={13} /> Boot lab environment
          </Link>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-black/40 px-4 py-3 text-center">
      <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-[color:var(--bsc-text-3)]">
        {label}
      </div>
      <div className="mt-1 font-mono text-[16px] font-semibold text-[color:var(--bsc-text-1)]">
        {value}
      </div>
    </div>
  );
}

function BriefAction({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-md border border-white/[0.08] bg-black/30 px-3 py-1.5 text-[12px] text-[color:var(--bsc-text-2)] transition-colors hover:border-white/[0.15] hover:text-[color:var(--bsc-text-1)]"
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// ════════════════════════════════════════════════════════════════
// CHAPTER SPINE - sticky vertical timeline (left column on desktop)
// ════════════════════════════════════════════════════════════════

function ChapterSpine({
  chapters,
  activeChapter,
  isComplete,
  onJump,
}: {
  chapters: Chapter[];
  activeChapter: number;
  isComplete: (c: Chapter) => boolean;
  onJump: (chapterNo: number) => void;
}) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24">
        <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--bsc-text-3)]">
          Chapter spine
        </div>
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[7px] top-1.5 bottom-1.5 w-px bg-white/[0.08]" />

          <ul className="space-y-3.5">
            {chapters.map((c) => {
              const active = activeChapter === c.number;
              const done = isComplete(c);
              const meta = KIND_META[c.kind];
              return (
                <li key={c.number} className="relative">
                  <button
                    type="button"
                    onClick={() => onJump(c.number)}
                    className="group flex w-full items-start gap-3 text-left"
                  >
                    <span
                      className="relative z-[1] mt-1 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2 transition-all"
                      style={{
                        borderColor: done
                          ? meta.rail
                          : active
                            ? meta.rail
                            : "color-mix(in oklch, white 14%, transparent)",
                        background: done
                          ? meta.rail
                          : active
                            ? `color-mix(in oklch, ${meta.rail} 25%, transparent)`
                            : "var(--bsc-void)",
                        boxShadow: active
                          ? `0 0 0 4px color-mix(in oklch, ${meta.rail} 18%, transparent)`
                          : "none",
                      }}
                    >
                      {done && <Check size={8} strokeWidth={4} className="text-black" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)]">
                        CH·{String(c.number).padStart(2, "0")} · {meta.label}
                      </div>
                      <div
                        className={`mt-0.5 truncate text-[12.5px] transition-colors ${
                          active
                            ? "text-[color:var(--bsc-text-1)]"
                            : "text-[color:var(--bsc-text-2)] group-hover:text-[color:var(--bsc-text-1)]"
                        }`}
                      >
                        {c.title}
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
}

// ════════════════════════════════════════════════════════════════
// BODY RENDERER
// ════════════════════════════════════════════════════════════════

function BodyBlockView({ block }: { block: BodyBlock }) {
  switch (block.kind) {
    case "h3":
      return <h3>{block.value}</h3>;
    case "p":
      return <p>{block.value}</p>;
    case "ul":
      return (
        <ul>
          {block.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      );
    case "code":
      return (
        <pre className="my-4 overflow-x-auto rounded-md border border-white/[0.08] bg-black/60 p-4 text-[12.5px] leading-relaxed">
          <code className="whitespace-pre font-mono text-[color:var(--bsc-text-1)]">
            {block.value}
          </code>
        </pre>
      );
    case "callout": {
      const palette = {
        note: {
          ring: "border-[oklch(0.78_0.14_230)]/35",
          bg: "bg-[oklch(0.78_0.14_230)]/[0.06]",
          text: "text-[oklch(0.85_0.13_230)]",
          label: "FIELD NOTE",
        },
        redflag: {
          ring: "border-[oklch(0.72_0.18_25)]/35",
          bg: "bg-[oklch(0.72_0.18_25)]/[0.06]",
          text: "text-[oklch(0.85_0.15_25)]",
          label: "RED FLAG",
        },
        tip: {
          ring: "border-[oklch(0.82_0.14_75)]/35",
          bg: "bg-[oklch(0.82_0.14_75)]/[0.06]",
          text: "text-[oklch(0.88_0.12_75)]",
          label: "ANALYST TIP",
        },
      }[block.tone];
      return (
        <div
          className={`my-5 rounded-md border ${palette.ring} ${palette.bg} px-4 py-3`}
        >
          <div
            className={`mb-1 font-mono text-[10px] uppercase tracking-[0.22em] ${palette.text}`}
          >
            {palette.label}
          </div>
          <div className={`text-[13.5px] leading-relaxed ${palette.text}`}>
            {block.value}
          </div>
        </div>
      );
    }
    default:
      return null;
  }
}

// ════════════════════════════════════════════════════════════════
// BOOT LAB - replaces THM "View Site"
// ════════════════════════════════════════════════════════════════

function BootLab({
  slug,
  target,
  hint,
}: {
  slug: string;
  target: string;
  hint: string;
}) {
  return (
    <div className="my-6 overflow-hidden rounded-xl border border-[oklch(0.78_0.18_140)]/35 bg-black/40">
      <div className="flex items-center gap-2 border-b border-[oklch(0.78_0.18_140)]/20 bg-[oklch(0.78_0.18_140)]/[0.06] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[oklch(0.85_0.14_140)]">
        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[oklch(0.85_0.14_140)]" />
        Lab environment · standby
      </div>
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 font-mono text-[12.5px] leading-relaxed text-[color:var(--bsc-text-2)]">
          <div>
            <span className="text-[color:var(--bsc-text-3)]">$</span>{" "}
            <span className="text-[color:var(--bsc-text-1)]">boot</span>{" "}
            <span className="text-[oklch(0.85_0.14_140)]">{target}</span>
          </div>
          <div className="text-[color:var(--bsc-text-3)]">↳ {hint}</div>
        </div>
        <Link
          href={`/labs/${slug}/play`}
          className="inline-flex shrink-0 items-center gap-2 rounded-md bg-[oklch(0.78_0.18_140)] px-5 py-2.5 text-[13px] font-medium text-black hover:bg-[oklch(0.82_0.18_140)]"
        >
          <ExternalLink size={13} />
          Engage target
        </Link>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// READING TELEMETRY - fixed bottom-right pill
// ════════════════════════════════════════════════════════════════

function ReadingTelemetry({
  active,
  total,
  progress,
}: {
  active: number;
  total: number;
  progress: number;
}) {
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-30 hidden rounded-full border border-white/[0.08] bg-black/70 px-3.5 py-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[color:var(--bsc-text-3)] backdrop-blur-md sm:inline-flex">
      <span className="text-[oklch(0.78_0.18_140)]">●</span>
      <span className="ml-2">
        CH {String(active).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
      <span className="mx-2 opacity-40">·</span>
      <span>{progress}%</span>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// OPERATOR DEBRIEF - replaces NPS strip
// ════════════════════════════════════════════════════════════════

function OperatorDebrief({
  chaptersDone,
  totalChapters,
  earnedXp,
  totalXp,
  hintsUsed,
}: {
  chaptersDone: number;
  totalChapters: number;
  earnedXp: number;
  totalXp: number;
  hintsUsed: number;
}) {
  const complete = chaptersDone === totalChapters;
  return (
    <div className="mt-16 overflow-hidden rounded-2xl border border-white/[0.08]">
      <div className="flex items-center justify-between border-b border-white/[0.06] bg-black/30 px-5 py-1.5 font-mono text-[9px] uppercase tracking-[0.24em] text-[color:var(--bsc-text-3)]">
        <span>Debrief log</span>
        <span>{complete ? "● Mission complete" : "○ Mission in progress"}</span>
      </div>

      <div className="grid gap-px bg-white/[0.04] sm:grid-cols-4">
        <DebriefCell label="Chapters cleared" value={`${chaptersDone}/${totalChapters}`} />
        <DebriefCell label="XP earned" value={`${earnedXp}/${totalXp}`} />
        <DebriefCell label="Hints used" value={String(hintsUsed)} />
        <DebriefCell
          label="Status"
          value={complete ? "Complete" : "In progress"}
          accent={complete ? "oklch(0.78 0.18 140)" : undefined}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 bg-black/30 px-5 py-4">
        <p className="max-w-md text-[12.5px] text-[color:var(--bsc-text-3)]">
          Want this room sharper?{" "}
          <button className="text-[color:var(--bsc-text-1)] underline-offset-4 hover:underline">
            Send a recommendation
          </button>{" "}
          - your feedback shapes the next iteration.
        </p>
        <button
          type="button"
          disabled={!complete}
          className={`inline-flex items-center gap-2 rounded-md px-5 py-2 text-[12.5px] font-medium transition-colors ${
            complete
              ? "bg-[oklch(0.78_0.18_140)] text-black hover:bg-[oklch(0.82_0.18_140)]"
              : "cursor-not-allowed border border-white/[0.08] bg-transparent text-[color:var(--bsc-text-3)]"
          }`}
        >
          <Check size={13} strokeWidth={3} />
          {complete ? "Sign off" : "Finish all chapters"}
        </button>
      </div>
    </div>
  );
}

function DebriefCell({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="bg-[color-mix(in_oklch,var(--bsc-surface)_70%,transparent)] px-5 py-4">
      <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-[color:var(--bsc-text-3)]">
        {label}
      </div>
      <div
        className="mt-1 font-mono text-[18px] font-semibold"
        style={{ color: accent ?? "var(--bsc-text-1)" }}
      >
        {value}
      </div>
    </div>
  );
}
