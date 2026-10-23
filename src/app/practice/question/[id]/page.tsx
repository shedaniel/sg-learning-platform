import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { QUESTION_BY_ID, TOPIC_BY_SLUG, LESSON_BY_ID } from "@/content";
import { getLearner } from "@/lib/session";
import { isBookmarked } from "@/lib/db/store";
import { Breadcrumbs, Badge, PageHeader } from "@/components/ui/primitives";
import { BookmarkButton } from "@/components/BookmarkButton";
import { QuizRunner } from "@/components/practice/QuizRunner";
import { PART_LABEL, DIFFICULTY_LABEL } from "@/content";

export const dynamic = "force-dynamic";

export default async function QuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: questionId } = await params;
  const question = QUESTION_BY_ID.get(questionId);
  if (!question) notFound();
  const { id: profileId } = await getLearner();
  const bookmarked = isBookmarked(profileId, "question", questionId);

  return (
    <div className="animate-in">
      <Breadcrumbs
        items={[
          { label: "演習", href: "/practice" },
          { label: "問題" },
        ]}
      />
      <PageHeader
        eyebrow={`${PART_LABEL[question.part]} · ${DIFFICULTY_LABEL[question.difficulty]} · ${
          question.source.kind === "official" ? "IPA公開問題" : "独自問題"
        }`}
        title="1問演習"
        description="答えを選ぶと、正誤と選択肢ごとの理由が表示されます。間違えた問題は復習キューに自動登録されます。"
        actions={<BookmarkButton itemType="question" itemId={question.id} initial={bookmarked} />}
      />

      <div className="mx-auto max-w-3xl">
        <QuizRunner
          config={{
            questionIds: [question.id],
            count: 1,
            part: question.part,
            difficulty: question.difficulty,
            mode: "review",
          }}
          title="1問演習"
          feedback="instant"
        />

        <section className="card mt-5 p-4">
          <h2 className="text-xs font-semibold">この問題の位置づけ</h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {question.topicIds.map((topicId) => {
              const topic = TOPIC_BY_SLUG.get(topicId);
              return topic ? (
                <Link key={topicId} href={`/practice/${topicId}`} className="chip hover:border-accent/50">
                  {topic.title}
                </Link>
              ) : null;
            })}
          </div>
          <div className="mt-3 space-y-1.5">
            {question.lessonIds.map((lessonId) => {
              const lesson = LESSON_BY_ID.get(lessonId);
              return lesson ? (
                <Link
                  key={lessonId}
                  href={`/learn/${lesson.id}`}
                  className="block text-xs text-accent hover:underline"
                >
                  関連レッスン: {lesson.title} →
                </Link>
              ) : null;
            })}
          </div>
          <div className="mt-4 border-t border-border pt-3">
            <p className="text-[0.7rem] leading-5 text-muted">{question.source.attribution}</p>
            {question.source.url ? (
              <a
                href={question.source.url}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-[0.7rem] text-accent hover:underline"
              >
                公式PDF・出題年度ページ
                <ExternalLink className="size-3" />
              </a>
            ) : null}
            {question.source.note ? (
              <p className="mt-1 text-[0.65rem] text-muted">{question.source.note}</p>
            ) : null}
            <div className="mt-2 flex flex-wrap gap-1.5">
              {question.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
