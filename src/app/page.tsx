import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Clock,
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
        stroke="var(--chart-2)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 60 60)"
      />
      <text x="60" y="64" textAnchor="middle" fontSize="22" fontWeight="700" fill="var(--foreground)">
        {score}
      </text>
      <text x="60" y="80" textAnchor="middle" fontSize="8" fill="var(--muted-foreground)">
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

  return (
    <div className="">
      <header className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">概要 · {todayKey()}</p>
          <h1 className="display mt-1.5 text-3xl md:text-[2.5rem]">
            学習状況と、次の一歩。
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
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

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
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
          tone={snapshot.reviewCounts.due > 0 ? "var(--warning-foreground)" : undefined}
        />
        <Stat
          label="Attempted"
          value={snapshot.uniqueQuestionsAttempted}
          sub={`全${snapshot.questionCount}問 · ${snapshot.attemptCount}回解答`}
        />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <section className="card p-5 md:p-7">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-full bg-muted text-info-foreground">
                <BookOpen className="size-4" />
              </span>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Next lesson
              </p>
            </div>
            {nextLesson ? (
              <>
                <h2 className="display mt-3 text-2xl font-semibold">{nextLesson.title}</h2>
                <p className="mt-1.5 max-w-xl text-sm leading-7 text-muted-foreground">{nextLesson.summary}</p>
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
                <p className="mt-2 text-sm text-muted-foreground">レッスンが読み込まれると、ここに次の一歩が表示されます。</p>
              </div>
            )}
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
          <p className="mt-1 text-[0.68rem] leading-5 text-muted-foreground">{snapshot.readiness.note}</p>
          <div className="mt-3 grid w-full grid-cols-2 gap-2 text-left">
            <div className="rounded-lg border border-border bg-muted p-2.5">
              <p className="text-[0.6rem] text-muted-foreground">レッスン</p>
              <p className="mono text-sm font-semibold">{snapshot.lessonPercent}%</p>
            </div>
            <div className="rounded-lg border border-border bg-muted p-2.5">
              <p className="text-[0.6rem] text-muted-foreground">模擬</p>
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
            <Link href="/learn" className="text-[0.7rem] font-semibold text-info-foreground hover:underline">
              学習マップ
            </Link>
          </div>
          <div className="mt-3 space-y-3">
            {areaProgress.map((area) => (
              <Link key={area.areaId} href={`/learn/${area.areaId}`} className="group block">
                <div className="flex items-center justify-between text-[0.7rem]">
                  <span className="truncate group-hover:text-info-foreground">{area.title}</span>
                  <span className="mono shrink-0 text-muted-foreground">
                    {area.completedLessons}/{area.totalLessons}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <ProgressBar value={area.percent} height={5} />
                  <span className="mono w-8 text-right text-[0.6rem] text-muted-foreground">{area.percent}%</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="card self-start p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Weak points</p>
              <h2 className="mt-1 text-sm font-semibold">いま伸ばすべき分野</h2>
            </div>
            <Link href="/statistics" className="text-[0.7rem] font-semibold text-info-foreground hover:underline">
              統計
            </Link>
          </div>
          {snapshot.weakTopics.length === 0 ? (
            <div className="mt-3 rounded-lg border border-dashed border-border p-4 text-xs leading-5 text-muted-foreground">
              <p>まだ十分な演習データがありません。5〜10問解くと、誤答の傾向がここに表示されます。</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {snapshot.nextLessons.slice(0, 3).map((lesson) => (
                  <Link key={lesson.id} href={`/learn/${lesson.id}`} className="chip hover:border-ring/50">
                    {lesson.title}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-3 space-y-2">
              {snapshot.weakTopics.slice(0, 5).map((topic) => (
                <Link
                  key={topic.topic.id}
                  href={`/practice/${topic.topic.id}`}
                  className="flex items-center gap-3 rounded-lg border border-border bg-muted px-3 py-2.5 transition-colors hover:border-ring/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{topic.topic.title}</p>
                    <p className="mt-0.5 text-[0.6rem] text-muted-foreground">
                      {topic.attempts}回 · {topic.uniqueAttempted}問 · {MASTERY_LABEL[topic.mastery]}
                    </p>
                  </div>
                  <span className="mono text-xs font-semibold text-warning-foreground">{topic.accuracy}%</span>
                  <ArrowRight className="size-3.5 text-muted-foreground" />
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
        <section className="card self-start p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">学習ログ</h2>
            <span className="text-[0.65rem] text-muted-foreground">直近14日（任意）</span>
          </div>
          {snapshot.studyDays.length === 0 ? (
            <p className="mt-4 rounded-lg border border-dashed border-border p-4 text-xs leading-5 text-muted-foreground">
              学習時間は記録された分だけ表示されます。毎日の目標や連続日数はありません。
            </p>
          ) : (
          <div className="mt-4 flex h-28 items-end gap-1.5" role="img" aria-label="直近14日の学習時間">
            {Array.from({ length: 14 }, (_, index) => {
              const date = new Date(Date.now() - (13 - index) * 86_400_000).toISOString().slice(0, 10);
              const minutes = snapshot.studyDays.find((day) => day.day === date)?.minutes ?? 0;
              const height = Math.min(100, (minutes / 60) * 100);
              return (
                <div key={date} className="group flex flex-1 flex-col items-center justify-end gap-1">
                  <div
                    className="w-full rounded-t-sm bg-primary/25 transition-colors group-hover:bg-primary/60"
                    style={{ height: `${Math.max(4, height)}%` }}
                    title={`${date}: ${minutes}分`}
                  />
                  <span className="text-[0.5rem] text-muted-foreground">{date.slice(8)}</span>
                </div>
              );
            })}
          </div>
          )}
          <div className="mt-3 flex items-center gap-3 text-[0.65rem] text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="size-3" />14日合計 {snapshot.studyDays.reduce((total, day) => total + day.minutes, 0)}分</span>
            <span className="flex items-center gap-1"><TrendingUp className="size-3" />直近の誤答 {snapshot.reviewQuestions.length}問</span>
          </div>
        </section>

        <section className="card self-start overflow-hidden">
          <div className="flex items-center justify-between border-b border-border bg-muted/60 px-4 py-2.5">
            <h2 className="text-sm font-semibold">最近の演習</h2>
            <Link href="/review" className="text-[0.65rem] text-info-foreground hover:underline">すべて見る</Link>
          </div>
          {snapshot.recentAttempts.length === 0 ? (
            <div className="p-5 text-center text-xs leading-6 text-muted-foreground">
              まだ解答履歴がありません。<Link href="/practice" className="text-info-foreground">10問クイズ</Link>から始めましょう。
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {snapshot.recentAttempts.slice(0, 6).map((attempt, index) => {
                const question = ALL_QUESTIONS.find((item) => item.id === attempt.questionId);
                return (
                  <li key={`${attempt.attemptedAt}-${index}`} className="flex items-start gap-3 px-4 py-2.5">
                    <span className={`mt-1 grid size-4 shrink-0 place-items-center rounded-full text-[0.55rem] text-white ${attempt.correct ? "bg-success" : "bg-destructive"}`}>
                      {attempt.correct ? "○" : "×"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-xs">
                        {question ? question.stem : attempt.questionId}
                      </p>
                      <p className="mt-0.5 text-[0.6rem] text-muted-foreground">
                        {formatDateTime(attempt.attemptedAt)} · {attempt.mode}
                      </p>
                    </div>
                    {question ? (
                      <Link href={`/practice/question/${question.id}`} className="text-[0.65rem] text-info-foreground hover:underline">
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
              <Target className="size-4 text-info-foreground" />
              <h2 className="text-sm font-semibold">模擬試験</h2>
            </div>
            <Link href="/mock" className="text-[0.7rem] font-semibold text-info-foreground hover:underline">履歴</Link>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {snapshot.mockHistory.slice(0, 3).map((attempt) => (
              <Link key={attempt.id} href={`/mock/results/${attempt.id}`} className="rounded-lg border border-border bg-muted p-3 hover:border-ring/50">
                <p className="text-[0.65rem] text-muted-foreground">{formatDateTime(attempt.startedAt)}</p>
                <p className="mono mt-1 text-xl font-semibold">{percent(attempt.correct, attempt.total)}%</p>
                <p className="text-[0.6rem] text-muted-foreground">
                  {attempt.correct}/{attempt.total} · {formatDuration(attempt.durationSec)}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {snapshot.completedLessons === 0 && snapshot.attemptCount === 0 ? (
        <section className="mt-6 rounded-xl border border-border bg-muted p-5">
          <div className="flex flex-wrap items-center gap-4">
            <BookOpen className="size-5 text-info-foreground" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">順序もペースも自由です</p>
              <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                気になる章から読み、必要だと感じたときに演習してください。連続日数や1日のノルマは設けていません。
              </p>
            </div>
            <Link href="/learn" className="btn text-xs">学習マップへ</Link>
          </div>
        </section>
      ) : null}

      {ALL_LESSONS.length === 0 ? (
        <section className="mt-6 card p-6 text-center text-sm text-muted-foreground">
          コンテンツを準備中です。しばらくしてから再読み込みしてください。
        </section>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center gap-2 text-[0.65rem] text-muted-foreground">
        <CheckCircle2 className="size-3.5 text-success-foreground" />
        <span>学習履歴はブラウザの匿名プロフィールに紐づけて保存されます。</span>
        <Link href="/about" className="text-info-foreground hover:underline">データと出典について</Link>
      </div>
    </div>
  );
}
