import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TOPIC_BY_SLUG, LESSON_BY_ID, questionsForTopic, questionsForLesson, ALL_QUESTIONS } from "@/content";
import { PageHeader } from "@/components/ui/primitives";
import { QuizRunner } from "@/components/practice/QuizRunner";
import type { QuizConfig } from "@/lib/quiz";
import { parsePracticeSearchParams } from "@/lib/practice-params";
import { getLearner } from "@/lib/session";
import { getProgressSnapshot } from "@/lib/progress";

export const dynamic = "force-dynamic";

export default async function PracticeRunPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;
  const parsed = parsePracticeSearchParams(raw);
  let topicIds = parsed.topicId ? [parsed.topicId] : undefined;
  if (parsed.weak) {
    const { id: profileId } = await getLearner();
    const snapshot = getProgressSnapshot(profileId);
    topicIds = snapshot.weakTopics.slice(0, 5).map((topic) => topic.topic.id);
  }
  const config: QuizConfig & { mode: string } = {
    topicIds,
    lessonIds: parsed.lessonId ? [parsed.lessonId] : undefined,
    part: parsed.part,
    difficulty: parsed.difficulty,
    count: parsed.count,
    includeOfficial: parsed.includeOfficial,
    questionIds: parsed.questionIds ?? undefined,
    mode: parsed.mode,
  };

  const available = parsed.questionIds?.length
    ? parsed.questionIds.filter((id) => ALL_QUESTIONS.some((q) => q.id === id)).length
    : parsed.lessonId
      ? questionsForLesson(parsed.lessonId).length
      : parsed.topicId
        ? questionsForTopic(parsed.topicId).length
        : ALL_QUESTIONS.length;

  const title = parsed.lessonId
    ? LESSON_BY_ID.get(parsed.lessonId)?.title ?? "レッスン演習"
    : parsed.topicId
      ? TOPIC_BY_SLUG.get(parsed.topicId)?.title ?? "分野演習"
      : parsed.questionIds?.length
        ? "個別復習"
        : "総合演習";

  if (available === 0) {
    return (
      <div>
        <PageHeader title="問題がありません" description="条件に合う問題が見つかりませんでした。" />
        <Link href="/practice" className="btn">演習トップへ戻る</Link>
      </div>
    );
  }

  return (
    <div className="">
      <Link href="/practice" className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted hover:text-fg">
        <ArrowLeft className="size-3.5" />
        演習トップ
      </Link>
      <PageHeader
        eyebrow="Quiz"
        title={title}
        description={`${parsed.count}問 · ${parsed.part === "both" ? "科目A+B" : `科目${parsed.part}`} · ${
          parsed.feedback === "instant" ? "1問ごとに解説" : "最後にまとめて解説"
        }`}
      />
      <QuizRunner config={config} title={title} feedback={parsed.feedback} />
    </div>
  );
}
