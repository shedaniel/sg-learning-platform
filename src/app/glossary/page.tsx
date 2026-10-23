import Link from "next/link";
import { BookMarked, Search } from "lucide-react";
import { ALL_TERMS, AREAS } from "@/content";
import { getLearner } from "@/lib/session";
import { getProgressSnapshot } from "@/lib/progress";
import { PageHeader, Badge, ProgressBar } from "@/components/ui/primitives";
import { normalizeJapanese } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function GlossaryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; area?: string }>;
}) {
  const { q = "", area = "" } = await searchParams;
  const { id } = await getLearner();
  const snapshot = getProgressSnapshot(id);
  const query = normalizeJapanese(q);
  const filtered = ALL_TERMS.filter((term) => {
    if (area && !term.lessonIds.some((lessonId) => lessonId.startsWith(`${area}/`))) return false;
    if (!query) return true;
    return normalizeJapanese(
      [term.ja, term.reading ?? "", term.en, term.abbr ?? "", term.shortJa, term.tags.join(" ")].join(" "),
    ).includes(query);
  });

  return (
    <div className="">
      <PageHeader
        eyebrow="Glossary"
        title="日本語のまま、理解する。"
        description="SG の重要用語を、日本語・読み・英語・試験での使われ方で整理しています。本文中の下線付き用語からも開けます。"
        actions={
          <form action="/glossary" className="flex items-center gap-2">
            {area ? <input type="hidden" name="area" value={area} /> : null}
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
              <input
                name="q"
                defaultValue={q}
                placeholder="用語・英語・略語で検索"
                className="field h-9 w-56 pl-9 text-sm"
                aria-label="用語を検索"
              />
            </div>
            <button type="submit" className="btn h-9 text-xs">検索</button>
          </form>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <Link href="/glossary" className={`chip ${!area ? "border-accent bg-surface text-accent" : ""}`}>
          すべて（{ALL_TERMS.length}）
        </Link>
        {AREAS.map((item) => {
          const count = ALL_TERMS.filter((term) => term.lessonIds.some((lessonId) => lessonId.startsWith(`${item.id}/`))).length;
          return (
            <Link
              key={item.id}
              href={`/glossary?area=${item.id}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={`chip ${area === item.id ? "border-accent bg-surface text-accent" : ""}`}
            >
              {item.shortTitle}（{count}）
            </Link>
          );
        })}
        <span className="ml-auto text-[0.65rem] text-muted">
          覚えた {snapshot.learnedTermIds.length}/{ALL_TERMS.length}
        </span>
      </div>
      <ProgressBar value={snapshot.termPercent} height={4} className="mb-6" label="用語の学習進捗" />

      {filtered.length === 0 ? (
        <div className="card p-8 text-center text-sm text-muted">該当する用語がありません。</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((term) => {
            const learned = snapshot.learnedTermIds.includes(term.id);
            const areaInfo = AREAS.find((item) => term.lessonIds.some((lessonId) => lessonId.startsWith(`${item.id}/`)));
            return (
              <Link
                key={term.id}
                href={`/glossary/${term.id}`}
                className="card group p-4 transition-colors hover:border-accent/50"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold leading-6 group-hover:text-accent">
                      {term.ja}
                      {term.reading ? (
                        <span className="ml-1.5 text-[0.65rem] font-normal text-muted">（{term.reading}）</span>
                      ) : null}
                    </p>
                    <p className="mt-0.5 text-[0.65rem] uppercase tracking-wider text-muted">
                      {term.abbr ? `${term.abbr} · ` : ""}{term.en}
                    </p>
                  </div>
                  {learned ? <BookMarked className="size-3.5 shrink-0 text-success" /> : null}
                </div>
                <p className="mt-2 line-clamp-2 text-[0.7rem] leading-5 text-muted">{term.shortJa}</p>
                <div className="mt-2 flex items-center gap-1">
                  <Badge>{areaInfo?.shortTitle ?? "用語"}</Badge>
                  {term.tags.slice(0, 1).map((tag) => <Badge key={tag}>{tag}</Badge>)}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
