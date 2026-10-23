import Link from "next/link";
import { ArrowRight, ExternalLink, FileText, Info } from "lucide-react";
import { OFFICIAL_PAPERS } from "@/content";
import { PageHeader, Badge } from "@/components/ui/primitives";

export const dynamic = "force-static";

export default function PastPapersPage() {
  return (
    <div className="animate-in">
      <PageHeader
        eyebrow="Official past papers"
        title="IPA 公開問題を、出典付きで。"
        description="IPA が公開している SG の CBT 公開問題を収録しています。各年度15問のみが公開されており、60問の完全な過去問ではありません。"
        actions={
          <a href="https://www.ipa.go.jp/shiken/mondai-kaiotu/sg_fe/koukai/index.html" target="_blank" rel="noreferrer" className="btn">
            公式ページ
            <ExternalLink className="size-4" />
          </a>
        }
      />

      <div className="mb-6 rounded-xl border border-border bg-surface-2 p-4">
        <div className="flex items-start gap-2">
          <Info className="mt-0.5 size-4 shrink-0 text-accent" />
          <div className="text-[0.72rem] leading-6 text-muted">
            <p>
              出典：独立行政法人情報処理推進機構（IPA）情報セキュリティマネジメント試験 公開問題。
              IPA の公表資料は、法令の特別な定めがある場合を除き、許諾や使用料なく利用できます。本サイトは出典と問題番号を明記しています。
            </p>
            <p className="mt-1">
              問題文・選択肢は原文を維持し、図表はテキスト/表として再構成しています。原本は各年度の IPA PDF を確認してください。解説は本サイト独自のものです。
            </p>
          </div>
        </div>
      </div>

      {OFFICIAL_PAPERS.length === 0 ? (
        <div className="card p-8 text-center">
          <FileText className="mx-auto size-6 text-muted" />
          <h2 className="mt-3 font-semibold">公式問題を読み込み中</h2>
          <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-muted">
            年度別の公開問題データを準備しています。IPA の公式ページから原本を確認できます。
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {OFFICIAL_PAPERS.map((paper) => (
            <Link
              key={paper.year}
              href={`/past-papers/${paper.year}`}
              className="card group overflow-hidden transition-colors hover:border-accent/50"
            >
              <div className="flex items-start gap-4 p-5">
                <span className="mono grid size-12 shrink-0 place-items-center rounded-xl border border-border bg-surface-2 text-sm font-semibold">
                  {paper.year}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h2 className="font-semibold group-hover:text-accent">{paper.label}</h2>
                    <Badge tone="accent">{paper.questions.length}問収録</Badge>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-muted">{paper.note}</p>
                  <p className="mt-2 text-[0.62rem] text-muted">
                    公開日 {paper.publishedAt} · 実際の試験は {paper.actualCount} 問
                  </p>
                </div>
                <ArrowRight className="mt-1 size-4 shrink-0 text-border-strong group-hover:text-accent" />
              </div>
              <div className="flex items-center justify-between border-t border-border bg-surface-2/50 px-5 py-2 text-[0.62rem] text-muted">
                <span>出典: IPA 公開問題</span>
                <span>{paper.questions.filter((q) => q.part === "A").length} A / {paper.questions.filter((q) => q.part === "B").length} B</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <section className="mt-8 card p-5">
        <h2 className="text-sm font-semibold">過去問の使い方</h2>
        <div className="mt-3 grid gap-4 md:grid-cols-3">
          {[
            { title: "1. 年度単位で解く", text: "まず時間を意識せず15問を通し、出題の日本語に慣れます。" },
            { title: "2. 出典を確認する", text: "各問題の解説ページから IPA の原本 PDF と問題番号を確認できます。" },
            { title: "3. テーマで横断する", text: "同じ論点が年度をまたいで繰り返されます。タグとトピックから復習します。" },
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-border bg-surface-2 p-3">
              <p className="text-xs font-semibold">{item.title}</p>
              <p className="mt-1 text-[0.68rem] leading-5 text-muted">{item.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
