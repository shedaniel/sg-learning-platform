import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, Circle, CircleDot, Clock, Layers, Play } from "lucide-react";
import { AREAS, questionsForTopic, topicsForArea } from "@/content";
import { getLearner } from "@/lib/session";
import { getLessonStatus, getProgressSnapshot } from "@/lib/progress";
import { Badge, Breadcrumbs, LinkButton, PageHeader, ProgressBar } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return AREAS.map((area) => ({ area: area.id }));
}

export default async function AreaPage({ params }: { params: Promise<{ area: string }> }) {
  const { area: areaId } = await params;
  const area = AREAS.find((item) => item.id === areaId);
  if (!area) notFound();
  const { id } = await getLearner();
  const snapshot = await getProgressSnapshot(id);
  const topics = topicsForArea(area.id);
  const completed = area.lessons.filter((lesson) => snapshot.completedLessonIds.includes(lesson.id)).length;
  const percent = area.lessons.length ? Math.round((completed / area.lessons.length) * 100) : 0;
  const areaTopics = snapshot.topics.filter((topic) => topic.topic.areaId === area.id);
  const questionCount = topics.reduce((total, topic) => total + questionsForTopic(topic.id).length, 0);

  return (
    <div className="">
      <Breadcrumbs items={[{ label: "学習", href: "/learn" }, { label: area.title }]} />
      <PageHeader
        meta={`Area ${String(area.order).padStart(2, "0")} · ${area.titleEn}`}
        title={area.title}
        description={area.description}
        actions={
          <>
            <LinkButton href={`/practice?topic=${topics[0]?.id ?? ""}`} variant="primary">
              <Play className="size-4" />
              この分野を演習
            </LinkButton>
          </>
        }
      />

      <section className="card mb-8 flex flex-col gap-5 p-5 md:flex-row md:items-center md:p-6">
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold">エリア進捗</span>
            <span className="mono text-muted-foreground">
              {completed}/{area.lessons.length} レッスン · {percent}%
            </span>
          </div>
          <ProgressBar value={percent} tone={area.color} className="mt-2" height={8} />
          <div className="mt-4 flex flex-wrap gap-2 text-[0.8125rem] text-muted-foreground">
            <span className="chip">{topics.length} トピック</span>
            <span className="chip">{questionCount} 問</span>
            <span className="chip">
              演習正答率 {areaTopics.reduce((total, topic) => total + topic.attempts, 0) > 0 ? `${Math.round(
                (areaTopics.reduce((total, topic) => total + topic.correct, 0) /
                  areaTopics.reduce((total, topic) => total + topic.attempts, 0)) *
                  100,
              )}%` : "—"}
            </span>
            <span className="chip">
              習得 {areaTopics.filter((topic) => topic.mastery === "mastered").length}/{areaTopics.length}
            </span>
          </div>
        </div>
        <div className="w-full shrink-0 rounded-xl border border-border bg-muted p-4 md:w-64">
          <p className="text-xs font-semibold">このエリアの狙い</p>
          <p className="mt-1 text-[0.8125rem] leading-5 text-muted-foreground">{area.description}</p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-3">
          <h2 className="text-sm font-semibold">レッスン</h2>
          {area.lessons.length === 0 ? (
            <div className="card p-6 text-sm text-muted-foreground">コンテンツを準備中です。</div>
          ) : (
            area.lessons.map((lesson, index) => {
              const status = getLessonStatus(lesson, snapshot);
              return (
                <Link
                  key={lesson.id}
                  href={`/learn/${lesson.id}`}
                  className="card group flex items-start gap-4 p-4 transition-colors hover:border-ring/50 md:p-5"
                >
                  <span
                    className={cn(
                      "mono mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border text-[0.8125rem] font-semibold",
                      status === "completed"
                        ? "border-success/40 bg-success/10 text-success-foreground"
                        : status === "started"
                          ? "border-ring/40 bg-muted text-info-foreground"
                          : "border-border text-muted-foreground",
                    )}
                  >
                    {status === "completed" ? (
                      <CheckCircle2 className="size-4" />
                    ) : status === "started" ? (
                      <CircleDot className="size-4" />
                    ) : (
                      String(index + 1).padStart(2, "0")
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <h3 className="font-semibold leading-6 group-hover:text-info-foreground">{lesson.title}</h3>
                      <span className="text-xs text-muted-foreground">{lesson.titleEn}</span>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{lesson.summary}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge>{lesson.readingMinutes}分</Badge>
                      <Badge>{lesson.sections.length}セクション</Badge>
                      <Badge tone={lesson.difficulty === "easy" ? "success" : lesson.difficulty === "hard" ? "warning" : "neutral"}>
                        {lesson.difficulty === "easy" ? "基礎" : lesson.difficulty === "medium" ? "標準" : "応用"}
                      </Badge>
                      {lesson.topicIds.map((topicId) => (
                        <span key={topicId} className="text-xs text-muted-foreground">
                          #{topics.find((topic) => topic.id === topicId)?.title ?? topicId}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground group-hover:text-info-foreground" />
                </Link>
              );
            })
          )}
        </div>

        <aside className="space-y-4">
          <div className="card p-4">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-info-foreground" />
              <h2 className="text-xs font-semibold">対応するシラバストピック</h2>
            </div>
            <ul className="mt-3 space-y-2">
              {topics.map((topic) => {
                const stat = areaTopics.find((item) => item.topic.id === topic.id);
                return (
                  <li key={topic.id} className="rounded-lg border border-border bg-muted p-2.5">
                    <p className="text-xs font-medium leading-5">{topic.title}</p>
                    <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{topic.reference.replace("Ver.4.1 ", "")}</span>
                      <span className="mono">
                        {stat?.attempts ? `${stat.accuracy}%` : "未演習"}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <Clock className="size-4 text-info-foreground" />
              学習の目安
            </div>
            <p className="mt-2 text-[0.8125rem] leading-6 text-muted-foreground">
              読解 {area.lessons.reduce((total, lesson) => total + lesson.readingMinutes, 0)} 分 + 演習
              約 {area.lessons.length * 10} 分。1日1〜2レッスンが無理のないペースです。
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
