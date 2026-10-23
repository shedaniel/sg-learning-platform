import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Circle,
  CircleDot,
  Compass,
  Layers,
  Sparkles,
} from "lucide-react";
import { AREAS, ALL_LESSONS, coverageStats } from "@/content";
import { SYLLABUS_VERSION } from "@/content/syllabus";
import { getLearner } from "@/lib/session";
import {
  getAreaProgress,
  getLessonStatus,
  getProgressSnapshot,
  MASTERY_LABEL,
} from "@/lib/progress";
import { PageHeader, ProgressBar, Badge, LinkButton } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusIcon = {
  completed: CheckCircle2,
  started: CircleDot,
  new: Circle,
};

export default async function LearnPage() {
  const { id } = await getLearner();
  const snapshot = getProgressSnapshot(id);
  const areaProgress = getAreaProgress(snapshot);
  const coverage = coverageStats();
  const nextLesson = snapshot.nextLessons[0] ?? ALL_LESSONS[0];

  return (
    <div className="animate-in">
      <PageHeader
        eyebrow="Curriculum"
        title="シラバスを、一本の道に。"
        description={`IPA SG シラバス ${SYLLABUS_VERSION.current} の重点分野と関連分野を8つのエリアに再構成しました。読む・図で掴む・解くを1レッスン内で循環させます。`}
        actions={
          <>
            <LinkButton href="/coverage" variant="ghost">
              <Layers className="size-4" />
              Coverage
            </LinkButton>
            {nextLesson ? (
              <LinkButton href={`/learn/${nextLesson.id}`} variant="primary">
                次のレッスン
                <ArrowRight className="size-4" />
              </LinkButton>
            ) : null}
          </>
        }
      />

      <section className="card mb-8 overflow-hidden">
        <div className="grid gap-6 p-5 md:grid-cols-[1.1fr_0.9fr] md:p-7">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-full bg-accent-soft text-accent">
                <Compass className="size-4" />
              </span>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Your route
              </p>
            </div>
            <h2 className="display mt-3 text-2xl font-semibold">
              {nextLesson ? nextLesson.title : "レッスンを準備中"}
            </h2>
            {nextLesson ? (
              <>
                <p className="jp mt-2 max-w-xl text-sm leading-7 text-muted">
                  {nextLesson.summary}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Badge tone="accent">{nextLesson.readingMinutes}分</Badge>
                  <Badge>{nextLesson.sections.length}セクション</Badge>
                  <Badge>{nextLesson.titleEn}</Badge>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link href={`/learn/${nextLesson.id}`} className="btn btn-primary">
                    読み始める
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link href="/practice" className="btn">
                    先に演習する
                  </Link>
                </div>
              </>
            ) : (
              <p className="mt-3 text-sm text-muted">コンテンツを読み込んでいます。</p>
            )}
          </div>
          <div className="rounded-xl border border-border bg-surface-2 p-4">
            <div className="flex items-end justify-between">
              <div>
                <p className="eyebrow">Syllabus progress</p>
                <p className="mono mt-1 text-3xl font-semibold">{snapshot.lessonPercent}%</p>
              </div>
              <p className="text-xs text-muted">
                {snapshot.completedLessons} / {snapshot.lessonCount} レッスン
              </p>
            </div>
            <ProgressBar value={snapshot.lessonPercent} className="mt-3" height={8} />
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg border border-border bg-surface p-3">
                <p className="text-muted">演習問題</p>
                <p className="mono mt-0.5 text-lg font-semibold">
                  {snapshot.uniqueQuestionsAttempted}
                  <span className="text-xs font-normal text-muted"> / {snapshot.questionCount}</span>
                </p>
              </div>
              <div className="rounded-lg border border-border bg-surface p-3">
                <p className="text-muted">直近の正答率</p>
                <p className="mono mt-0.5 text-lg font-semibold">{snapshot.recentAccuracy}%</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-[0.7rem] text-muted">
              <span>シラバスカバレッジ</span>
              <span className="mono">
                {coverage.complete}/{coverage.total} topics
              </span>
            </div>
            <ProgressBar
              value={(coverage.complete / Math.max(1, coverage.total)) * 100}
              tone="var(--success)"
              height={5}
              className="mt-1.5"
            />
          </div>
        </div>
      </section>

      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="eyebrow">8 areas · {ALL_LESSONS.length} lessons</p>
          <h2 className="display mt-1 text-2xl font-semibold">学習マップ</h2>
        </div>
        <Link href="/coverage" className="hidden text-xs font-semibold text-accent hover:underline sm:block">
          公式シラバスとの対応を見る
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {AREAS.map((area, areaIndex) => {
          const progress = areaProgress.find((item) => item.areaId === area.id);
          const topicRows = snapshot.topics.filter((topic) => topic.topic.areaId === area.id);
          const mastered = topicRows.filter((topic) => topic.mastery === "mastered").length;
          return (
            <article
              key={area.id}
              className="card group overflow-hidden transition-colors hover:border-border-strong"
            >
              <div className="flex items-start gap-4 p-5">
                <span
                  className="mono grid size-10 shrink-0 place-items-center rounded-xl text-sm font-semibold text-white"
                  style={{ background: area.color }}
                >
                  {String(areaIndex + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <h3 className="font-semibold leading-6">
                      <Link href={`/learn/${area.id}`} className="hover:text-accent">
                        {area.title}
                      </Link>
                    </h3>
                    <span className="text-[0.65rem] uppercase tracking-wider text-muted">
                      {area.titleEn}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">{area.description}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <ProgressBar value={progress?.percent ?? 0} tone={area.color} height={5} />
                    <span className="mono w-9 shrink-0 text-right text-[0.65rem] text-muted">
                      {progress?.percent ?? 0}%
                    </span>
                  </div>
                </div>
              </div>

              <ul className="border-t border-border bg-surface-2/50 px-3 py-2">
                {area.lessons.length > 0 ? (
                  area.lessons.map((lesson) => {
                    const status = getLessonStatus(lesson, snapshot);
                    const Icon = statusIcon[status];
                    return (
                      <li key={lesson.id}>
                        <Link
                          href={`/learn/${lesson.id}`}
                          className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-xs transition-colors hover:bg-surface"
                        >
                          <Icon
                            className={cn(
                              "size-3.5 shrink-0",
                              status === "completed"
                                ? "text-success"
                                : status === "started"
                                  ? "text-accent"
                                  : "text-border-strong",
                            )}
                          />
                          <span className={cn("flex-1 truncate", status === "completed" && "text-muted")}>
                            {lesson.title}
                          </span>
                          <span className="text-[0.6rem] text-muted">{lesson.readingMinutes}分</span>
                        </Link>
                      </li>
                    );
                  })
                ) : (
                  <li className="px-2 py-3 text-xs text-muted">コンテンツを準備中です。</li>
                )}
              </ul>
              <div className="flex items-center justify-between border-t border-border px-5 py-2 text-[0.65rem] text-muted">
                <span>
                  {progress?.completedLessons ?? 0}/{progress?.totalLessons ?? 0} 完了 · 習得{" "}
                  {mastered}/{topicRows.length}
                </span>
                <span>
                  {progress?.attempts ? `正答率 ${progress.accuracy}%` : "未演習"}
                </span>
              </div>
            </article>
          );
        })}
      </div>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          {
            icon: BookOpenCheck,
            title: "1. レッスンを読む",
            text: "日本語の本文、比較表、図解、用語カードで概念の構造を掴みます。分からない用語はその場で開けます。",
          },
          {
            icon: Sparkles,
            title: "2. 動かして確かめる",
            text: "リスクマトリックス、バックアップ、アクセス権などのシミュレーターで、条件を変えた結果を観察します。",
          },
          {
            icon: CheckCircle2,
            title: "3. 問題で閉じる",
            text: "各レッスン10問前後。科目Aの知識問題と科目Bの事例問題を混ぜ、誤答は復習キューへ送ります。",
          },
        ].map((item) => (
          <div key={item.title} className="card p-5">
            <item.icon className="size-5 text-accent" />
            <h3 className="mt-3 text-sm font-semibold">{item.title}</h3>
            <p className="mt-1.5 text-xs leading-6 text-muted">{item.text}</p>
          </div>
        ))}
      </section>

      {snapshot.topics.some((topic) => topic.mastery !== "not-started") ? (
        <p className="mt-8 text-xs leading-6 text-muted">
          現在の習得状況:{" "}
          {snapshot.topics
            .filter((topic) => topic.mastery !== "not-started")
            .slice(0, 8)
            .map((topic) => `${topic.topic.title}（${MASTERY_LABEL[topic.mastery]}）`)
            .join("、")}
          。習得判定はレッスン閲覧ではなく、複数回の演習結果に基づきます。
        </p>
      ) : null}
    </div>
  );
}
