import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink, Play } from "lucide-react";
import { OFFICIAL_PAPERS } from "@/content";
import { getLearner } from "@/lib/session";
import { getAllAttempts } from "@/lib/db/store";
import { Badge, Breadcrumbs, PageHeader } from "@/components/ui/primitives";
import { PART_LABEL } from "@/content";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return OFFICIAL_PAPERS.map((paper) => ({ year: String(paper.year) }));
}

export default async function PaperPage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const paper = OFFICIAL_PAPERS.find((item) => String(item.year) === year);
  if (!paper) notFound();
  const { id } = await getLearner();
  const attempts = getAllAttempts(id);
  const attempted = new Set(attempts.map((attempt) => attempt.questionId));
  const ids = paper.questions.map((question) => question.id).join(",");

  return (
    <div className="">
      <Breadcrumbs items={[{ label: "過去問", href: "/past-papers" }, { label: paper.label }]} />
      <PageHeader
        meta={`${paper.label} · IPA 公開問題`}
        title={`${paper.year}年度 公開問題`}
        description={`${paper.note} 収録 ${paper.questions.length} 問（実際の試験は ${paper.actualCount} 問）。出典と問題番号を各問に表示しています。`}
        actions={
          <>
            <a href={paper.pageUrl} target="_blank" rel="noreferrer" className="btn">
              公式ページ
              <ExternalLink className="size-4" />
            </a>
            <a href={paper.bookletUrl} target="_blank" rel="noreferrer" className="btn btn-ghost">
              問題冊子PDF
            </a>
            {paper.questions.length > 0 ? (
              <Link
                href={`/practice/run?questionIds=${encodeURIComponent(ids)}&count=${paper.questions.length}&feedback=end&mode=past-paper`}
                className="btn btn-primary"
              >
                <Play className="size-4" />
                15問を通しで解く
              </Link>
            ) : null}
          </>
        }
      />

      <div className="mb-5 flex flex-wrap gap-2">
        <Badge tone="accent">{paper.questions.filter((q) => q.part === "A").length} 問 科目A</Badge>
        <Badge tone="accent">{paper.questions.filter((q) => q.part === "B").length} 問 科目B</Badge>
        <Badge>公開 {paper.publishedCount} / 60</Badge>
        <Badge>公開日 {paper.publishedAt}</Badge>
      </div>

      <div className="card overflow-hidden">
        <ul className="divide-y divide-border">
          {paper.questions.map((question) => (
            <li key={question.id}>
              <Link
                href={`/practice/question/${question.id}`}
                className="group flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-muted"
              >
                <span className="mono mt-0.5 grid size-7 shrink-0 place-items-center rounded-md border border-border bg-muted text-xs">
                  {question.source.questionNo}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-semibold text-muted-foreground">{PART_LABEL[question.part]}</span>
                    <span className="text-xs text-muted-foreground">· {question.difficulty === "easy" ? "基礎" : question.difficulty === "medium" ? "標準" : "応用"}</span>
                    {attempted.has(question.id) ? <Badge tone="success">解答済み</Badge> : null}
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs leading-5 group-hover:text-info-foreground">
                    {question.stem}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {question.source.attribution}
                  </p>
                </div>
                <ArrowRight className="mt-1 size-3.5 shrink-0 text-muted-foreground group-hover:text-info-foreground" />
              </Link>
            </li>
          ))}
        </ul>
        {paper.questions.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">この年度の問題は未収録です。公式 PDF を参照してください。</p>
        ) : null}
      </div>

      <section className="mt-5 rounded-xl border border-border bg-muted p-4 text-[0.8125rem] leading-6 text-muted-foreground">
        <p>
          出典：IPA 情報セキュリティマネジメント試験 {paper.label}。問題文・選択肢は公式 PDF に基づき、図表は等価な表・箇条書きとして再構成しています。解説は本サイト独自のもので、IPA の見解ではありません。
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          <a href={paper.bookletUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-info-foreground hover:underline">
            問題冊子（PDF）
            <ExternalLink className="size-3" />
          </a>
          <a href={paper.answerUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-info-foreground hover:underline">
            解答例（PDF）
            <ExternalLink className="size-3" />
          </a>
        </div>
      </section>
    </div>
  );
}
