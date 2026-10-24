import { notFound, redirect } from "next/navigation";
import { QUESTION_BY_ID } from "@/content";
import { getMockAttempt } from "@/lib/db/store";
import { getLearner } from "@/lib/session";
import { MockRunner } from "@/components/mock/MockRunner";

export const dynamic = "force-dynamic";

export default async function MockRunPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { id: profileId } = await getLearner();
  const attempt = getMockAttempt(id, profileId);
  if (!attempt) notFound();
  if (attempt.submittedAt) redirect(`/mock/results/${id}`);
  const questions = attempt.questionIds
    .map((questionId) => QUESTION_BY_ID.get(questionId))
    .filter((question): question is NonNullable<typeof question> => Boolean(question));
  if (questions.length !== attempt.questionIds.length) {
    return (
      <div className="py-20 text-center">
        <h1 className="display text-2xl font-semibold">問題データを読み込めません</h1>
        <p className="mt-2 text-sm text-muted-foreground">模擬試験をやり直してください。</p>
      </div>
    );
  }
  return (
    <MockRunner
      id={attempt.id}
      questions={questions}
      expiresAt={attempt.expiresAt}
      initialAnswers={attempt.answers}
      initialFlags={attempt.flags}
      initialIndex={attempt.currentIndex}
    />
  );
}
