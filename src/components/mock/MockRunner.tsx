"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  Expand,
  Flag,
  Loader2,
  Send,
  Timer,
} from "lucide-react";
import type { Question } from "@/lib/content/types";
import { OPTION_LABEL } from "@/lib/content/option-labels";
import { cn, formatClock } from "@/lib/utils";
import { InlineLite, Presentation } from "@/components/practice/QuizRunner";

interface MockRunnerProps {
  id: string;
  questions: Question[];
  expiresAt: string;
  initialAnswers: Record<string, { selected: string; elapsedMs: number }>;
  initialFlags: string[];
  initialIndex: number;
}

export function MockRunner({
  id,
  questions,
  expiresAt,
  initialAnswers,
  initialFlags,
  initialIndex,
}: MockRunnerProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState(initialAnswers);
  const [flags, setFlags] = useState(initialFlags);
  const [index, setIndex] = useState(Math.min(initialIndex, questions.length - 1));
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1000)),
  );
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const questionStartedAt = useRef(Date.now());
  const submittedRef = useRef(false);
  const answersRef = useRef(answers);
  const flagsRef = useRef(flags);
  const indexRef = useRef(index);

  answersRef.current = answers;
  flagsRef.current = flags;
  indexRef.current = index;

  const question = questions[index];
  const answeredCount = Object.keys(answers).length;

  const submit = useCallback(
    async (auto: boolean) => {
      if (submittedRef.current) return;
      if (!auto) {
        const unanswered = questions.length - Object.keys(answersRef.current).length;
        if (unanswered > 0) {
          const ok = window.confirm(`未解答が ${unanswered} 問あります。解答を確定して提出しますか？`);
          if (!ok) return;
        } else if (!window.confirm("解答を確定して提出しますか？提出後は変更できません。")) {
          return;
        }
      }
      submittedRef.current = true;
      setSubmitting(true);
      setError(null);
      try {
        const response = await fetch("/api/mock", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "submit",
            id,
            answers: answersRef.current,
            flags: flagsRef.current,
            currentIndex: indexRef.current,
          }),
        });
        const data = (await response.json()) as { error?: string };
        if (!response.ok) throw new Error(data.error ?? "提出に失敗しました");
        router.push(`/mock/results/${id}`);
        router.refresh();
      } catch (caught) {
        submittedRef.current = false;
        setError(caught instanceof Error ? caught.message : "提出に失敗しました");
        setSubmitting(false);
      }
    },
    [id, questions.length, router],
  );

  const save = useCallback(async () => {
    if (submittedRef.current) return;
    setSaving(true);
    try {
      const response = await fetch("/api/mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save",
          id,
          answers: answersRef.current,
          flags: flagsRef.current,
          currentIndex: indexRef.current,
        }),
      });
      if (response.ok) setSavedAt(new Date().toISOString());
    } finally {
      setSaving(false);
    }
  }, [id]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1000));
      setRemaining(left);
      if (left <= 0) void submit(true);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [expiresAt, submit]);

  useEffect(() => {
    const autosave = window.setInterval(() => void save(), 15000);
    return () => window.clearInterval(autosave);
  }, [save]);

  useEffect(() => {
    const debounced = window.setTimeout(() => void save(), 700);
    return () => window.clearTimeout(debounced);
  }, [answers, flags, index, save]);

  useEffect(() => {
    function beforeUnload(event: BeforeUnloadEvent) {
      if (!submittedRef.current) {
        event.preventDefault();
        event.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, []);

  function goTo(next: number) {
    if (next < 0 || next >= questions.length) return;
    const elapsed = Date.now() - questionStartedAt.current;
    setAnswers((current) => {
      const existing = current[question.id];
      if (!existing) return current;
      return {
        ...current,
        [question.id]: { ...existing, elapsedMs: existing.elapsedMs + elapsed },
      };
    });
    questionStartedAt.current = Date.now();
    setIndex(next);
    if (next % 5 === 0) void save();
  }

  function selectOption(optionId: string) {
    const elapsed = Date.now() - questionStartedAt.current;
    questionStartedAt.current = Date.now();
    setAnswers((current) => {
      const existing = current[question.id];
      return {
        ...current,
        [question.id]: {
          selected: optionId,
          elapsedMs: (existing?.elapsedMs ?? 0) + elapsed,
        },
      };
    });
  }

  function toggleFlag() {
    setFlags((current) =>
      current.includes(question.id)
        ? current.filter((item) => item !== question.id)
        : [...current, question.id],
    );
  }

  async function toggleFullscreen() {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await document.documentElement.requestFullscreen();
    }
  }

  const selected = answers[question.id]?.selected;
  const urgent = remaining <= 600;
  const progress = (answeredCount / questions.length) * 100;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-bg">
      <header className="sticky top-0 z-10 border-b border-border bg-bg">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-2.5">
          <Link href="/mock" className="btn btn-ghost h-8 px-2 text-xs" aria-label="模擬試験を中断">
            <ChevronLeft className="size-4" />
            中断
          </Link>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold">SG 模擬試験 · 60問 / 120分</p>
            <p className="text-[0.65rem] text-muted">科目A 48問 + 科目B 12問 · 非公式の練習用</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden text-[0.65rem] text-muted sm:block">
              {saving ? "保存中…" : savedAt ? "自動保存済み" : "自動保存有効"}
            </span>
            <button
              type="button"
              className="btn h-8 px-2"
              onClick={() => void toggleFullscreen()}
              title="全画面"
              aria-label="全画面に切り替え"
            >
              <Expand className="size-3.5" />
            </button>
            <div
              className={cn(
                "mono flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-semibold tabular-nums",
                urgent ? "border-error/40 bg-error/10 text-error" : "border-border bg-surface",
              )}
              aria-live={urgent ? "polite" : "off"}
            >
              <Timer className="size-3.5" />
              {formatClock(remaining)}
            </div>
            <button
              type="button"
              className="btn btn-primary h-8 px-3 text-xs"
              onClick={() => void submit(false)}
              disabled={submitting}
            >
              {submitting ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />}
              提出
            </button>
          </div>
        </div>
        <div className="h-1 w-full bg-bg-soft">
          <div className="h-full bg-accent" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-5 px-4 py-5 lg:grid-cols-[1fr_260px]">
        <section className="card p-5 md:p-7">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="chip">
              問 {index + 1} / {questions.length}
            </span>
            <span className="chip">{question.part === "B" ? "科目B" : "科目A"}</span>
            <span className="chip">
              {question.difficulty === "easy" ? "基礎" : question.difficulty === "medium" ? "標準" : "応用"}
            </span>
            {flags.includes(question.id) ? (
              <span className="chip border-warning/40 bg-warning/10 text-warning">後で見直す</span>
            ) : null}
            <span className="ml-auto text-[0.65rem] text-muted">選択すると自動保存</span>
          </div>

          <p className="jp whitespace-pre-line text-[0.98rem] font-medium leading-8">
            <InlineLite text={question.stem} />
          </p>
          <div className="mt-4">
            <Presentation question={question} />
          </div>

          <div className="mt-5 space-y-2" role="group" aria-label="選択肢">
            {question.options.map((option) => {
              const isSelected = selected === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => selectOption(option.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors",
                    isSelected
                      ? "border-accent bg-bg-soft"
                      : "border-border bg-surface hover:border-accent/50 hover:bg-surface-2",
                  )}
                >
                  <span
                    className={cn(
                      "mono mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border text-xs font-semibold",
                      isSelected
                        ? "border-accent bg-accent text-accent-fg"
                        : "border-border-strong text-muted",
                    )}
                  >
                    {OPTION_LABEL[option.id]}
                  </span>
                  <span className="jp text-sm leading-6">
                    <InlineLite text={option.text} />
                  </span>
                </button>
              );
            })}
          </div>

          {error ? <p className="mt-3 text-sm text-error">{error}</p> : null}

          <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <button type="button" className="btn" onClick={() => goTo(index - 1)} disabled={index === 0}>
              <ArrowLeft className="size-4" />
              前へ
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => goTo(index + 1)}
              disabled={index === questions.length - 1}
            >
              次へ
              <ArrowRight className="size-4" />
            </button>
            <button
              type="button"
              className={cn("btn ml-auto", flags.includes(question.id) && "border-warning/50 text-warning")}
              onClick={toggleFlag}
            >
              <Flag className="size-4" />
              {flags.includes(question.id) ? "フラグ解除" : "後で見直す"}
            </button>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold">解答状況</p>
              <span className="mono text-[0.65rem] text-muted">
                {answeredCount}/{questions.length}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-6 gap-1.5">
              {questions.map((item, itemIndex) => {
                const answered = Boolean(answers[item.id]);
                const flagged = flags.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => goTo(itemIndex)}
                    aria-label={`問${itemIndex + 1}${answered ? " 解答済み" : " 未解答"}${flagged ? " フラグ" : ""}`}
                    aria-current={itemIndex === index ? "true" : undefined}
                    className={cn(
                      "mono relative grid h-8 place-items-center rounded-md border text-[0.65rem] transition-colors",
                      itemIndex === index
                        ? "border-accent bg-accent text-accent-fg"
                        : answered
                          ? "border-accent/30 bg-bg-soft text-accent"
                          : "border-border bg-surface text-muted hover:border-accent/50",
                    )}
                  >
                    {itemIndex + 1}
                    {flagged ? (
                      <span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-warning" />
                    ) : null}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-[0.62rem] text-muted">
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-sm bg-accent" />
                現在
              </span>
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-sm bg-bg-soft" />
                解答済み
              </span>
              <span className="flex items-center gap-1">
                <span className="size-2 rounded-sm bg-warning" />
                フラグ
              </span>
            </div>
          </div>

          <div className="card space-y-2 p-4 text-xs leading-5 text-muted">
            <p className="font-semibold text-fg">本番との違い</p>
            <p>本番は CBT で 60 問・120 分。本模擬は問題バンクから抽出した非公式の練習です。</p>
            <p>IPA の IRT 評価点や合否判定とは異なります。素点と分野別傾向のみ表示します。</p>
            <p>残り時間が 0 になると自動提出されます。回答は 15 秒ごとに保存されます。</p>
          </div>

          <button
            type="button"
            className="btn w-full"
            onClick={() => void submit(false)}
            disabled={submitting}
          >
            <Check className="size-4" />
            解答を確定して提出
          </button>
        </aside>
      </main>
      {remaining === 0 && submitting ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-bg">
          <div className="card flex items-center gap-3 px-5 py-4 text-sm">
            <Loader2 className="size-4 animate-spin text-accent" />
            時間終了。自動採点しています…
          </div>
        </div>
      ) : null}
    </div>
  );
}
