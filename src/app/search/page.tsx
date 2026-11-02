import Link from "next/link";
import { ArrowRight, BookOpen, FileQuestion, Library, Search, Target } from "lucide-react";
import { ALL_LESSONS, ALL_TERMS, OFFICIAL_QUESTIONS } from "@/content";
import { PageHeader, Badge } from "@/components/ui/primitives";
import { searchContent, type SearchKind } from "@/lib/search";

export const dynamic = "force-dynamic";

const KIND_META: Record<SearchKind, { label: string; icon: typeof BookOpen; hrefLabel: string }> = {
  term: { label: "用語", icon: Library, hrefLabel: "用語集" },
  lesson: { label: "レッスン", icon: BookOpen, hrefLabel: "学習" },
  question: { label: "問題", icon: FileQuestion, hrefLabel: "演習" },
  topic: { label: "シラバス", icon: Target, hrefLabel: "Coverage" },
};

const SUGGESTIONS = ["可用性", "Availability", "CIA", "ISMS", "リスク移転", "CSIRT", "DMZ", "個人情報保護法", "ゼロトラスト"];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = q.trim() ? searchContent(q, 60) : [];
  const grouped = (["lesson", "term", "question", "topic"] as SearchKind[]).map((kind) => ({
    kind,
    items: results.filter((result) => result.kind === kind),
  }));
  const popularTerms = ALL_TERMS.slice(0, 6);
  const recentOfficial = OFFICIAL_QUESTIONS.filter((question) => question.source.year === 2026).slice(0, 4);

  return (
    <div className="">
      <PageHeader
        title={q ? `「${q}」の検索結果` : "横断検索"}
        description="日本語・英語・略語から、用語、レッスン、問題、シラバストピックを横断検索します。"
      />

      <form action="/search" className="mb-6 flex max-w-2xl gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            name="q"
            defaultValue={q}
            autoFocus
            placeholder="例: 可用性 / Availability / ISMS / リスク移転"
            className="field h-11 pl-9"
            aria-label="検索キーワード"
          />
        </div>
        <button type="submit" className="btn btn-primary h-11">検索</button>
      </form>

      <div className="mb-6 flex flex-wrap items-center gap-1.5">
        <span className="text-[0.8125rem] text-muted-foreground">よく検索される語:</span>
        {SUGGESTIONS.map((suggestion) => (
          <Link key={suggestion} href={`/search?q=${encodeURIComponent(suggestion)}`} className="chip hover:border-ring/50">
            {suggestion}
          </Link>
        ))}
      </div>

      {!q.trim() ? (
        <div className="grid gap-5 md:grid-cols-2">
          <section className="card p-5">
            <h2 className="text-sm font-semibold">主要な用語</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {popularTerms.map((term) => (
                <Link key={term.id} href={`/glossary/${term.id}`} className="rounded-lg border border-border bg-muted p-3 text-xs hover:border-ring/50">
                  <span className="font-semibold">{term.ja}</span>
                  <span className="ml-1 text-xs text-muted-foreground">{term.en}</span>
                </Link>
              ))}
            </div>
          </section>
          <section className="card p-5">
            <h2 className="text-sm font-semibold">公式問題（2026年度）</h2>
            <div className="mt-3 space-y-2">
              {recentOfficial.map((question) => (
                <Link key={question.id} href={`/practice/question/${question.id}`} className="block rounded-lg border border-border p-2.5 text-xs leading-5 hover:border-ring/50">
                  <span className="line-clamp-2">{question.stem}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">IPA 2026 問{question.source.questionNo}</span>
                </Link>
              ))}
              <Link href="/past-papers" className="text-[0.8125rem] font-semibold text-info-foreground hover:underline">過去問一覧 →</Link>
            </div>
          </section>
        </div>
      ) : results.length === 0 ? (
        <div className="card p-8 text-center">
          <Search className="mx-auto size-6 text-muted-foreground" />
          <h2 className="mt-3 font-semibold">該当する内容がありません</h2>
          <p className="mt-1 text-sm text-muted-foreground">表記ゆれを試すか、英語・略語でも検索してください。</p>
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {SUGGESTIONS.slice(0, 5).map((suggestion) => (
              <Link key={suggestion} href={`/search?q=${encodeURIComponent(suggestion)}`} className="chip">{suggestion}</Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-xs text-muted-foreground">{results.length} 件</p>
          {grouped.map(({ kind, items }) => {
            if (items.length === 0) return null;
            const meta = KIND_META[kind];
            const Icon = meta.icon;
            return (
              <section key={kind} className="card overflow-hidden">
                <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-4 py-2.5">
                  <Icon className="size-4 text-info-foreground" />
                  <h2 className="text-xs font-semibold">{meta.label}</h2>
                  <Badge className="ml-auto">{items.length}</Badge>
                </div>
                <ul className="divide-y divide-border">
                  {items.map((result) => (
                    <li key={`${result.kind}-${result.id}`}>
                      <Link href={result.href} className="group flex items-start gap-3 px-4 py-3 hover:bg-muted">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium leading-6 group-hover:text-info-foreground">{result.title}</p>
                          <p className="text-[0.8125rem] text-muted-foreground">{result.subtitle}</p>
                          <p className="mt-1 line-clamp-2 text-[0.8125rem] leading-5 text-muted-foreground">{result.snippet}</p>
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground">{result.meta}</span>
                        <ArrowRight className="mt-1 size-3.5 shrink-0 text-muted-foreground group-hover:text-info-foreground" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
