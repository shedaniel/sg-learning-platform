import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AlertTriangle, ArrowRight, Check, Clock, RotateCcw, X } from "lucide-react";
import { QUESTION_BY_ID, TOPIC_BY_SLUG, lessonsForTopic } from "@/content";
import type { MockResult } from "@/lib/exam";
import { getMockAttempt } from "@/lib/db/store";
import { getLearner } from "@/lib/session";
import { PageHeader, Badge, ProgressBar } from "@/components/ui/primitives";
import { formatDateTime, formatDuration, percent } from "@/lib/utils";
import { PART_LABEL, DIFFICULTY_LABEL } from "@/content";
import { optionLabel } from "@/lib/content/option-labels";

export const dynamic = "force-dynamic";

function ResultRing({ value }: { value: number }) {
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;
  return (
    <svg viewBox="0 0 160 160" className="size-40" role="img" aria-label={`素点正答率 ${value}%`}>
      <circle cx="80" cy="80" r={radius} fill="none" stroke="var(--border)" strokeWidth="11" />
      <circle
        cx="80"
        cy="80"
        r={radius}
        fill="none"
        stroke="var(--chart-2)"
        strokeWidth="11"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 80 80)"
      />
      <text x="80" y="78" textAnchor="middle" fontSize="30" fontWeight="700" fill="var(--foreground)">
        {value}%
      </text>
      <text x="80" y="98" textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">
        素点正答率
      </text>
    </svg>
  );
}

export default async function MockResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { id: profileId } = await getLearner();
  const attempt = getMockAttempt(id, profileId);
  if (!attempt) notFound();
  if (!attempt.submittedAt) redirect(`/mock/run/${id}`);
  const result = attempt.result as MockResult | null;
  if (!result) notFound();

  const weakTopics = result.weakTopicIds
    .map((topicId) => TOPIC_BY_SLUG.get(topicId))
    .filter((topic) => Boolean(topic));
  const revisionLessons = weakTopics
    .flatMap((topic) => (topic ? lessonsForTopic(topic.id).slice(0, 1) : []))
    .filter((lesson, index, list) => list.findIndex((item) => item.id === lesson.id) === index)
    .slice(0, 4);

  return (
    <div className="">
      <PageHeader
        eyebrow={`Mock result · ${formatDateTime(attempt.submittedAt)}`}
        title="模擬試験の結果"
        description="素点と分野別の傾向です。IPA の IRT 評価点・合否判定ではありません。誤答は自動的に復習キューへ登録されました。"
        actions={
          <>
            <Link href="/mock" className="btn">
              <RotateCcw className="size-4" />
              もう一度
            </Link>
            <Link href="/review" className="btn btn-primary">
              復習を始める
              <ArrowRight className="size-4" />
            </Link>
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="card flex flex-col items-center gap-5 p-6 text-center md:flex-row md:text-left">
          <ResultRing value={result.accuracy} />
          <div>
            <p className="eyebrow">RAW SCORE</p>
            <p className="mono mt-1 text-3xl font-semibold">
              {result.correct}
              <span className="text-lg font-normal text-muted-foreground"> / {result.total}</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              解答 {result.answered} 問 · 未解答 {result.unanswered} 問
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              所要 {formatDuration(result.totalElapsedMs / 1000)} · 1問平均{" "}
              {Math.round(result.averageElapsedMs / 1000)}秒
            </p>
            <div className="mt-3 flex justify-center gap-1.5 md:justify-start">
              <Badge tone="accent">科目A {result.byPart.A.accuracy}%</Badge>
              <Badge tone="accent">科目B {result.byPart.B.accuracy}%</Badge>
            </div>
          </div>
        </section>

        <section className="card p-5">
          <h2 className="text-xs font-semibold">分野別</h2>
          <div className="mt-3 space-y-2.5">
            {result.byTopic.slice(0, 10).map((row) => {
              const topic = TOPIC_BY_SLUG.get(row.topicId);
              return (
                <div key={row.topicId}>
                  <div className="flex items-center justify-between gap-3 text-[0.7rem]">
                    <span className="truncate">{topic?.title ?? row.topicId}</span>
                    <span className="mono shrink-0 text-muted-foreground">
                      {row.correct}/{row.total} · {row.accuracy}%
                    </span>
                  </div>
                  <ProgressBar
                    value={row.accuracy}
                    height={4}
                    tone={row.accuracy < 60 ? "var(--destructive-foreground)" : row.accuracy < 80 ? "var(--warning-foreground)" : "var(--success-foreground)"}
                    className="mt-1"
                  />
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        {(["A", "B"] as const).map((part) => (
          <div key={part} className="card p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold">{PART_LABEL[part]}</p>
              <span className="mono text-lg font-semibold">{result.byPart[part].accuracy}%</span>
            </div>
            <ProgressBar value={result.byPart[part].accuracy} className="mt-2" height={6} />
            <p className="mt-1.5 text-[0.65rem] text-muted-foreground">
              {result.byPart[part].correct}/{result.byPart[part].total}問
            </p>
          </div>
        ))}
        <div className="card p-5">
          <p className="text-xs font-semibold">難易度別</p>
          <div className="mt-2 space-y-1.5">
            {result.byDifficulty.map((row) => (
              <div key={row.difficulty} className="flex items-center justify-between text-[0.7rem]">
                <span className="text-muted-foreground">{DIFFICULTY_LABEL[row.difficulty] ?? row.difficulty}</span>
                <span className="mono">{row.accuracy}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="card mt-5 p-5">
        <div className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/5 p-3">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning-foreground" />
          <p className="text-[0.7rem] leading-5 text-muted-foreground">
            この結果は学習用の素点です。IPA は IRT により評価点を算出し、総合600点/1000点で判定します。本サイトは公式の採点モデルを持たないため、合格可能性を断定しません。
          </p>
        </div>
        {weakTopics.length > 0 ? (
          <>
            <h2 className="mt-5 text-xs font-semibold">優先して復習する分野</h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {weakTopics.map((topic) => (
                <Link key={topic?.id} href={`/practice/${topic?.id}`} className="chip border-warning/30 bg-warning/10 text-warning-foreground hover:border-warning">
                  {topic?.title}
                </Link>
              ))}
            </div>
          </>
        ) : null}
        {revisionLessons.length > 0 ? (
          <>
            <h2 className="mt-4 text-xs font-semibold">おすすめの読み直し</h2>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {revisionLessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/learn/${lesson.id}`}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-xs hover:border-ring/50"
                >
                  <span className="truncate">{lesson.title}</span>
                  <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </>
        ) : null}
      </section>

      <section className="card mt-5 overflow-hidden">
        <div className="flex items-center justify-between border-b border-border bg-muted/60 px-4 py-2.5">
          <h2 className="text-xs font-semibold">問題別レビュー</h2>
          <span className="text-[0.65rem] text-muted-foreground">正答率の低い順ではありません</span>
        </div>
        <ul className="divide-y divide-border">
          {result.questions.map((detail, index) => {
            const question = QUESTION_BY_ID.get(detail.questionId);
            if (!question) return null;
            return (
              <li key={detail.questionId} className="flex items-start gap-3 px-4 py-3">
                <span
                  className={`mono mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-[0.6rem] text-white ${
                    detail.correct ? "bg-success" : "bg-destructive"
                  }`}
                >
                  {detail.correct ? <Check className="size-3" /> : <X className="size-3" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.62rem] text-muted-foreground">
                    問{index + 1} · {PART_LABEL[question.part]} ·{" "}
                    {question.source.kind === "official"
                      ? `IPA ${question.source.year} 問${question.source.questionNo}`
                      : "独自問題"}{" "}
                    · {formatDuration(detail.elapsedMs / 1000)}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs leading-5">{question.stem}</p>
                  <p className="mt-0.5 text-[0.65rem] text-muted-foreground">
                    選択: {detail.selected ? optionLabel(detail.selected) : "未解答"} / 正答: {optionLabel(detail.correctOptionId)}
                  </p>
                </div>
                <Link href={`/practice/question/${question.id}`} className="shrink-0 text-[0.7rem] font-semibold text-info-foreground hover:underline">
                  解説
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
