import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { HISTORICAL_PAPERS, OFFICIAL_PAPERS, OFFICIAL_QUESTIONS, TOPIC_BY_SLUG } from "@/content";
import { PageHeader } from "@/components/ui/primitives";

export const dynamic = "force-static";

function ExternalAnchor({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-[0.9375rem] font-medium text-info-foreground hover:underline"
    >
      {children}
      <ExternalLink className="size-3.5" aria-hidden />
    </a>
  );
}

export default function PastPapersPage() {
  const topicCounts = new Map<string, { count: number; years: Set<number> }>();
  for (const question of OFFICIAL_QUESTIONS) {
    for (const topicId of question.topicIds) {
      const entry = topicCounts.get(topicId) ?? { count: 0, years: new Set<number>() };
      entry.count += 1;
      if (question.source.year) entry.years.add(question.source.year);
      topicCounts.set(topicId, entry);
    }
  }
  const recurring = [...topicCounts.entries()]
    .map(([topicId, entry]) => ({
      topicId,
      count: entry.count,
      years: [...entry.years].sort(),
    }))
    .filter((item) => item.count >= 2)
    .sort((a, b) => b.count - a.count)
    .slice(0, 9);

  return (
    <div>
      <PageHeader
        title="過去問"
        description="IPA が公開している SG の CBT 公開問題を収録しています。各年度15問のみが公開されており、60問の完全な過去問ではありません。"
        actions={
          <a
            href="https://www.ipa.go.jp/shiken/mondai-kaiotu/sg_fe/koukai/index.html"
            target="_blank"
            rel="noreferrer"
            className="btn h-10 px-4"
          >
            IPA 公式ページ
            <ExternalLink className="size-4" />
          </a>
        }
      />

      <section aria-labelledby="official-heading">
        <h2 id="official-heading" className="text-lg font-semibold">
          公開問題（2023–2026）
        </h2>
        {OFFICIAL_PAPERS.length === 0 ? (
          <p className="mt-3 text-[0.9375rem] leading-7 text-muted-foreground">
            年度別の公開問題データを準備しています。IPA の公式ページから原本を確認できます。
          </p>
        ) : (
          <ul className="mt-2 divide-y divide-border border-y border-border">
            {OFFICIAL_PAPERS.map((paper) => (
              <li key={paper.year}>
                <Link
                  href={`/past-papers/${paper.year}`}
                  className="group -mx-2 flex items-center gap-4 rounded-lg px-2 py-4 transition-colors hover:bg-muted"
                >
                  <span className="mono w-14 shrink-0 text-xl font-semibold">{paper.year}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.9375rem] font-medium group-hover:text-info-foreground">
                      {paper.label}
                    </span>
                    <span className="text-[0.8125rem] text-muted-foreground">
                      {paper.questions.length}問収録（科目A {paper.questions.filter((q) => q.part === "A").length} ·
                      科目B {paper.questions.filter((q) => q.part === "B").length}）· 公開日 {paper.publishedAt} · 実際の試験は
                      {paper.actualCount}問
                    </span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground/60 group-hover:text-info-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 max-w-3xl text-pretty text-[0.8125rem] leading-6 text-muted-foreground">
          出典：独立行政法人情報処理推進機構（IPA）情報セキュリティマネジメント試験 公開問題。IPA
          の公表資料は、法令の特別な定めがある場合を除き、許諾や使用料なく利用できます。問題文・選択肢は原文を維持し、図表はテキストや表として再構成しています。原本は各年度の
          IPA PDF を確認してください。解説は本サイト独自のものです。
        </p>
      </section>

      {recurring.length > 0 ? (
        <section className="mt-14" aria-labelledby="themes-heading">
          <h2 id="themes-heading" className="text-lg font-semibold">
            年度をまたぐ頻出テーマ
          </h2>
          <p className="mt-1 max-w-3xl text-[0.8125rem] leading-6 text-muted-foreground">
            2023〜2026年度の公開問題60問をトピック別に集計したものです。公開された一部の問題に基づく傾向であり、出題頻度の公式統計ではありません。
          </p>
          <ul className="mt-2 grid gap-x-10 sm:grid-cols-2">
            {recurring.map(({ topicId, count, years }) => {
              const topic = TOPIC_BY_SLUG.get(topicId);
              if (!topic) return null;
              return (
                <li key={topicId} className="border-b border-border">
                  <Link
                    href={`/practice/${topicId}`}
                    className="group -mx-2 flex items-center gap-3 rounded-lg px-2 py-3 transition-colors hover:bg-muted"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.9375rem] font-medium group-hover:text-info-foreground">
                        {topic.title}
                      </span>
                      <span className="text-[0.8125rem] text-muted-foreground">{years.join(" / ")} 年度</span>
                    </span>
                    <span className="mono text-[0.9375rem] font-semibold">{count}問</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <section className="mt-14" aria-labelledby="archive-heading">
        <h2 id="archive-heading" className="text-lg font-semibold">
          筆記試験の過去問（2016–2019）
        </h2>
        <p className="mt-1 max-w-3xl text-pretty text-[0.8125rem] leading-6 text-muted-foreground">
          2016〜2019年度は午前50問・午後3問の筆記試験でした。原本は画像ベースの PDF
          でテキスト層がないため、アプリ内では出題せず、IPA の問題冊子と解答例へ直接リンクしています。
        </p>
        <ul className="mt-2 divide-y divide-border border-y border-border">
          {HISTORICAL_PAPERS.map((paper) => (
            <li
              key={paper.id}
              className="flex flex-col gap-1.5 py-3.5 md:flex-row md:items-center md:gap-6"
            >
              <p className="shrink-0 text-[0.9375rem] font-medium md:w-60">
                <span className="mono mr-2 font-semibold">{paper.year}</span>
                {paper.label}
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-1">
                <ExternalAnchor href={paper.morning.booklet}>午前 問題</ExternalAnchor>
                <ExternalAnchor href={paper.morning.answers}>午前 解答例</ExternalAnchor>
                <ExternalAnchor href={paper.afternoon.booklet}>午後 問題</ExternalAnchor>
                <ExternalAnchor href={paper.afternoon.answers}>午後 解答例</ExternalAnchor>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[0.8125rem] leading-6 text-muted-foreground">
          2020〜2022年度の CBT 問題は非公開のため掲載されていません。アプリ内で出題できるのは2023年度以降の公開問題のみです。
        </p>
      </section>
    </div>
  );
}
