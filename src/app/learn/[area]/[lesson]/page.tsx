import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookMarked,
  CheckCircle2,
  ExternalLink,
  ListTree,
  Target,
} from "lucide-react";
import { ALL_LESSONS, LESSON_BY_ID, TOPIC_BY_SLUG, TERM_BY_ID } from "@/content";
import { getLearner } from "@/lib/session";
import { getProgressSnapshot } from "@/lib/progress";
import { isBookmarked } from "@/lib/db/store";
import { BlockList } from "@/components/lesson/Blocks";
import { LessonActions, LessonVisit } from "@/components/lesson/LessonActions";
import { Badge, Breadcrumbs, ProgressBar } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ area: string; lesson: string }>;
}): Promise<Metadata> {
  const { area, lesson } = await params;
  const item = LESSON_BY_ID.get(`${area}/${lesson}`);
  if (!item) return {};
  return {
    title: `${item.title}（${item.titleEn}）`,
    description: item.summary,
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ area: string; lesson: string }>;
}) {
  const { area, lesson: lessonSlug } = await params;
  const lessonId = `${area}/${lessonSlug}`;
  const lesson = LESSON_BY_ID.get(lessonId);
  if (!lesson) notFound();
  const { id } = await getLearner();
  const snapshot = getProgressSnapshot(id);
  const completed = snapshot.completedLessonIds.includes(lesson.id);
  const bookmark = isBookmarked(id, "lesson", lesson.id);
  const index = ALL_LESSONS.findIndex((item) => item.id === lesson.id);
  const prev = index > 0 ? ALL_LESSONS[index - 1] : null;
  const next = index >= 0 && index < ALL_LESSONS.length - 1 ? ALL_LESSONS[index + 1] : null;
  const areaInfo = snapshot.topics.find((topic) => topic.topic.areaId === lesson.areaId);
  const terms = lesson.termIds.map((termId) => TERM_BY_ID.get(termId)).filter(Boolean);
  const quizHref = `/practice/run?lessonId=${encodeURIComponent(lesson.id)}&count=10&mode=lesson`;

  return (
    <div className="">
      <LessonVisit lessonId={lesson.id} />
      <Breadcrumbs
        items={[
          { label: "学習", href: "/learn" },
          { label: areaInfo?.topic.title ?? area, href: `/learn/${area}` },
          { label: lesson.title },
        ]}
      />

      <header className="mb-8 border-b border-border pb-7">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="accent">{lesson.areaId.toUpperCase()}</Badge>
          <Badge>{lesson.readingMinutes}分</Badge>
          <Badge>{lesson.difficulty === "easy" ? "基礎" : lesson.difficulty === "medium" ? "標準" : "応用"}</Badge>
          {completed ? <Badge tone="success">読了済み</Badge> : null}
        </div>
        <h1 className="display mt-4 max-w-3xl text-3xl font-semibold md:text-[2.55rem]">
          {lesson.title}
        </h1>
        <p className="mt-1.5 text-xs uppercase tracking-[0.16em] text-muted-foreground">{lesson.titleEn}</p>
        <p className="jp mt-4 max-w-3xl text-[0.95rem] leading-8 text-muted-foreground">{lesson.summary}</p>
        <div className="mt-5">
          <LessonActions
            lessonId={lesson.id}
            completed={completed}
            bookmarked={bookmark}
            quizHref={quizHref}
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {lesson.topicIds.map((topicId) => {
            const topic = TOPIC_BY_SLUG.get(topicId);
            return (
              <Link
                key={topicId}
                href={`/coverage#${topicId}`}
                className="text-[0.68rem] text-muted-foreground underline decoration-border underline-offset-4 hover:text-info-foreground"
              >
                {topic?.title ?? topicId}
              </Link>
            );
          })}
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr_240px]">
        <article className="min-w-0">
          <section className="mb-8 rounded-xl border border-border border-l-2 border-l-accent bg-muted p-4 md:p-5">
            <div className="flex items-center gap-2">
              <Target className="size-4 text-info-foreground" />
              <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-info-foreground">
                このレッスンの到達点
              </h2>
            </div>
            <ul className="mt-2.5 space-y-1.5">
              {lesson.objectives.map((objective, index) => (
                <li key={index} className="flex gap-2 text-sm leading-6">
                  <span className="mono mt-0.5 text-[0.65rem] text-info-foreground">{index + 1}.</span>
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="prose-lesson">
            {lesson.sections.map((section, sectionIndex) => (
              <section key={section.id} id={section.id} className="scroll-mt-24 pb-8">
                <div className="mb-3 flex items-baseline gap-3">
                  <span className="mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-info-foreground">
                    {String(sectionIndex + 1).padStart(2, "0")}
                  </span>
                  <h2 className="display text-xl font-semibold md:text-2xl">{section.title}</h2>
                </div>
                <BlockList blocks={section.blocks} />
              </section>
            ))}
          </div>

          <section className="mt-2 rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-success-foreground" />
              <h2 className="text-sm font-semibold">このレッスンの要点</h2>
            </div>
            <ul className="mt-3 space-y-2">
              {lesson.keyPoints.map((point, index) => (
                <li key={index} className="flex gap-2 text-sm leading-6">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-success" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-4 rounded-xl border border-warning/30 bg-warning/5 p-5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-warning-foreground" />
              <h2 className="text-sm font-semibold">試験のひっかけ</h2>
            </div>
            <ul className="mt-3 space-y-2">
              {lesson.examTraps.map((trap, index) => (
                <li key={index} className="flex gap-2 text-sm leading-6 text-muted-foreground">
                  <span className="mono text-[0.65rem] text-warning-foreground">{index + 1}</span>
                  <span>{trap}</span>
                </li>
              ))}
            </ul>
          </section>

          {terms.length > 0 ? (
            <section className="mt-4 rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-2">
                <BookMarked className="size-4 text-info-foreground" />
                <h2 className="text-sm font-semibold">このレッスンの用語</h2>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {terms.map((term) =>
                  term ? (
                    <Link
                      key={term.id}
                      href={`/glossary/${term.id}`}
                      className="rounded-lg border border-border bg-muted px-3 py-2 transition-colors hover:border-ring/50"
                    >
                      <p className="text-xs font-semibold">
                        {term.ja}
                        {term.reading ? (
                          <span className="ml-1 font-normal text-muted-foreground">（{term.reading}）</span>
                        ) : null}
                      </p>
                      <p className="text-[0.65rem] text-muted-foreground">{term.en}</p>
                    </Link>
                  ) : null,
                )}
              </div>
            </section>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center">
            <Link href={quizHref} className="btn btn-primary">
              このレッスンの確認クイズ（10問）
              <ArrowRight className="size-4" />
            </Link>
            <p className="text-xs leading-5 text-muted-foreground">
              誤答は自動で復習キューに入ります。読了だけでは習得扱いになりません。
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {prev ? (
              <Link href={`/learn/${prev.id}`} className="card group p-4 hover:border-ring/50">
                <p className="flex items-center gap-1.5 text-[0.65rem] text-muted-foreground">
                  <ArrowLeft className="size-3" />
                  前のレッスン
                </p>
                <p className="mt-1 text-sm font-medium group-hover:text-info-foreground">{prev.title}</p>
              </Link>
            ) : <span />}
            {next ? (
              <Link href={`/learn/${next.id}`} className="card group p-4 text-right hover:border-ring/50">
                <p className="flex items-center justify-end gap-1.5 text-[0.65rem] text-muted-foreground">
                  次のレッスン
                  <ArrowRight className="size-3" />
                </p>
                <p className="mt-1 text-sm font-medium group-hover:text-info-foreground">{next.title}</p>
              </Link>
            ) : null}
          </div>

          <section className="mt-8 border-t border-border pt-5">
            <h2 className="text-xs font-semibold text-muted-foreground">出典・参考文献</h2>
            <ul className="mt-2 space-y-1.5">
              {lesson.sources.map((source) => (
                <li key={source.url} className="text-[0.7rem] leading-5">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-info-foreground"
                  >
                    {source.label}
                    <ExternalLink className="size-3" />
                  </a>
                  {source.note ? <span className="text-muted-foreground"> — {source.note}</span> : null}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[0.65rem] leading-5 text-muted-foreground">
              本文は学習用に独自執筆したものです。公式見解ではありません。試験制度・出題範囲は IPA の最新情報を確認してください。
            </p>
          </section>
        </article>

        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-4">
            <nav className="card p-4" aria-label="目次">
              <div className="flex items-center gap-2">
                <ListTree className="size-4 text-info-foreground" />
                <p className="text-xs font-semibold">目次</p>
              </div>
              <ol className="mt-3 space-y-1.5">
                {lesson.sections.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block rounded-md px-2 py-1 text-[0.7rem] leading-5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <span className="mono mr-1.5 text-[0.6rem] text-info-foreground">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <div className="card p-4">
              <p className="text-xs font-semibold">読書の進捗</p>
              <ProgressBar value={snapshot.lessonPercent} className="mt-2" height={5} />
              <p className="mt-2 text-[0.65rem] text-muted-foreground">
                全{snapshot.lessonCount}レッスン中 {snapshot.completedLessons} 完了
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
