import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, BookMarked, ExternalLink, Languages } from "lucide-react";
import { LESSON_BY_ID, TERM_BY_ID, questionsForLesson } from "@/content";
import { getLearner } from "@/lib/session";
import { getProgressSnapshot } from "@/lib/progress";
import { isBookmarked } from "@/lib/db/store";
import { Badge, Breadcrumbs } from "@/components/ui/primitives";
import { BookmarkButton } from "@/components/BookmarkButton";
import { TermLearnedButton } from "@/components/TermLearnedButton";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ termId: string }>;
}): Promise<Metadata> {
  const { termId } = await params;
  const term = TERM_BY_ID.get(termId);
  if (!term) return {};
  return {
    title: `${term.ja}（${term.en}）`,
    description: term.shortJa,
  };
}

export default async function TermPage({ params }: { params: Promise<{ termId: string }> }) {
  const { termId } = await params;
  const term = TERM_BY_ID.get(termId);
  if (!term) notFound();
  const { id } = await getLearner();
  const snapshot = await getProgressSnapshot(id);
  const learned = snapshot.learnedTermIds.includes(term.id);
  const bookmarked = await isBookmarked(id, "term", term.id);
  const related = term.relatedTermIds.map((relatedId) => TERM_BY_ID.get(relatedId)).filter(Boolean);
  const lessons = term.lessonIds.map((lessonId) => LESSON_BY_ID.get(lessonId)).filter(Boolean);
  const questions = lessons.flatMap((lesson) => (lesson ? questionsForLesson(lesson.id).slice(0, 3) : []));

  return (
    <div className="">
      <Breadcrumbs items={[{ label: "用語集", href: "/glossary" }, { label: term.ja }]} />
      <div className="mx-auto max-w-3xl">
        <header className="border-b border-border pb-6">
          <div className="flex flex-wrap items-center gap-2">
            {term.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}
          </div>
          <h1 className="display mt-3 text-3xl font-semibold md:text-4xl">{term.ja}</h1>
          {term.reading ? <p className="mt-1 text-sm text-muted-foreground">読み: {term.reading}</p> : null}
          <p className="mt-2 text-sm font-medium text-info-foreground">
            {term.abbr ? `${term.abbr} — ` : ""}{term.en}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <TermLearnedButton termId={term.id} initial={learned} />
            <BookmarkButton itemType="term" itemId={term.id} initial={bookmarked} />
            <Link
              href={`/practice/run?topicId=${lessons[0]?.topicIds[0] ?? ""}&count=5`}
              className="btn btn-ghost text-xs"
            >
              関連問題を解く
            </Link>
          </div>
        </header>

        <section className="mt-6 card p-5">
          <p className="jp text-base leading-8">{term.shortJa}</p>
          <p className="mt-2 text-xs leading-6 text-muted-foreground">{term.shortEn}</p>
        </section>

        <section className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="card p-5">
            <div className="flex items-center gap-2">
              <span className="mono text-xs font-semibold text-info-foreground">JA</span>
              <h2 className="text-xs font-semibold">日本語の説明</h2>
            </div>
            <p className="jp mt-2 text-sm leading-7">{term.explanationJa}</p>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-2">
              <Languages className="size-3.5 text-info-foreground" />
              <h2 className="text-xs font-semibold">English support</h2>
            </div>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{term.explanationEn}</p>
          </div>
        </section>

        {term.examUsage ? (
          <section className="mt-4 rounded-xl bg-muted/70 p-5">
            <h2 className="text-xs font-semibold text-info-foreground">試験での使われ方</h2>
            <p className="jp mt-2 text-sm leading-7">{term.examUsage}</p>
          </section>
        ) : null}

        {related.length > 0 ? (
          <section className="mt-6">
            <h2 className="text-xs font-semibold">関連用語</h2>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {related.map((item) =>
                item ? (
                  <Link key={item.id} href={`/glossary/${item.id}`} className="card-flat group flex items-center justify-between p-3 hover:border-ring/50">
                    <div>
                      <p className="text-xs font-semibold group-hover:text-info-foreground">{item.ja}</p>
                      <p className="text-xs text-muted-foreground">{item.en}</p>
                    </div>
                    <ArrowRight className="size-3.5 text-muted-foreground" />
                  </Link>
                ) : null,
              )}
            </div>
          </section>
        ) : null}

        {lessons.length > 0 ? (
          <section className="mt-6">
            <h2 className="text-xs font-semibold">この用語を扱うレッスン</h2>
            <div className="mt-2 space-y-2">
              {lessons.map((lesson) =>
                lesson ? (
                  <Link key={lesson.id} href={`/learn/${lesson.id}`} className="card-flat flex items-center justify-between p-3 text-xs hover:border-ring/50">
                    <span>{lesson.title}</span>
                    <ArrowRight className="size-3.5 text-muted-foreground" />
                  </Link>
                ) : null,
              )}
            </div>
          </section>
        ) : null}

        {questions.length > 0 ? (
          <section className="mt-6">
            <h2 className="text-xs font-semibold">関連する演習問題</h2>
            <div className="mt-2 space-y-2">
              {questions.slice(0, 5).map((question) => (
                <Link key={question.id} href={`/practice/question/${question.id}`} className="card-flat group block p-3 hover:border-ring/50">
                  <p className="line-clamp-2 text-xs leading-5 group-hover:text-info-foreground">{question.stem}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {question.source.kind === "official" ? `IPA ${question.source.year} 問${question.source.questionNo}` : "独自問題"}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <p className="mt-8 flex items-center gap-1.5 text-[0.8125rem] text-muted-foreground">
          <ExternalLink className="size-3" />
          用語の定義は本サイト独自の学習用要約です。公式規格・法令の原文を確認してください。
        </p>
      </div>
    </div>
  );
}
