import Link from "next/link";
import { ArrowRight, Check, RotateCcw, X } from "lucide-react";
import { ALL_LESSONS, ALL_QUESTIONS } from "@/content";
import { getLearner } from "@/lib/session";
import {
  getAreaProgress,
  getProgressSnapshot,
  MASTERY_LABEL,
  MODE_LABEL,
} from "@/lib/progress";
import { Badge, LinkButton, PageHeader, ProgressBar } from "@/components/ui/primitives";
import { formatDateTime, formatDuration, percent } from "@/lib/utils";

export const dynamic = "force-dynamic";

const CONFIDENCE_LABEL = { high: "高", medium: "中", low: "低" } as const;

function SummaryRow({
  label,
  value,
  sub,
  emphasis,
}: {
  label: string;
  value: string | number;
  sub?: string;
  emphasis?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3">
      <dt className="text-[0.9375rem] text-muted-foreground">{label}</dt>
      <dd className="text-right">
        <span className={`mono text-lg font-semibold ${emphasis ? "text-warning-foreground" : ""}`}>
          {value}
        </span>
        {sub ? <span className="ml-1.5 text-[0.8125rem] text-muted-foreground">{sub}</span> : null}
      </dd>
    </div>
  );
}

export default async function DashboardPage() {
  const { id } = await getLearner();
  const snapshot = await getProgressSnapshot(id);
  const areaProgress = getAreaProgress(snapshot);
  const nextLesson = snapshot.nextLessons[0];
  const hasActivity = snapshot.completedLessons > 0 || snapshot.attemptCount > 0;
  const studyMinutes = snapshot.studyDays.reduce((total, day) => total + day.minutes, 0);

  return (
    <div>
      <PageHeader
        title="学習状況"
        description="レッスン・演習・復習・模擬試験の結果をまとめています。読んだだけでは習得とみなさず、複数回の解答で判定します。"
        actions={
          <>
            <LinkButton href="/practice/run?count=10" variant="primary" className="h-10 px-4">
              10問クイズ
            </LinkButton>
            <LinkButton href="/mock" className="h-10 px-4">
              模擬試験
            </LinkButton>
          </>
        }
      />

      {nextLesson ? (
        <section className="mb-10 flex flex-col gap-5 rounded-2xl border border-border bg-muted/50 p-5 md:flex-row md:items-center md:justify-between md:p-6">
          <div className="min-w-0">
            <p className="label">{!hasActivity ? "最初のレッスン" : "次のレッスン"}</p>
            <h2 className="display mt-1 text-xl">{nextLesson.title}</h2>
            <p className="jp mt-1.5 max-w-xl text-[0.9375rem] leading-7 text-muted-foreground">
              {nextLesson.summary}
            </p>
            <p className="mt-2 text-[0.8125rem] text-muted-foreground">
              {nextLesson.readingMinutes}分 · {nextLesson.sections.length}セクション
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <LinkButton href={`/learn/${nextLesson.id}`} variant="primary" className="h-10 px-4">
              {snapshot.completedLessons === 0 ? "読み始める" : "続きを読む"}
              <ArrowRight className="size-4" />
            </LinkButton>
            <LinkButton
              href={`/practice/run?lessonId=${encodeURIComponent(nextLesson.id)}&count=10`}
              className="h-10 px-4"
            >
              先に問題を解く
            </LinkButton>
          </div>
        </section>
      ) : ALL_LESSONS.length === 0 ? (
        <p className="mb-10 text-[0.9375rem] text-muted-foreground">
          コンテンツを準備中です。しばらくしてから再読み込みしてください。
        </p>
      ) : null}

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="space-y-12">
          <section aria-labelledby="areas-heading">
            <div className="flex items-baseline justify-between">
              <h2 id="areas-heading" className="text-lg font-semibold">
                分野ごとの進捗
              </h2>
              <Link href="/learn" className="text-[0.9375rem] font-medium text-info-foreground hover:underline">
                学習マップ
              </Link>
            </div>
            <ul className="mt-2 divide-y divide-border">
              {areaProgress.map((area) => (
                <li key={area.areaId}>
                  <Link
                    href={`/learn/${area.areaId}`}
                    className="group -mx-2 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 rounded-lg px-2 py-3 transition-colors hover:bg-muted sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)_3.5rem]"
                  >
                    <span className="truncate text-[0.9375rem] font-medium">{area.title}</span>
                    <span className="mono text-right text-[0.8125rem] text-muted-foreground sm:order-3">
                      {area.completedLessons}/{area.totalLessons}
                    </span>
                    <ProgressBar
                      value={area.percent}
                      height={6}
                      label={`${area.title}の進捗`}
                      className="col-span-2 sm:col-span-1"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="recent-heading">
            <div className="flex items-baseline justify-between">
              <h2 id="recent-heading" className="text-lg font-semibold">
                最近の演習
              </h2>
              {snapshot.recentAttempts.length > 0 ? (
                <Link href="/review" className="text-[0.9375rem] font-medium text-info-foreground hover:underline">
                  復習へ
                </Link>
              ) : null}
            </div>
            {snapshot.recentAttempts.length === 0 ? (
              <p className="mt-3 text-[0.9375rem] leading-7 text-muted-foreground">
                まだ解答履歴がありません。
                <Link href="/practice/run?count=10" className="font-medium text-info-foreground hover:underline">
                  10問クイズ
                </Link>
                から始められます。
              </p>
            ) : (
              <ul className="mt-2 divide-y divide-border">
                {snapshot.recentAttempts.slice(0, 6).map((attempt, index) => {
                  const question = ALL_QUESTIONS.find((item) => item.id === attempt.questionId);
                  return (
                    <li key={`${attempt.attemptedAt}-${index}`} className="flex items-start gap-3 py-3">
                      <span
                        className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-white ${attempt.correct ? "bg-success" : "bg-destructive"}`}
                        role="img"
                        aria-label={attempt.correct ? "正解" : "不正解"}
                      >
                        {attempt.correct ? <Check className="size-3" strokeWidth={3} /> : <X className="size-3" strokeWidth={3} />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 text-[0.9375rem]">{question ? question.stem : attempt.questionId}</p>
                        <p className="mt-0.5 text-[0.8125rem] text-muted-foreground">
                          {formatDateTime(attempt.attemptedAt)} · {MODE_LABEL[attempt.mode] ?? attempt.mode}
                        </p>
                      </div>
                      {question ? (
                        <Link
                          href={`/practice/question/${question.id}`}
                          className="shrink-0 text-[0.9375rem] font-medium text-info-foreground hover:underline"
                        >
                          解説
                        </Link>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {snapshot.mockHistory.length > 0 ? (
            <section aria-labelledby="mock-heading">
              <div className="flex items-baseline justify-between">
                <h2 id="mock-heading" className="text-lg font-semibold">
                  模擬試験の結果
                </h2>
                <Link href="/mock" className="text-[0.9375rem] font-medium text-info-foreground hover:underline">
                  すべて見る
                </Link>
              </div>
              <ul className="mt-2 divide-y divide-border">
                {snapshot.mockHistory.slice(0, 3).map((attempt) => (
                  <li key={attempt.id}>
                    <Link
                      href={`/mock/results/${attempt.id}`}
                      className="-mx-2 flex items-center justify-between gap-4 rounded-lg px-2 py-3 transition-colors hover:bg-muted"
                    >
                      <span className="text-[0.9375rem]">{formatDateTime(attempt.startedAt)}</span>
                      <span className="text-right">
                        <span className="mono text-lg font-semibold">{percent(attempt.correct, attempt.total)}%</span>
                        <span className="ml-2 text-[0.8125rem] text-muted-foreground">
                          {attempt.correct}/{attempt.total} · {formatDuration(attempt.durationSec)}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <aside className="space-y-10">
          <section aria-labelledby="summary-heading">
            <h2 id="summary-heading" className="text-lg font-semibold">
              これまでの記録
            </h2>
            <dl className="mt-1 divide-y divide-border">
              <SummaryRow
                label="レッスン完了"
                value={`${snapshot.completedLessons}/${snapshot.lessonCount}`}
                sub={`${snapshot.lessonPercent}%`}
              />
              <SummaryRow
                label="直近の正答率"
                value={snapshot.attemptCount > 0 ? `${snapshot.recentAccuracy}%` : "—"}
                sub={snapshot.attemptCount > 0 ? `${Math.min(120, snapshot.attemptCount)}回` : undefined}
              />
              <SummaryRow
                label="復習待ち"
                value={snapshot.reviewCounts.due}
                sub={`全${snapshot.reviewCounts.total}件`}
                emphasis={snapshot.reviewCounts.due > 0}
              />
              <SummaryRow
                label="解いた問題"
                value={snapshot.uniqueQuestionsAttempted}
                sub={`/ ${snapshot.questionCount}問`}
              />
              {studyMinutes > 0 ? (
                <SummaryRow label="直近14日の学習" value={`${studyMinutes}分`} />
              ) : null}
            </dl>
            {snapshot.dueReviews.length > 0 ? (
              <LinkButton href="/review" className="mt-3 h-10 w-full">
                <RotateCcw className="size-4" />
                復習待ち {snapshot.reviewCounts.due} 件を開く
              </LinkButton>
            ) : null}
          </section>

          <section aria-labelledby="readiness-heading">
            <div className="flex items-center justify-between gap-2">
              <h2 id="readiness-heading" className="text-lg font-semibold">
                暫定準備度
              </h2>
              <Badge
                tone={
                  snapshot.readiness.confidence === "high"
                    ? "success"
                    : snapshot.readiness.confidence === "medium"
                      ? "warning"
                      : "neutral"
                }
              >
                信頼度 {CONFIDENCE_LABEL[snapshot.readiness.confidence]}
              </Badge>
            </div>
            <p className="mt-2 flex items-baseline gap-1.5">
              <span className="mono text-3xl font-semibold">{snapshot.readiness.score}</span>
              <span className="text-[0.8125rem] text-muted-foreground">/ 100</span>
            </p>
            <ProgressBar value={snapshot.readiness.score} height={6} label="暫定準備度" className="mt-2" />
            <p className="mt-3 text-[0.8125rem] leading-6 text-muted-foreground">{snapshot.readiness.note}</p>
          </section>

          <section aria-labelledby="weak-heading">
            <h2 id="weak-heading" className="text-lg font-semibold">
              伸ばしたい分野
            </h2>
            {snapshot.weakTopics.length === 0 ? (
              <div className="mt-2 text-[0.9375rem] leading-7 text-muted-foreground">
                <p>5〜10問解くと、誤答の多いトピックがここに表示されます。</p>
                {!hasActivity && snapshot.nextLessons.length > 1 ? (
                  <ul className="mt-2 space-y-1">
                    {snapshot.nextLessons.slice(0, 3).map((lesson) => (
                      <li key={lesson.id}>
                        <Link href={`/learn/${lesson.id}`} className="font-medium text-info-foreground hover:underline">
                          {lesson.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : (
              <ul className="mt-1 divide-y divide-border">
                {snapshot.weakTopics.slice(0, 5).map((topic) => (
                  <li key={topic.topic.id}>
                    <Link
                      href={`/practice/${topic.topic.id}`}
                      className="-mx-2 flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[0.9375rem] font-medium">{topic.topic.title}</span>
                        <span className="text-[0.8125rem] text-muted-foreground">
                          {topic.attempts}回 · {MASTERY_LABEL[topic.mastery]}
                        </span>
                      </span>
                      <span className="mono text-[0.9375rem] font-semibold text-warning-foreground">{topic.accuracy}%</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>

      <p className="mt-14 text-[0.8125rem] text-muted-foreground">
        学習履歴はこのブラウザの匿名プロフィールに保存されます。
        <Link href="/about" className="ml-1 text-info-foreground hover:underline">
          データと出典について
        </Link>
      </p>
    </div>
  );
}
