import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Bookmark,
  Brain,
  CheckCircle2,
  Clock,
  Library,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { LESSON_BY_ID, QUESTION_BY_ID, TERM_BY_ID } from "@/content";
import { getLearner } from "@/lib/session";
import { getProgressSnapshot } from "@/lib/progress";
import { PageHeader, Badge, ProgressBar } from "@/components/ui/primitives";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const { id } = await getLearner();
  const snapshot = getProgressSnapshot(id);
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
    <div className="">
      <PageHeader
        eyebrow="Review"
        title="忘れる前に、もう一度。"
        description="誤答と期限の来た用語を、間隔反復で戻します。正解した問題も、時間を空けて再挑戦することで定着を確認します。"
        actions={
          <Link href={quizHref} className="btn btn-primary">
            <Sparkles className="size-4" />
            復習を開始
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">Due now</p>
            <Clock className="size-4 text-warning-foreground" />
          </div>
          <p className="mono mt-1 text-2xl font-semibold">{snapshot.reviewCounts.due}</p>
          <p className="text-[0.65rem] text-muted-foreground">期限が来た復習項目</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">Wrong last time</p>
            <RotateCcw className="size-4 text-destructive-foreground" />
          </div>
          <p className="mono mt-1 text-2xl font-semibold">{snapshot.reviewQuestions.length}</p>
          <p className="text-[0.65rem] text-muted-foreground">直近の解答が誤り</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">Saved</p>
            <Bookmark className="size-4 text-info-foreground" />
          </div>
          <p className="mono mt-1 text-2xl font-semibold">{snapshot.bookmarks.length}</p>
          <p className="text-[0.65rem] text-muted-foreground">ブックマーク</p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="card overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <Brain className="size-4 text-info-foreground" />
              <h2 className="text-sm font-semibold">今日の復習キュー</h2>
            </div>
            <Badge tone={snapshot.reviewCounts.due > 0 ? "warning" : "success"}>
              {snapshot.reviewCounts.due > 0 ? `${snapshot.reviewCounts.due}件` : "完了"}
            </Badge>
          </div>
          {snapshot.dueReviews.length === 0 ? (
            <div className="p-6 text-center">
              <CheckCircle2 className="mx-auto size-6 text-success-foreground" />
              <p className="mt-2 text-sm font-semibold">期限の来た復習はありません</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                新しく問題を解くと、誤答が翌日以降のキューに追加されます。
              </p>
              <Link href="/practice" className="btn mt-3 text-xs">問題を解く</Link>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {snapshot.dueReviews.map((item) => {
                if (item.itemType === "question") {
                  const question = QUESTION_BY_ID.get(item.itemId);
                  if (!question) return null;
                  return (
                    <li key={`q-${item.itemId}`}>
                      <Link href={`/practice/question/${question.id}`} className="group flex items-start gap-3 px-4 py-3 hover:bg-muted">
                        <span className="mt-0.5 grid size-5 place-items-center rounded-full bg-destructive/10 text-[0.55rem] text-destructive-foreground">Q</span>
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-xs leading-5 group-hover:text-info-foreground">{question.stem}</p>
                          <p className="mt-0.5 text-[0.6rem] text-muted-foreground">
                            前回 {item.lapses}回誤答 · 間隔 {Math.round(item.intervalDays)}日
                          </p>
                        </div>
                        <ArrowRight className="mt-1 size-3.5 text-muted-foreground" />
                      </Link>
                    </li>
                  );
                }
                if (item.itemType === "term") {
                  const term = TERM_BY_ID.get(item.itemId);
                  if (!term) return null;
                  return (
                    <li key={`t-${item.itemId}`}>
                      <Link href={`/glossary/${term.id}`} className="group flex items-start gap-3 px-4 py-3 hover:bg-muted">
                        <span className="mt-0.5 grid size-5 place-items-center rounded-full bg-muted text-[0.55rem] text-info-foreground">語</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium group-hover:text-info-foreground">{term.ja}（{term.en}）</p>
                          <p className="mt-0.5 line-clamp-1 text-[0.6rem] text-muted-foreground">{term.shortJa}</p>
                        </div>
                        <ArrowRight className="mt-1 size-3.5 text-muted-foreground" />
                      </Link>
                    </li>
                  );
                }
                const lesson = LESSON_BY_ID.get(item.itemId);
                if (!lesson) return null;
                return (
                  <li key={`l-${item.itemId}`}>
                    <Link href={`/learn/${lesson.id}`} className="group flex items-start gap-3 px-4 py-3 hover:bg-muted">
                      <span className="mt-0.5 grid size-5 place-items-center rounded-full bg-success/10 text-[0.55rem] text-success-foreground">章</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium group-hover:text-info-foreground">{lesson.title}</p>
                        <p className="text-[0.6rem] text-muted-foreground">読了レッスンの再確認</p>
                      </div>
                      <ArrowRight className="mt-1 size-3.5 text-muted-foreground" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
          <div className="border-t border-border p-3">
            <Link href={quizHref} className="btn btn-primary w-full text-xs">
              <RotateCcw className="size-3.5" />
              {dueQuestionIds.length > 0 ? `期限到来の${dueQuestionIds.length}問を解く` : "誤答をまとめて解き直す"}
            </Link>
          </div>
        </section>

        <section className="space-y-4">
          <div className="card p-5">
            <h2 className="text-xs font-semibold">間隔反復の仕組み</h2>
            <div className="mt-3 space-y-2 text-[0.7rem] leading-5 text-muted-foreground">
              <p>誤答 → 翌日（間隔0日）に再出題。正解すると1日 → 2.5日 → 約6日と間隔が伸びます。</p>
              <p>「もう一度」を選ぶと間隔をリセットし、ease を下げます。難しい問題ほど頻繁に戻ります。</p>
              <p>単語カードの暗記ではなく、問題の理由づけを思い出すことを目的にしています。</p>
            </div>
            <div className="mt-3 rounded-lg border border-border bg-muted p-2.5">
              <div className="flex items-center justify-between text-[0.65rem]">
                <span>復習キュー</span>
                <span className="mono">{snapshot.reviewCounts.total}件</span>
              </div>
              <ProgressBar value={snapshot.reviewCounts.total ? ((snapshot.reviewCounts.total - snapshot.reviewCounts.due) / snapshot.reviewCounts.total) * 100 : 100} height={4} className="mt-1.5" />
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2">
              <Library className="size-4 text-info-foreground" />
              <h2 className="text-xs font-semibold">期限の来た用語</h2>
            </div>
            {dueTerms.length === 0 ? (
              <p className="mt-2 text-[0.7rem] text-muted-foreground">なし</p>
            ) : (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {dueTerms.map((item) => {
                  const term = TERM_BY_ID.get(item.itemId);
                  return term ? (
                    <Link key={item.itemId} href={`/glossary/${term.id}`} className="chip hover:border-ring/50">
                      {term.ja}
                    </Link>
                  ) : null;
                })}
              </div>
            )}
            {dueLessons.length > 0 ? (
              <p className="mt-3 text-[0.65rem] text-muted-foreground">期限の来たレッスン: {dueLessons.length}件</p>
            ) : null}
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-2">
              <Bookmark className="size-4 text-info-foreground" />
              <h2 className="text-xs font-semibold">保存した問題</h2>
            </div>
            {bookmarkedQuestions.length === 0 ? (
              <p className="mt-2 text-[0.7rem] text-muted-foreground">まだありません。問題ページのブックマークから保存できます。</p>
            ) : (
              <div className="mt-2 space-y-1.5">
                {bookmarkedQuestions.slice(0, 5).map((question) =>
                  question ? (
                    <Link key={question.id} href={`/practice/question/${question.id}`} className="block rounded-lg border border-border px-2.5 py-2 text-[0.7rem] leading-5 hover:border-ring/50">
                      <span className="line-clamp-2">{question.stem}</span>
                    </Link>
                  ) : null,
                )}
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="card mt-5 overflow-hidden">
        <div className="flex items-center justify-between border-b border-border bg-muted/60 px-4 py-3">
          <div className="flex items-center gap-2">
            <BookOpen className="size-4 text-destructive-foreground" />
            <h2 className="text-sm font-semibold">直近で間違えた問題</h2>
          </div>
          <span className="text-[0.65rem] text-muted-foreground">{snapshot.reviewQuestions.length}問</span>
        </div>
        {snapshot.reviewQuestions.length === 0 ? (
          <p className="p-5 text-xs text-muted-foreground">誤答はありません。</p>
        ) : (
          <ul className="divide-y divide-border">
            {snapshot.reviewQuestions.slice(0, 10).map((question) => (
              <li key={question.id}>
                <Link href={`/practice/question/${question.id}`} className="group flex items-start gap-3 px-4 py-3 hover:bg-muted">
                  <span className="mono mt-0.5 text-[0.6rem] text-muted-foreground">{question.part}</span>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-xs leading-5 group-hover:text-info-foreground">{question.stem}</p>
                    <p className="mt-0.5 text-[0.6rem] text-muted-foreground">
                      {question.source.kind === "official" ? `IPA ${question.source.year} 問${question.source.questionNo}` : "独自問題"}
                      {" · "}
                      {question.topicIds.map((topicId) => topicId).join(", ")}
                    </p>
                  </div>
                  <ArrowRight className="mt-1 size-3.5 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="mt-5 text-[0.65rem] leading-5 text-muted-foreground">
        最終更新: {snapshot.recentAttempts[0] ? formatDateTime(snapshot.recentAttempts[0].attemptedAt) : "—"}。
        復習の期限はブラウザの匿名プロフィールに保存されます。
      </p>
    </div>
  );
}
