import Link from "next/link";
import { Check, Search } from "lucide-react";
import { ALL_TERMS, AREAS } from "@/content";
import { getLearner } from "@/lib/session";
import { getProgressSnapshot } from "@/lib/progress";
import { PageHeader, ProgressBar } from "@/components/ui/primitives";
import { normalizeJapanese } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function GlossaryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; area?: string }>;
}) {
  const { q = "", area = "" } = await searchParams;
  const { id } = await getLearner();
  const snapshot = await getProgressSnapshot(id);
  const query = normalizeJapanese(q);
  const filtered = ALL_TERMS.filter((term) => {
    if (area && !term.lessonIds.some((lessonId) => lessonId.startsWith(`${area}/`))) return false;
    if (!query) return true;
    return normalizeJapanese(
      [term.ja, term.reading ?? "", term.en, term.abbr ?? "", term.shortJa, term.tags.join(" ")].join(" "),
    ).includes(query);
  });

  return (
    <div>
      <PageHeader
        title="用語集"
        description="SG の重要用語を、日本語・読み・英語・試験での使われ方で整理しています。本文中の下線付き用語からも開けます。"
        actions={
          <form action="/glossary" className="flex items-center gap-2">
            {area ? <input type="hidden" name="area" value={area} /> : null}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                name="q"
                defaultValue={q}
                placeholder="用語・英語・略語で検索"
                className="field h-10 w-60 pl-9 text-[0.9375rem]"
                aria-label="用語を検索"
              />
            </div>
            <button type="submit" className="btn h-10 px-4">検索</button>
          </form>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Link href="/glossary" className={`chip h-8 px-3 text-[0.8125rem] ${!area ? "border-info/40 bg-info/10 text-info-foreground" : "hover:bg-muted"}`}>
          すべて（{ALL_TERMS.length}）
        </Link>
        {AREAS.map((item) => {
          const count = ALL_TERMS.filter((term) => term.lessonIds.some((lessonId) => lessonId.startsWith(`${item.id}/`))).length;
          return (
            <Link
              key={item.id}
              href={`/glossary?area=${item.id}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={`chip h-8 px-3 text-[0.8125rem] ${area === item.id ? "border-info/40 bg-info/10 text-info-foreground" : "hover:bg-muted"}`}
            >
              {item.shortTitle}（{count}）
            </Link>
          );
        })}
        <span className="ml-auto text-[0.8125rem] text-muted-foreground">
          覚えた {snapshot.learnedTermIds.length}/{ALL_TERMS.length}
        </span>
      </div>
      <ProgressBar value={snapshot.termPercent} height={4} className="mb-6" label="用語の学習進捗" />

      {filtered.length === 0 ? (
        <p className="py-10 text-[0.9375rem] text-muted-foreground">該当する用語がありません。</p>
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {filtered.map((term) => {
            const learned = snapshot.learnedTermIds.includes(term.id);
            const areaInfo = AREAS.find((item) => term.lessonIds.some((lessonId) => lessonId.startsWith(`${item.id}/`)));
            return (
              <li key={term.id}>
                <Link
                  href={`/glossary/${term.id}`}
                  className="group -mx-2 grid gap-x-6 gap-y-0.5 rounded-lg px-2 py-3 transition-colors hover:bg-muted md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_auto] md:items-baseline"
                >
                  <span className="min-w-0">
                    <span className="block text-[0.9375rem] font-semibold leading-6 group-hover:text-info-foreground">
                      {term.ja}
                      {term.reading ? (
                        <span className="ml-1.5 text-[0.8125rem] font-normal text-muted-foreground">（{term.reading}）</span>
                      ) : null}
                    </span>
                    <span className="block text-[0.8125rem] text-muted-foreground">
                      {term.abbr ? `${term.abbr} · ` : ""}
                      {term.en}
                    </span>
                  </span>
                  <span className="line-clamp-2 text-[0.9375rem] leading-6 text-muted-foreground">{term.shortJa}</span>
                  <span className="flex items-center gap-2 text-[0.8125rem] text-muted-foreground md:justify-end">
                    {areaInfo?.shortTitle ?? "用語"}
                    {learned ? (
                      <Check className="size-4 text-success-foreground" aria-label="覚えた" />
                    ) : null}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
