import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, CircleDot } from "lucide-react";
import { AREAS, ALL_LESSONS, coverageStats } from "@/content";
import { SYLLABUS_VERSION } from "@/content/syllabus";
import { getLearner } from "@/lib/session";
import {
  getAreaProgress,
  getLessonStatus,
  getProgressSnapshot,
  MASTERY_LABEL,
} from "@/lib/progress";
import { PageHeader, ProgressBar, LinkButton } from "@/components/ui/primitives";
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
  const hasActivity = snapshot.completedLessons > 0 || snapshot.attemptCount > 0;

  return (
    <div>
      <PageHeader
        title="学習マップ"
        description={`IPA SG シラバス ${SYLLABUS_VERSION.current} の全${coverage.total}トピックを、8つの分野・${ALL_LESSONS.length}レッスンで扱います。どの順番で読んでも構いません。`}
        actions={
          <LinkButton href="/coverage" variant="ghost">
            シラバス対応表
          </LinkButton>
        }
      />

      {nextLesson ? (
        <section className="mb-12 flex flex-col gap-5 rounded-2xl border border-border bg-muted/50 p-5 md:flex-row md:items-center md:justify-between md:p-6">
          <div className="min-w-0">
            <p className="label">
              {!hasActivity ? "最初のレッスン" : "次のレッスン"}
            </p>
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
              読み始める
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
      ) : null}

      <div className="divide-y divide-border border-y border-border">
        {AREAS.map((area) => {
          const progress = areaProgress.find((item) => item.areaId === area.id);
          const topicRows = snapshot.topics.filter((topic) => topic.topic.areaId === area.id);
          const mastered = topicRows.filter((topic) => topic.mastery === "mastered").length;
          return (
            <section
              key={area.id}
              className="grid gap-5 py-7 md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] md:gap-10"
            >
              <div>
                <h2 className="text-lg font-semibold leading-snug">
                  <Link href={`/learn/${area.id}`} className="hover:text-info-foreground">
                    {area.title}
                  </Link>
                </h2>
                <p className="mt-0.5 text-[0.8125rem] text-muted-foreground">{area.titleEn}</p>
                <p className="mt-3 text-[0.9375rem] leading-7 text-muted-foreground">
                  {area.description}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <ProgressBar value={progress?.percent ?? 0} height={6} label={`${area.title}の進捗`} />
                  <span className="mono shrink-0 text-[0.8125rem] text-muted-foreground">
                    {progress?.completedLessons ?? 0}/{progress?.totalLessons ?? 0}
                  </span>
                </div>
                <p className="mt-2 text-[0.8125rem] text-muted-foreground">
                  習得 {mastered}/{topicRows.length} トピック
                  {progress?.attempts ? ` · 正答率 ${progress.accuracy}%` : " · 未演習"}
                </p>
              </div>

              {area.lessons.length > 0 ? (
                <ul className="grid content-start gap-x-6 sm:grid-cols-2">
                  {area.lessons.map((lesson) => {
                    const status = getLessonStatus(lesson, snapshot);
                    const Icon = statusIcon[status];
                    return (
                      <li key={lesson.id}>
                        <Link
                          href={`/learn/${lesson.id}`}
                          className="group -mx-2 flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted"
                        >
                          <Icon
                            className={cn(
                              "mt-1 size-4 shrink-0",
                              status === "completed"
                                ? "text-success-foreground"
                                : status === "started"
                                  ? "text-info-foreground"
                                  : "text-muted-foreground/60",
                            )}
                          />
                          <span className="min-w-0 flex-1">
                            <span
                              className={cn(
                                "block text-[0.9375rem] font-medium leading-6",
                                status === "completed" && "text-muted-foreground",
                              )}
                            >
                              {lesson.title}
                            </span>
                            <span className="text-[0.8125rem] text-muted-foreground">
                              {lesson.readingMinutes}分
                            </span>
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">コンテンツを準備中です。</p>
              )}
            </section>
          );
        })}
      </div>

      {snapshot.topics.some((topic) => topic.mastery !== "not-started") ? (
        <p className="mt-8 max-w-3xl text-[0.8125rem] leading-6 text-muted-foreground">
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
