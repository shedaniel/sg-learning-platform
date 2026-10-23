"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  CircleAlert,
  Loader2,
  RotateCcw,
  X,
} from "lucide-react";
import type { Question } from "@/lib/content/types";
import { OPTION_LABEL } from "@/lib/content/option-labels";
import type { QuizConfig } from "@/lib/quiz";
import { cn, formatClock, percent } from "@/lib/utils";
import { ProgressBar } from "@/components/ui/primitives";

interface QuizRunnerProps {
  config: QuizConfig & { mode?: string };
  title: string;
  feedback?: "instant" | "end";
}

interface Answer {
  selected: string;
  correct: boolean;
  elapsedMs: number;
}

export function InlineLite({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\{\{term:[^}]+\}\})/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={index}>{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code key={index} className="rounded bg-bg-soft px-1 py-0.5 font-mono text-[0.85em]">
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith("{{term:")) {
          const label = part.slice(7, -2).split("|")[1] ?? part.slice(7, -2);
          return (
            <span key={index} className="font-semibold text-accent">
              {label}
            </span>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

export function Presentation({ question }: { question: Question }) {
  if (!question.presentation?.length) return null;
  return (
    <div className="mb-4 space-y-3">
      {question.presentation.map((block, index) => {
        if (block.type === "table") {
          return (
            <div key={index} className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full min-w-[440px] border-collapse text-left text-xs">
                {block.caption ? (
                  <caption className="border-b border-border bg-surface-2 px-3 py-2 text-left font-semibold text-muted">
                    {block.caption}
                  </caption>
                ) : null}
                <thead>
                  <tr className="border-b border-border bg-surface-2/70">
                    {block.headers.map((header, cellIndex) => (
                      <th key={cellIndex} className="px-3 py-2 font-semibold text-muted">
                        <InlineLite text={header} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b border-border last:border-0">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-3 py-2 align-top leading-5">
                          <InlineLite text={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={index} className="list-disc space-y-1 pl-5 text-xs leading-6 text-muted">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <InlineLite text={item} />
                </li>
              ))}
            </ul>
          );
        }
        if (block.type === "steps") {
          return (
            <ol key={index} className="list-decimal space-y-1 pl-5 text-xs leading-6 text-muted">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  <span className="font-semibold">{item.title}: </span>
                  <InlineLite text={item.text} />
                </li>
              ))}
            </ol>
          );
        }
        if (block.type === "callout") {
          return (
            <div key={index} className="rounded-lg border border-border bg-surface-2 p-3 text-xs leading-6">
              <p className="font-semibold">{block.title}</p>
              <p className="text-muted">
                <InlineLite text={block.text} />
              </p>
            </div>
          );
        }
        if (block.type === "p" || block.type === "lead") {
          return (
            <p key={index} className="text-sm leading-7 text-muted">
              <InlineLite text={block.text} />
            </p>
          );
        }
        return null;
      })}
    </div>
  );
}

function ScoreRing({ value }: { value: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;
  return (
    <svg viewBox="0 0 140 140" className="size-36" role="img" aria-label={`正答率 ${value}%`}>
      <circle cx="70" cy="70" r={radius} fill="none" stroke="var(--border)" strokeWidth="10" />
      <circle
        cx="70"
        cy="70"
        r={radius}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 70 70)"
      />
      <text
        x="70"
        y="76"
        textAnchor="middle"
        fontSize="26"
        fontWeight="700"
        fill="var(--fg)"
      >
        {value}%
      </text>
    </svg>
  );
}

export function QuizRunner({ config, title, feedback = "instant" }: QuizRunnerProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [startedAt, setStartedAt] = useState<number>(0);
  const [questionStartedAt, setQuestionStartedAt] = useState<number>(0);
  const posted = useRef<Set<string>>(new Set());

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setFinished(false);
    setAnswers({});
    setIndex(0);
    posted.current = new Set();
    try {
      const response = await fetch("/api/quiz/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const data = (await response.json()) as {
        attemptId?: string;
        questions?: Question[];
        error?: string;
      };
      if (!response.ok || !data.attemptId || !data.questions) {
        throw new Error(data.error ?? "クイズを開始できませんでした");
      }
      setAttemptId(data.attemptId);
      setQuestions(data.questions);
      setStartedAt(Date.now());
      setQuestionStartedAt(Date.now());
      setElapsed(0);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "クイズを開始できませんでした");
    } finally {
      setLoading(false);
    }
  }, [config]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!startedAt || finished) return;
    const timer = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [startedAt, finished]);

  const question = questions[index];
  const answer = question ? answers[question.id] : undefined;
  const revealed = feedback === "instant" && Boolean(answer);
  const answeredCount = Object.keys(answers).length;
  const correctCount = useMemo(
    () => Object.values(answers).filter((item) => item.correct).length,
    [answers],
  );
  const accuracy = percent(correctCount, questions.length);

  function selectOption(optionId: string) {
    if (!question || revealed || finished) return;
    const elapsedMs = Date.now() - questionStartedAt;
    const correct = optionId === question.correctOptionId;
    setAnswers((current) => ({
      ...current,
      [question.id]: { selected: optionId, correct, elapsedMs },
    }));
    setQuestionStartedAt(Date.now());
    if (feedback === "instant") {
      posted.current.add(question.id);
      void fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: question.id,
          selected: optionId,
          elapsedMs,
          mode: config.mode ?? "quiz",
          quizAttemptId: attemptId,
        }),
      });
    }
  }

  async function finish() {
    if (submitting) return;
    setSubmitting(true);
    try {
      if (feedback === "end") {
        await Promise.all(
          questions.map((item) => {
            const record = answers[item.id];
            if (!record) return Promise.resolve();
            return fetch("/api/attempts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                questionId: item.id,
                selected: record.selected,
                elapsedMs: record.elapsedMs,
                mode: config.mode ?? "quiz",
                quizAttemptId: attemptId,
              }),
            });
          }),
        );
      }
      const finalCorrect = questions.filter((item) => answers[item.id]?.correct).length;
      if (attemptId) {
        await fetch("/api/quiz/finish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            attemptId,
            answered: Object.keys(answers).length,
            correct: finalCorrect,
            minutes: Math.max(1, Math.round((Date.now() - startedAt) / 60000)),
          }),
        });
      }
      setFinished(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  }

  function goTo(next: number) {
    if (next < 0 || next >= questions.length) return;
    setIndex(next);
    setQuestionStartedAt(Date.now());
  }

  if (loading) {
    return (
      <div className="card flex min-h-64 flex-col items-center justify-center gap-3 p-8 text-sm text-muted">
        <Loader2 className="size-6 animate-spin text-accent" />
        問題を準備しています…
      </div>
    );
  }

  if (error) {
    return (
      <div className="card flex min-h-64 flex-col items-center justify-center gap-3 p-8 text-center">
        <CircleAlert className="size-6 text-warning" />
        <p className="font-semibold">クイズを開始できませんでした</p>
        <p className="max-w-md text-sm text-muted">{error}</p>
        <button type="button" className="btn" onClick={() => void load()}>
          再試行
        </button>
      </div>
    );
  }

  if (finished) {
    const weak = questions.filter((item) => !answers[item.id]?.correct);
    return (
      <div className="space-y-5 animate-in">
        <div className="card overflow-hidden">
          <div className="border-b border-border bg-surface-2 px-5 py-3 text-xs font-semibold text-muted">
            {title} · 結果
          </div>
          <div className="flex flex-col items-center gap-6 p-6 md:flex-row md:items-center md:p-8">
            <ScoreRing value={accuracy} />
            <div className="flex-1 text-center md:text-left">
              <p className="eyebrow">RESULT</p>
              <h2 className="display mt-1 text-2xl font-semibold">
                {correctCount} / {questions.length} 問正解
              </h2>
              <p className="mt-2 text-sm text-muted">
                所要時間 {formatClock(elapsed)}。誤答は自動的に復習キューへ追加されました。
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                <button type="button" className="btn btn-primary" onClick={() => void load()}>
                  <RotateCcw className="size-4" />
                  もう一度
                </button>
                <Link href="/review" className="btn">
                  復習キューを見る
                </Link>
                <Link href="/statistics" className="btn btn-ghost">
                  統計
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h3 className="text-sm font-semibold">問題ごとの結果</h3>
          <div className="mt-3 space-y-2">
            {questions.map((item, itemIndex) => {
              const record = answers[item.id];
              return (
                <div
                  key={item.id}
                  className="flex flex-wrap items-start gap-3 rounded-lg border border-border bg-surface-2 px-3 py-2.5"
                >
                  <span
                    className={cn(
                      "mono mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-[0.6rem] text-white",
                      record?.correct ? "bg-success" : "bg-error",
                    )}
                  >
                    {record?.correct ? <Check className="size-3" /> : <X className="size-3" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs leading-5 text-muted">
                      問{itemIndex + 1} · {item.part === "B" ? "科目B" : "科目A"} ·{" "}
                      {item.source.kind === "official" ? "IPA公開問題" : "独自問題"}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-sm">
                      <InlineLite text={item.stem} />
                    </p>
                  </div>
                  <Link
                    href={`/practice/question/${item.id}`}
                    className="text-xs font-semibold text-accent hover:underline"
                  >
                    解説
                  </Link>
                </div>
              );
            })}
          </div>
          {weak.length > 0 ? (
            <p className="mt-4 rounded-lg bg-warning/10 px-3 py-2 text-xs leading-5 text-warning">
              誤答 {weak.length} 問。解説を読み、翌日にもう一度解いてください。同じ問題を連続で見直すより、間隔を空けた復習の方が定着します。
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  if (!question) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
        <span className="font-semibold text-fg">{title}</span>
        <span className="chip">
          問 {index + 1} / {questions.length}
        </span>
        <span className="chip">{question.part === "B" ? "科目B" : "科目A"}</span>
        <span className="chip">{question.source.kind === "official" ? "IPA公開問題" : "独自問題"}</span>
        <span className="ml-auto mono">{formatClock(elapsed)}</span>
      </div>
      <ProgressBar value={((index + 1) / questions.length) * 100} height={4} label="出題進捗" />

      <div className="card p-5 md:p-7">
        <div className="mb-4 flex flex-wrap items-start gap-4">
          <div className="flex-1">
            <p className="jp whitespace-pre-line text-[0.98rem] font-medium leading-8">
              <InlineLite text={question.stem} />
            </p>
          </div>
          <Link
            href={`/practice/question/${question.id}`}
            className="btn btn-ghost size-8 shrink-0 rounded-full p-0"
            aria-label="問題を単独で開く"
            title="単独で開く"
          >
            <Bookmark className="size-4" />
          </Link>
        </div>

        <Presentation question={question} />

        <div className="mt-5 space-y-2" role="group" aria-label="選択肢">
          {question.options.map((option) => {
            const isSelected = answer?.selected === option.id;
            const isCorrect = option.id === question.correctOptionId;
            const showCorrect = revealed && isCorrect;
            const showWrong = revealed && isSelected && !isCorrect;
            return (
              <button
                key={option.id}
                type="button"
                disabled={revealed}
                onClick={() => selectOption(option.id)}
                aria-pressed={isSelected}
                className={cn(
                  "group flex w-full items-start gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors",
                  !revealed && "border-border bg-surface hover:border-accent/60 hover:bg-surface-2",
                  showCorrect && "border-success/60 bg-success/10",
                  showWrong && "border-error/60 bg-error/10",
                  revealed && !showCorrect && !showWrong && "border-border bg-surface opacity-65",
                )}
              >
                <span
                  className={cn(
                    "mono mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border text-xs font-semibold",
                    showCorrect && "border-success bg-success text-white",
                    showWrong && "border-error bg-error text-white",
                    !showCorrect && !showWrong && "border-border-strong text-muted",
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

        {revealed ? (
          <div className="mt-5 space-y-3 animate-in" aria-live="polite">
            <div
              className={cn(
                "rounded-xl border px-4 py-3",
                answer?.correct
                  ? "border-success/30 bg-success/10"
                  : "border-error/30 bg-error/10",
              )}
            >
              <p className={cn("text-sm font-semibold", answer?.correct ? "text-success" : "text-error")}>
                {answer?.correct ? "正解" : "不正解"} · 正答は {OPTION_LABEL[question.correctOptionId]}
              </p>
              <p className="jp mt-1 text-sm leading-7">
                <InlineLite text={question.explanation.correct} />
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface-2 px-4 py-3">
              <p className="text-xs font-semibold text-muted">なぜそうなるか</p>
              <ul className="mt-1.5 space-y-1">
                {question.explanation.why.map((item, itemIndex) => (
                  <li key={itemIndex} className="jp flex gap-2 text-sm leading-6">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                    <InlineLite text={item} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-1.5 md:grid-cols-2">
              {question.options
                .filter((option) => option.id !== question.correctOptionId)
                .map((option) => (
                  <div
                    key={option.id}
                    className="rounded-lg border border-border px-3 py-2 text-xs leading-5 text-muted"
                  >
                    <span className="mono mr-1.5 font-semibold text-fg">
                      {OPTION_LABEL[option.id]}
                    </span>
                    {question.explanation.optionNotes[option.id] ? (
                      <InlineLite text={question.explanation.optionNotes[option.id]!} />
                    ) : (
                      <InlineLite text={option.text} />
                    )}
                  </div>
                ))}
            </div>
            {question.lessonIds[0] ? (
              <Link
                href={`/learn/${question.lessonIds[0]}`}
                className="inline-flex text-xs font-semibold text-accent hover:underline"
              >
                関連レッスンを読み直す →
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="btn" onClick={() => goTo(index - 1)} disabled={index === 0}>
          <ArrowLeft className="size-4" />
          前へ
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => goTo(index + 1)}
          disabled={index === questions.length - 1}
        >
          次へ
          <ArrowRight className="size-4" />
        </button>
        <span className="ml-auto text-xs text-muted">
          解答済み {answeredCount} / {questions.length}
        </span>
        <button
          type="button"
          className="btn"
          onClick={() => void finish()}
          disabled={submitting || (feedback === "end" && answeredCount === 0)}
        >
          {submitting ? "採点中…" : "結果を見る"}
        </button>
      </div>

      <div className="card p-3">
        <div className="flex flex-wrap gap-1.5">
          {questions.map((item, itemIndex) => {
            const record = answers[item.id];
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => goTo(itemIndex)}
                aria-label={`問${itemIndex + 1}へ`}
                className={cn(
                  "mono size-7 rounded-md border text-[0.65rem] transition-colors",
                  itemIndex === index
                    ? "border-accent bg-accent text-accent-fg"
                    : record
                      ? feedback === "instant"
                        ? record.correct
                          ? "border-success/40 bg-success/10 text-success"
                          : "border-error/40 bg-error/10 text-error"
                        : "border-accent/40 bg-accent-soft text-accent"
                      : "border-border bg-surface text-muted hover:border-accent/50",
                )}
              >
                {itemIndex + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
