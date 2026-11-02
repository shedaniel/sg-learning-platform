import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleAlert, CircleDashed, ExternalLink, Layers } from "lucide-react";
import { AREAS, coverageStats } from "@/content";
import { AREA_META, SYLLABUS_VERSION } from "@/content/syllabus";
import { PageHeader, Badge, ProgressBar } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export const dynamic = "force-static";

const STATUS = {
  complete: { label: "対応済み", tone: "success" as const, icon: CheckCircle2 },
  partial: { label: "一部対応", tone: "warning" as const, icon: CircleAlert },
  missing: { label: "未対応", tone: "error" as const, icon: CircleDashed },
};

const PROPOSED_CHANGES = [
  {
    title: "AI を悪用した攻撃 / AI システムへの攻撃",
    detail:
      "プロンプトインジェクション（直接・間接）、ジェイルブレイク、データポイズニング、ディープフェイク、マルウェア亜種の自動生成など。",
  },
  {
    title: "ゼロトラストとサプライチェーン",
    detail:
      "内部ネットワークも信頼しない前提、ソフトウェアサプライチェーン攻撃、SBOM と供給者管理の強化。",
  },
  {
    title: "AI 倫理・AI ガバナンス",
    detail:
      "説明可能な AI、ヒューマン・イン・ザ・ループ、AI 利用ポリシー、シャドーAI、ハルシネーション、AI 基本法。",
  },
  {
    title: "クラウド・データ・新法",
    detail:
      "ソブリンクラウド、JC-STAR、重要経済安保情報保護法、サイバー対処能力強化法（能動的サイバー防御）など。",
  },
];

export default function CoveragePage() {
  const stats = coverageStats();
  const byArea = AREA_META.map((area) => ({
    area,
    rows: stats.rows.filter((row) => row.topic.areaId === area.id),
  }));

  return (
    <div className="">
      <PageHeader
        title="シラバス対応表"
        description={`現在有効な IPA SG シラバス ${SYLLABUS_VERSION.current} の全トピックに対する教材・問題の対応状況です。網羅性を主張するためではなく、不足を隠さないために表示します。`}
        actions={
          <a
            href={SYLLABUS_VERSION.sources[2].url}
            target="_blank"
            rel="noreferrer"
            className="btn"
          >
            公式シラバス
            <ExternalLink className="size-4" />
          </a>
        }
      />

      <section className="card mb-6 p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="accent">現行 {SYLLABUS_VERSION.current}</Badge>
              <span className="text-[0.8125rem] text-muted-foreground">公表 {SYLLABUS_VERSION.currentPublished} · 確認 {SYLLABUS_VERSION.verifiedAt}</span>
            </div>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              トピック単位で、対応レッスンが1本以上・演習問題が4問以上ある場合を「対応済み」としています。
              レッスン数や問題数は目安であり、公式の出題頻度を保証するものではありません。
            </p>
          </div>
          <div className="flex gap-4 text-center">
            <div>
              <p className="mono text-2xl font-semibold text-success-foreground">{stats.complete}</p>
              <p className="text-xs text-muted-foreground">対応済み</p>
            </div>
            <div>
              <p className="mono text-2xl font-semibold text-warning-foreground">{stats.partial}</p>
              <p className="text-xs text-muted-foreground">一部対応</p>
            </div>
            <div>
              <p className="mono text-2xl font-semibold text-destructive-foreground">{stats.missing}</p>
              <p className="text-xs text-muted-foreground">未対応</p>
            </div>
          </div>
        </div>
        <ProgressBar
          value={(stats.complete / Math.max(1, stats.total)) * 100}
          tone="var(--success-foreground)"
          className="mt-4"
          height={6}
          label="シラバスカバレッジ"
        />
        <p className="mt-1.5 text-[0.8125rem] text-muted-foreground">
          {stats.complete} / {stats.total} トピックが対応済み
        </p>
      </section>

      <div className="space-y-6">
        {byArea.map(({ area, rows }) => (
          <section key={area.id} className="card overflow-hidden">
            <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/60 px-4 py-3">
              <span className="size-2 rounded-full" style={{ background: area.color }} />
              <h2 className="text-sm font-semibold">{area.title}</h2>
              <span className="text-xs text-muted-foreground">{area.titleEn}</span>
              <Link href={`/learn/${area.id}`} className="ml-auto text-[0.8125rem] font-semibold text-info-foreground hover:underline">
                学習する →
              </Link>
            </div>
            <div className="divide-y divide-border">
              {rows.map((row) => {
                const status = STATUS[row.status];
                const Icon = status.icon;
                return (
                  <article key={row.topic.id} id={row.topic.id} className="scroll-mt-20 px-4 py-3">
                    <div className="flex flex-wrap items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xs font-semibold">{row.topic.title}</h3>
                          <span className="text-xs text-muted-foreground">{row.topic.titleEn}</span>
                        </div>
                        <p className="mt-0.5 text-[0.8125rem] leading-5 text-muted-foreground">{row.topic.summary}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{row.topic.reference}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right text-xs text-muted-foreground">
                          <p>{row.lessons.length} レッスン</p>
                          <p>{row.questionCount} 問</p>
                        </div>
                        <Badge tone={status.tone}>
                          <Icon className="size-3" />
                          {status.label}
                        </Badge>
                      </div>
                    </div>
                    {row.lessons.length > 0 ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {row.lessons.map((lesson) => (
                          <Link
                            key={lesson.id}
                            href={`/learn/${lesson.id}`}
                            className="inline-flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-1 text-xs hover:border-ring/50 hover:text-info-foreground"
                          >
                            {lesson.title}
                            <ArrowRight className="size-2.5" />
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-8 rounded-xl border border-warning/30 bg-warning/5 p-5">
        <div className="flex items-start gap-2">
          <CircleAlert className="mt-0.5 size-4 shrink-0 text-warning-foreground" />
          <div>
            <h2 className="text-sm font-semibold">2027年度 新試験制度のシラバス案について</h2>
            <p className="mt-1 text-[0.8125rem] leading-6 text-muted-foreground">
              現在の教材は有効な {SYLLABUS_VERSION.current} を基準にしています。IPA は {SYLLABUS_VERSION.proposedPublished} に
              2027年度開始予定の新試験制度のシラバス案（{SYLLABUS_VERSION.proposed}）を公表しました。これは案であり、現行試験の出題範囲ではありません。
            </p>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {PROPOSED_CHANGES.map((change) => (
                <div key={change.title} className="rounded-lg border border-border bg-card p-3">
                  <p className="text-[0.8125rem] font-semibold">{change.title}</p>
                  <p className="mt-0.5 text-[0.8125rem] leading-5 text-muted-foreground">{change.detail}</p>
                </div>
              ))}
            </div>
            <a
              href={SYLLABUS_VERSION.sources[3].url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-[0.8125rem] font-semibold text-info-foreground hover:underline"
            >
              新試験制度のシラバス案（IPA）
              <ExternalLink className="size-3" />
            </a>
          </div>
        </div>
      </section>

      <section className="mt-6 card p-5">
        <div className="flex items-center gap-2">
          <Layers className="size-4 text-info-foreground" />
          <h2 className="text-sm font-semibold">出典と検証日</h2>
        </div>
        <ul className="mt-2 space-y-1.5">
          {SYLLABUS_VERSION.sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[0.8125rem] text-muted-foreground hover:text-info-foreground">
                {source.label}
                <ExternalLink className="size-3" />
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[0.8125rem] leading-5 text-muted-foreground">
          検証日: {SYLLABUS_VERSION.verifiedAt}。試験時間・出題数は公式 SG ページ（{SYLLABUS_VERSION.examStructure.questions}問 /
          {SYLLABUS_VERSION.examStructure.minutes}分、科目A {SYLLABUS_VERSION.examStructure.partA}問・科目B{" "}
          {SYLLABUS_VERSION.examStructure.partB}問）に基づきます。
        </p>
      </section>
    </div>
  );
}
