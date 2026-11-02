import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Play, Target } from "lucide-react";
import { ALL_QUESTIONS, TOPIC_BY_SLUG, questionsForTopic } from "@/content";
import { getLearner } from "@/lib/session";
import { getProgressSnapshot } from "@/lib/progress";
import { Badge, Breadcrumbs, PageHeader, ProgressBar } from "@/components/ui/primitives";
import { PracticeSetup } from "@/components/practice/PracticeSetup";
import { PART_LABEL } from "@/content";

export const dynamic = "force-dynamic";

export default async function TopicPracticePage({
  params,
}: {
  params: Promise<{ topicId: string }>;
}) {
  const { topicId } = await params;
  const topic = TOPIC_BY_SLUG.get(topicId);
  if (!topic) notFound();
  const questions = questionsForTopic(topicId);
  const { id } = await getLearner();
  const snapshot = getProgressSnapshot(id);
  const stat = snapshot.topics.find((row) => row.topic.id === topicId);
  const attempted = new Set(
    snapshot.recentAttempts.filter((attempt) => questions.some((question) => question.id === attempt.questionId)).map((attempt) => attempt.questionId),
  );

  return (
    <div className="">
      <Breadcrumbs
        items={[
          { label: "演習", href: "/practice" },
          { label: topic.title },
        ]}
      />
      <PageHeader
        meta={`${topic.reference} · ${topic.examPart === "both" ? "科目A/B" : `科目${topic.examPart}`}`}
        title={topic.title}
        description={topic.summary}
        actions={
          <Link href={`/practice/run?topicId=${topic.id}&count=10`} className="btn btn-primary">
            <Play className="size-4" />
            この分野を10問
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-4">
          <div className="card grid grid-cols-3 divide-x divide-border">
            <div className="p-4">
              <p className="text-[0.8125rem] text-muted-foreground">問題数</p>
              <p className="mono mt-1 text-xl font-semibold">{questions.length}</p>
            </div>
            <div className="p-4">
              <p className="text-[0.8125rem] text-muted-foreground">解答回数</p>
              <p className="mono mt-1 text-xl font-semibold">{stat?.attempts ?? 0}</p>
            </div>
            <div className="p-4">
              <p className="text-[0.8125rem] text-muted-foreground">正答率</p>
              <p className="mono mt-1 text-xl font-semibold">{stat?.attempts ? `${stat.accuracy}%` : "—"}</p>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="border-b border-border bg-muted/60 px-4 py-2.5">
              <h2 className="text-xs font-semibold">収録問題</h2>
            </div>
            {questions.length === 0 ? (
              <p className="p-5 text-sm text-muted-foreground">このトピックの問題は準備中です。</p>
            ) : (
              <ul className="divide-y divide-border">
                {questions.map((question, index) => (
                  <li key={question.id}>
                    <Link
                      href={`/practice/question/${question.id}`}
                      className="group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted"
                    >
                      <span className="mono mt-0.5 text-[0.8125rem] text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-xs leading-5 group-hover:text-info-foreground">{question.stem}</p>
                        <div className="mt-1 flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                          <span>{PART_LABEL[question.part]}</span>
                          <span>·</span>
                          <span>{question.source.kind === "official" ? `IPA ${question.source.year} 問${question.source.questionNo}` : "独自問題"}</span>
                          <span>·</span>
                          <span>{question.difficulty === "easy" ? "基礎" : question.difficulty === "medium" ? "標準" : "応用"}</span>
                          {attempted.has(question.id) ? <Badge tone="accent">解答済み</Badge> : null}
                        </div>
                      </div>
                      <ArrowRight className="mt-1 size-3.5 text-muted-foreground group-hover:text-info-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <PracticeSetup
            topics={[{ id: topic.id, title: topic.title, areaTitle: "選択中", questionCount: questions.length }]}
            defaultTopic={topic.id}
            totalCount={questions.length}
          />
          <div className="card p-4">
            <div className="flex items-center gap-2">
              <Target className="size-4 text-info-foreground" />
              <p className="text-xs font-semibold">習得状況</p>
            </div>
            <p className="mt-1 text-[0.8125rem] text-muted-foreground">
              {stat?.mastery === "mastered"
                ? "複数回の演習で安定しています。科目Bの事例でも使えるか確認しましょう。"
                : stat?.attempts
                  ? "まだ演習回数が不足しています。誤答の理由を読み、間隔を空けて再挑戦してください。"
                  : "未演習です。まず5〜10問で現在地を確認しましょう。"}
            </p>
            <ProgressBar value={stat?.accuracy ?? 0} className="mt-3" height={6} />
            <p className="mt-1.5 text-[0.8125rem] text-muted-foreground">
              {stat?.uniqueAttempted ?? 0} / {questions.length} 問に解答
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
