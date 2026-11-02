import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LESSON_BY_ID, QUESTION_BY_ID, TERM_BY_ID, TOPIC_BY_SLUG } from "@/content";
import { getLearner } from "@/lib/session";
import { getProgressSnapshot } from "@/lib/progress";
import { LinkButton, PageHeader } from "@/components/ui/primitives";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

const ROW =
  "group -mx-2 flex items-start gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted";

export default async function ReviewPage() {
  const { id } = await getLearner();
  const snapshot = await getProgressSnapshot(id);
  const dueQuestions = snapshot.dueReviews.filter((item) => item.itemType === "question");
  const dueQuestionIds = dueQuestions
    .map((item) => item.itemId)
    .filter((questionId) => QUESTION_BY_ID.has(questionId))
    .slice(0, 20);
  const quizHref =
    dueQuestionIds.length > 0
      ? `/practice/run?questionIds=${encodeURIComponent(dueQuestionIds.join(","))}&count=${dueQuestionIds.length}&mode=review&feedback=instant`
      : snapshot.reviewQuestions.length > 0
        ? `/practice/run?questionIds=${encodeURIComponent(snapshot.reviewQuestions.map((question) => question.id).slice(0, 15).join(","))}&count=${Math.min(15, snapshot.reviewQuestions.length)}&mode=review&feedback=instant`
        : "/practice/run?weak=1&count=10&mode=review";

  const dueTerms = snapshot.dueReviews.filter((item) => item.itemType === "term");
  const dueLessons = snapshot.dueReviews.filter((item) => item.itemType === "lesson");
  const bookmarkedQuestions = snapshot.bookmarks
    .filter((bookmark) => bookmark.itemType === "question")
    .map((bookmark) => QUESTION_BY_ID.get(bookmark.itemId))
    .filter(Boolean);

  return (
    <div>
      <PageHeader
        title="復習"
        description="誤答と期限の来た用語を、間隔反復で戻します。正解した問題も、時間を空けて再挑戦することで定着を確認します。"
        actions={
          <LinkButton href={quizHref} variant="primary" className="h-10 px-4">
            復習を始める
          </LinkButton>
        }
      />

      <p className="-mt-4 mb-10 flex flex-wrap gap-x-5 gap-y-1 text-[0.9375rem] text-muted-foreground">
        <span>
          期限到来 <span className="mono font-semibold text-foreground">{snapshot.reviewCounts.due}</span> 件
        </span>
        <span>
          前回誤答 <span className="mono font-semibold text-foreground">{snapshot.reviewQuestions.length}</span> 問
        </span>
        <span>
          保存済み <span className="mono font-semibold text-foreground">{snapshot.bookmarks.length}</span> 件
        </span>
      </p>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="space-y-12">
          <section aria-labelledby="queue-heading">
            <h2 id="queue-heading" className="text-lg font-semibold">
              今日の復習キュー
            </h2>
            {snapshot.dueReviews.length === 0 ? (
              <div className="mt-3 text-[0.9375rem] leading-7 text-muted-foreground">
                <p>期限の来た復習はありません。新しく問題を解くと、誤答が翌日以降のキューに追加されます。</p>
                <LinkButton href="/practice" className="mt-3 h-10 px-4">
                  問題を解く
                </LinkButton>
              </div>
            ) : (
              <ul className="mt-1 divide-y divide-border">
                {snapshot.dueReviews.map((item) => {
                  if (item.itemType === "question") {
                    const question = QUESTION_BY_ID.get(item.itemId);
                    if (!question) return null;
                    return (
                      <li key={`q-${item.itemId}`}>
                        <Link href={`/practice/question/${question.id}`} className={ROW}>
                          <span className="min-w-0 flex-1">
                            <span className="line-clamp-2 block text-[0.9375rem] leading-6 group-hover:text-info-foreground">
                              {question.stem}
                            </span>
                            <span className="text-[0.8125rem] text-muted-foreground">
                              問題 · 誤答 {item.lapses}回 · 間隔 {Math.round(item.intervalDays)}日
                            </span>
                          </span>
                          <ArrowRight className="mt-1.5 size-4 shrink-0 text-muted-foreground/60" />
                        </Link>
                      </li>
                    );
                  }
                  if (item.itemType === "term") {
                    const term = TERM_BY_ID.get(item.itemId);
                    if (!term) return null;
                    return (
                      <li key={`t-${item.itemId}`}>
                        <Link href={`/glossary/${term.id}`} className={ROW}>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[0.9375rem] font-medium group-hover:text-info-foreground">
                              {term.ja}（{term.en}）
                            </span>
                            <span className="line-clamp-1 text-[0.8125rem] text-muted-foreground">
                              用語 · {term.shortJa}
                            </span>
                          </span>
                          <ArrowRight className="mt-1.5 size-4 shrink-0 text-muted-foreground/60" />
                        </Link>
                      </li>
                    );
                  }
                  const lesson = LESSON_BY_ID.get(item.itemId);
                  if (!lesson) return null;
                  return (
                    <li key={`l-${item.itemId}`}>
                      <Link href={`/learn/${lesson.id}`} className={ROW}>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[0.9375rem] font-medium group-hover:text-info-foreground">
                            {lesson.title}
                          </span>
                          <span className="text-[0.8125rem] text-muted-foreground">レッスン · 読了済みの再確認</span>
                        </span>
                        <ArrowRight className="mt-1.5 size-4 shrink-0 text-muted-foreground/60" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <section aria-labelledby="missed-heading">
            <div className="flex items-baseline justify-between">
              <h2 id="missed-heading" className="text-lg font-semibold">
                直近で間違えた問題
              </h2>
              <span className="text-[0.8125rem] text-muted-foreground">{snapshot.reviewQuestions.length}問</span>
            </div>
            {snapshot.reviewQuestions.length === 0 ? (
              <p className="mt-3 text-[0.9375rem] text-muted-foreground">誤答はありません。</p>
            ) : (
              <ul className="mt-1 divide-y divide-border">
                {snapshot.reviewQuestions.slice(0, 10).map((question) => (
                  <li key={question.id}>
                    <Link href={`/practice/question/${question.id}`} className={ROW}>
                      <span className="mono mt-px w-5 shrink-0 text-[0.8125rem] text-muted-foreground">
                        {question.part}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-2 block text-[0.9375rem] leading-6 group-hover:text-info-foreground">
                          {question.stem}
                        </span>
                        <span className="text-[0.8125rem] text-muted-foreground">
                          {question.source.kind === "official"
                            ? `IPA ${question.source.year} 問${question.source.questionNo}`
                            : "独自問題"}
                          {" · "}
                          {question.topicIds
                            .map((topicId) => TOPIC_BY_SLUG.get(topicId)?.title ?? topicId)
                            .join("、")}
                        </span>
                      </span>
                      <ArrowRight className="mt-1.5 size-4 shrink-0 text-muted-foreground/60" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-10">
          <section aria-labelledby="how-heading">
            <h2 id="how-heading" className="text-lg font-semibold">
              間隔反復の仕組み
            </h2>
            <div className="mt-2 space-y-2 text-[0.9375rem] leading-7 text-muted-foreground">
              <p>誤答は翌日に再出題。正解すると 1日 → 2.5日 → 約6日と間隔が伸びます。</p>
              <p>「もう一度」を選ぶと間隔がリセットされ、難しい問題ほど頻繁に戻ります。</p>
              <p>暗記ではなく、問題の理由づけを思い出すことを目的にしています。</p>
            </div>
            <p className="mt-3 text-[0.8125rem] text-muted-foreground">
              復習キュー全体: <span className="mono font-semibold text-foreground">{snapshot.reviewCounts.total}</span> 件
            </p>
          </section>

          <section aria-labelledby="terms-heading">
            <h2 id="terms-heading" className="text-lg font-semibold">
              期限の来た用語
            </h2>
            {dueTerms.length === 0 ? (
              <p className="mt-2 text-[0.9375rem] text-muted-foreground">ありません。</p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {dueTerms.map((item) => {
                  const term = TERM_BY_ID.get(item.itemId);
                  return term ? (
                    <Link key={item.itemId} href={`/glossary/${term.id}`} className="chip h-7 px-2.5 text-[0.8125rem] hover:border-ring/50">
                      {term.ja}
                    </Link>
                  ) : null;
                })}
              </div>
            )}
            {dueLessons.length > 0 ? (
              <p className="mt-3 text-[0.8125rem] text-muted-foreground">期限の来たレッスン: {dueLessons.length}件</p>
            ) : null}
          </section>

          <section aria-labelledby="saved-heading">
            <h2 id="saved-heading" className="text-lg font-semibold">
              保存した問題
            </h2>
            {bookmarkedQuestions.length === 0 ? (
              <p className="mt-2 text-[0.9375rem] leading-7 text-muted-foreground">
                まだありません。問題ページのブックマークから保存できます。
              </p>
            ) : (
              <ul className="mt-1 divide-y divide-border">
                {bookmarkedQuestions.slice(0, 5).map((question) =>
                  question ? (
                    <li key={question.id}>
                      <Link
                        href={`/practice/question/${question.id}`}
                        className="-mx-2 block rounded-lg px-2 py-2.5 text-[0.9375rem] leading-6 transition-colors hover:bg-muted"
                      >
                        <span className="line-clamp-2">{question.stem}</span>
                      </Link>
                    </li>
                  ) : null,
                )}
              </ul>
            )}
          </section>
        </aside>
      </div>

      <p className="mt-14 text-[0.8125rem] leading-6 text-muted-foreground">
        最終更新: {snapshot.recentAttempts[0] ? formatDateTime(snapshot.recentAttempts[0].attemptedAt) : "—"}。
        復習の期限は同期コードのプロフィールに保存されます。
      </p>
    </div>
  );
}
