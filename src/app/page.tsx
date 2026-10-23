import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CalendarDays,
  CheckCircle2,
  Clock,
  Flame,
  RotateCcw,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
} from "lucide-react";
import { ALL_LESSONS, ALL_QUESTIONS } from "@/content";
import { getLearner } from "@/lib/session";
import {
  getAreaProgress,
  getProgressSnapshot,
  MASTERY_LABEL,
} from "@/lib/progress";
import { getStudyPlan } from "@/lib/db/store";
import { Badge, LinkButton, ProgressBar, Stat } from "@/components/ui/primitives";
import { formatDateTime, formatDuration, percent, todayKey } from "@/lib/utils";

export const dynamic = "force-dynamic";

function ReadinessRing({ score }: { score: number }) {
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;
  return (
    <svg viewBox="0 0 120 120" className="size-28" role="img" aria-label={`暫定準備度 ${score}%`}>
      <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--border)" strokeWidth="8" />
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 60 60)"
      />
      <text x="60" y="64" textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--fg)">
        {score}
      </text>
      <text x="60" y="80" textAnchor="middle" fontSize="8" fill="var(--muted)">
        / 100 暫定
      </text>
    </svg>
  );
}

export default async function DashboardPage() {
  const { id } = await getLearner();
  const snapshot = getProgressSnapshot(id);
  const areaProgress = getAreaProgress(snapshot);
  const nextLesson = snapshot.nextLessons[0];
  const plan = getStudyPlan(id);
  const planDays = plan?.plan as { days?: Array<{ date: string; kind: string; title: string; minutes: number }> } | null;
  const todayPlan = planDays?.days?.find((day) => day.date === todayKey());

  return (
    <div className="animate-in">
      <header className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Dashboard · {todayKey()}</p>
          <h1 className="display mt-1.5 text-3xl font-semibold md:text-[2.6rem]">
            今日の30分が、合格を近づける。
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
            SG の学習状況を、レッスン・演習・復習・模擬試験から一箇所に集約しています。読んだだけでは習得にせず、複数回の解答で判定します。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <LinkButton href="/practice" variant="primary">
            <Sparkles className="size-4" />
            10問クイズ
          </LinkButton>
          <LinkButton href="/mock">
            <Timer className="size-4" />
            模擬試験
          </LinkButton>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Syllabus"
          value={`${snapshot.lessonPercent}%`}
          sub={`${snapshot.completedLessons}/${snapshot.lessonCount} レッスン完了`}
        />
        <Stat
          label="Accuracy"
          value={`${snapshot.recentAccuracy}%`}
          sub={`直近${Math.min(120, snapshot.attemptCount)}回 · 全${snapshot.attemptCount}回`}
        />
        <Stat
          label="Review due"
          value={snapshot.reviewCounts.due}
          sub={`期限到来 / 全${snapshot.reviewCounts.total}件`}
          tone={snapshot.reviewCounts.due > 0 ? "var(--warning)" : undefined}
        />
        <Stat
          label="Study streak"
          value={`${snapshot.streakDays}日`}
          sub={`今日 ${snapshot.minutesToday}分 · 週 ${snapshot.minutesThisWeek}分`}
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <section className="card relative overflow-hidden p-5 md:p-7">
          <div className="absolute right-0 top-0 size-40 rounded-full bg-accent/5 blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-full bg-accent-soft text-accent">
                <BookOpen className="size-4" />
              </span>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Continue learning
              </p>
              {todayPlan ? <Badge tone="accent" className="ml-auto">今日のプラン</Badge> : null}
            </div>
            {nextLesson ? (
              <>
                <h2 className="display mt-3 text-2xl font-semibold">{nextLesson.title}</h2>
                <p className="mt-1.5 max-w-xl text-sm leading-7 text-muted">{nextLesson.summary}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Badge>{nextLesson.readingMinutes}分</Badge>
                  <Badge>{nextLesson.sections.length}セクション</Badge>
                  <Badge>{nextLesson.titleEn}</Badge>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link href={`/learn/${nextLesson.id}`} className="btn btn-primary">
                    続きを読む
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href={`/practice/run?lessonId=${encodeURIComponent(nextLesson.id)}&count=10`}
                    className="btn"
                  >
                    先に問題を解く
                  </Link>
                </div>
              </>
            ) : (
              <div className="mt-3">
                <h2 className="display text-2xl font-semibold">学習コンテンツを準備中</h2>
                <p className="mt-2 text-sm text-muted">レッスンが読み込まれると、ここに次の一歩が表示されます。</p>
              </div>
            )}
            {todayPlan ? (
              <div className="mt-5 rounded-xl border border-border bg-surface-2 p-3">
                <p className="text-[0.65rem] font-semibold text-muted">今日の予定</p>
                <p className="mt-0.5 text-sm">{todayPlan.title}</p>
                <p className="mono text-[0.65rem] text-muted">{todayPlan.minutes}分</p>
              </div>
            ) : null}
          </div>
        </section>

        <section className="card flex flex-col items-center p-5 text-center">
          <div className="flex w-full items-center justify-between">
            <p className="eyebrow">Readiness</p>
            <Badge tone={snapshot.readiness.confidence === "high" ? "success" : snapshot.readiness.confidence === "medium" ? "warning" : "neutral"}>
              信頼度 {snapshot.readiness.confidence === "high" ? "高" : snapshot.readiness.confidence === "medium" ? "中" : "低"}
            </Badge>
          </div>
          <ReadinessRing score={snapshot.readiness.score} />
          <p className="mt-1 text-sm font-semibold">暫定準備度</p>
          <p className="mt-1 text-[0.68rem] leading-5 text-muted">{snapshot.readiness.note}</p>
          <div className="mt-3 grid w-full grid-cols-2 gap-2 text-left">
            <div className="rounded-lg border border-border bg-surface-2 p-2.5">
              <p className="text-[0.6rem] text-muted">レッスン</p>
              <p className="mono text-sm font-semibold">{snapshot.lessonPercent}%</p>
            </div>
            <div className="rounded-lg border border-border bg-surface-2 p-2.5">
              <p className="text-[0.6rem] text-muted">模擬</p>
              <p className="mono text-sm font-semibold">{snapshot.lastMockAccuracy ? `${snapshot.lastMockAccuracy}%` : "—"}</p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
        <section className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">8 areas</p>
              <h2 className="mt-1 text-sm font-semibold">分野の進捗</h2>
            </div>
            <Link href="/learn" className="text-[0.7rem] font-semibold text-accent hover:underline">
              学習マップ
            </Link>
          </div>
          <div className="mt-3 space-y-3">
            {areaProgress.map((area) => (
              <Link key={area.areaId} href={`/learn/${area.areaId}`} className="group block">
                <div className="flex items-center justify-between text-[0.7rem]">
                  <span className="truncate group-hover:text-accent">{area.title}</span>
                  <span className="mono shrink-0 text-muted">
                    {area.completedLessons}/{area.totalLessons}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <ProgressBar value={area.percent} height={5} />
                  <span className="mono w-8 text-right text-[0.6rem] text-muted">{area.percent}%</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Weak points</p>
              <h2 className="mt-1 text-sm font-semibold">いま伸ばすべき分野</h2>
            </div>
            <Link href="/statistics" className="text-[0.7rem] font-semibold text-accent hover:underline">
              統計
            </Link>
          </div>
          {snapshot.weakTopics.length === 0 ? (
            <div className="mt-4 rounded-lg border border-dashed border-border p-4 text-center text-xs leading-5 text-muted">
              まだ十分な演習データがありません。5〜10問解くと、誤答の傾向がここに表示されます。
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {snapshot.weakTopics.slice(0, 5).map((topic) => (
                <Link
                  key={topic.topic.id}
                  href={`/practice/${topic.topic.id}`}
                  className="flex items-center gap-3 rounded-lg border border-border bg-surface-2 px-3 py-2.5 transition-colors hover:border-accent/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{topic.topic.title}</p>
                    <p className="mt-0.5 text-[0.6rem] text-muted">
                      {topic.attempts}回 · {topic.uniqueAttempted}問 · {MASTERY_LABEL[topic.mastery]}
                    </p>
                  </div>
                  <span className="mono text-xs font-semibold text-warning">{topic.accuracy}%</span>
                  <ArrowRight className="size-3.5 text-muted" />
                </Link>
              ))}
            </div>
          )}
          {snapshot.dueReviews.length > 0 ? (
            <Link href="/review" className="btn mt-3 w-full text-xs">
              <RotateCcw className="size-3.5" />
              復習待ち {snapshot.reviewCounts.due} 件を開く
            </Link>
          ) : null}
        </section>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">学習のリズム</h2>
            <span className="text-[0.65rem] text-muted">直近14日</span>
          </div>
          <div className="mt-4 flex h-28 items-end gap-1.5" role="img" aria-label="直近14日の学習時間">
            {Array.from({ length: 14 }, (_, index) => {
              const date = new Date(Date.now() - (13 - index) * 86_400_000).toISOString().slice(0, 10);
              const minutes = snapshot.studyDays.find((day) => day.day === date)?.minutes ?? 0;
              const height = Math.min(100, (minutes / 60) * 100);
              return (
                <div key={date} className="group flex flex-1 flex-col items-center justify-end gap-1">
                  <div
                    className="w-full rounded-t-sm bg-accent/25 transition-colors group-hover:bg-accent/60"
                    style={{ height: `${Math.max(4, height)}%` }}
                    title={`${date}: ${minutes}分`}
                  />
                  <span className="text-[0.5rem] text-muted">{date.slice(8)}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center gap-3 text-[0.65rem] text-muted">
            <span className="flex items-center gap-1"><Flame className="size-3 text-warning" />連続 {snapshot.streakDays}日</span>
            <span className="flex items-center gap-1"><Clock className="size-3" />今週 {snapshot.minutesThisWeek}分</span>
            <span className="flex items-center gap-1"><TrendingUp className="size-3" />誤答 {snapshot.reviewQuestions.length}問</span>
          </div>
        </section>

        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-border bg-surface-2/60 px-4 py-2.5">
            <h2 className="text-sm font-semibold">最近の演習</h2>
            <Link href="/review" className="text-[0.65rem] text-accent hover:underline">すべて見る</Link>
          </div>
          {snapshot.recentAttempts.length === 0 ? (
            <div className="p-5 text-center text-xs leading-6 text-muted">
              まだ解答履歴がありません。<Link href="/practice" className="text-accent">10問クイズ</Link>から始めましょう。
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {snapshot.recentAttempts.slice(0, 6).map((attempt, index) => {
                const question = ALL_QUESTIONS.find((item) => item.id === attempt.questionId);
                return (
                  <li key={`${attempt.attemptedAt}-${index}`} className="flex items-start gap-3 px-4 py-2.5">
                    <span className={`mt-1 grid size-4 shrink-0 place-items-center rounded-full text-[0.55rem] text-white ${attempt.correct ? "bg-success" : "bg-error"}`}>
                      {attempt.correct ? "○" : "×"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-xs">
                        {question ? question.stem : attempt.questionId}
                      </p>
                      <p className="mt-0.5 text-[0.6rem] text-muted">
                        {formatDateTime(attempt.attemptedAt)} · {attempt.mode}
                      </p>
                    </div>
                    {question ? (
                      <Link href={`/practice/question/${question.id}`} className="text-[0.65rem] text-accent hover:underline">
                        解説
                      </Link>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      {snapshot.mockHistory.length > 0 ? (
        <section className="card mt-5 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="size-4 text-accent" />
              <h2 className="text-sm font-semibold">模擬試験</h2>
            </div>
            <Link href="/mock" className="text-[0.7rem] font-semibold text-accent hover:underline">履歴</Link>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {snapshot.mockHistory.slice(0, 3).map((attempt) => (
              <Link key={attempt.id} href={`/mock/results/${attempt.id}`} className="rounded-lg border border-border bg-surface-2 p-3 hover:border-accent/50">
                <p className="text-[0.65rem] text-muted">{formatDateTime(attempt.startedAt)}</p>
                <p className="mono mt-1 text-xl font-semibold">{percent(attempt.correct, attempt.total)}%</p>
                <p className="text-[0.6rem] text-muted">
                  {attempt.correct}/{attempt.total} · {formatDuration(attempt.durationSec)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {snapshot.completedLessons === 0 && snapshot.attemptCount === 0 ? (
        <section className="mt-6 rounded-xl border border-accent/25 bg-accent-soft/30 p-5">
          <div className="flex flex-wrap items-center gap-4">
            <CalendarDays className="size-5 text-accent" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">最初の一歩</p>
              <p className="mt-0.5 text-xs leading-5 text-muted">
                目標日から逆算した学習プランを作れます。まずは1レッスン+5問から。
              </p>
            </div>
            <Link href="/plan" className="btn btn-primary text-xs">学習プランを作る</Link>
          </div>
        </section>
      ) : null}

      {ALL_LESSONS.length === 0 ? (
        <section className="mt-6 card p-6 text-center text-sm text-muted">
          コンテンツを準備中です。しばらくしてから再読み込みしてください。
        </section>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center gap-2 text-[0.65rem] text-muted">
        <CheckCircle2 className="size-3.5 text-success" />
        <span>学習履歴はブラウザの匿名プロフィールに紐づけて保存されます。</span>
        <Link href="/about" className="text-accent hover:underline">データと出典について</Link>
      </div>
    </div>
  );
}
