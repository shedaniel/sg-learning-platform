import Link from "next/link";
import { ExternalLink, Info, ShieldCheck } from "lucide-react";
import { ALL_LESSONS, ALL_QUESTIONS, ALL_TERMS, OFFICIAL_QUESTIONS } from "@/content";
import { SYLLABUS_VERSION } from "@/content/syllabus";
import { PageHeader, Badge } from "@/components/ui/primitives";

export const dynamic = "force-static";

export default function AboutPage() {
  return (
    <div className="">
      <PageHeader
        eyebrow="About"
        title="このサイトについて"
        description="SG の日本語教材・演習・公式過去問・模擬試験を一つにした、非公式の学習プラットフォームです。"
      />

      <div className="mx-auto max-w-3xl space-y-5">
        <section className="card p-5 md:p-6">
          <div className="flex items-center gap-2">
            <Info className="size-4 text-accent" />
            <h2 className="text-sm font-semibold">目的と範囲</h2>
          </div>
          <p className="jp mt-2 text-sm leading-7 text-muted">
            技術的なバックグラウンドを持つ学習者が、SG の日本語用語と事例問題に慣れ、
            「理解 → 可視化 → 演習 → 復習 → 模擬試験」を回せるように設計しています。
            対象は情報セキュリティマネジメント試験（SG）です。FE・AP など他の区分は初期スコープに含みません。
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="rounded-lg border border-border bg-surface-2 p-3 text-center">
              <p className="mono text-xl font-semibold">{ALL_LESSONS.length}</p>
              <p className="text-[0.6rem] text-muted">レッスン</p>
            </div>
            <div className="rounded-lg border border-border bg-surface-2 p-3 text-center">
              <p className="mono text-xl font-semibold">{ALL_TERMS.length}</p>
              <p className="text-[0.6rem] text-muted">用語</p>
            </div>
            <div className="rounded-lg border border-border bg-surface-2 p-3 text-center">
              <p className="mono text-xl font-semibold">{ALL_QUESTIONS.length}</p>
              <p className="text-[0.6rem] text-muted">問題</p>
            </div>
            <div className="rounded-lg border border-border bg-surface-2 p-3 text-center">
              <p className="mono text-xl font-semibold">{OFFICIAL_QUESTIONS.length}</p>
              <p className="text-[0.6rem] text-muted">公式公開問題</p>
            </div>
          </div>
        </section>

        <section className="card p-5 md:p-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-accent" />
            <h2 className="text-sm font-semibold">公式情報と出典</h2>
          </div>
          <div className="mt-2 space-y-2 text-sm leading-7 text-muted">
            <p>
              試験制度・シラバスは IPA の公式情報を基準にしています。確認日は {SYLLABUS_VERSION.verifiedAt} です。
              制度は変更される可能性があるため、受験前に必ず公式ページを確認してください。
            </p>
            <ul className="space-y-1.5">
              {SYLLABUS_VERSION.sources.map((source) => (
                <li key={source.url}>
                  <a href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-accent hover:underline">
                    {source.label}
                    <ExternalLink className="size-3" />
                  </a>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <Badge tone="accent">現行 {SYLLABUS_VERSION.current}</Badge>
              <Badge>2027案 {SYLLABUS_VERSION.proposed}</Badge>
              <Badge>確認 {SYLLABUS_VERSION.verifiedAt}</Badge>
            </div>
          </div>
        </section>

        <section className="card p-5 md:p-6">
          <h2 className="text-sm font-semibold">公式過去問の扱い</h2>
          <p className="jp mt-2 text-sm leading-7 text-muted">
            IPA が公開している SG の CBT 公開問題（2023〜2026年度、各15問）を収録しています。
            実際の試験は60問ですが、公開されているのは一部のみです。本サイトは15問を「完全な過去問」として提示しません。
            問題文・選択肢は原文に基づき、図表は等価な表・箇条書きとして再構成しています。解説は本サイト独自のものです。
            2016〜2019年度の筆記試験は完全な問題冊子・解答例へのリンクをアーカイブしていますが、原本が画像PDFのためアプリ内出題はしていません。
          </p>
          <p className="mt-2 text-[0.7rem] leading-6 text-muted">
            IPA の公表資料は、法令の特別な定めがある場合を除き、許諾や使用料なく利用できます。出典・年度・問題番号・PDF URL を各問に表示しています。
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Link href="/past-papers" className="text-xs font-semibold text-accent hover:underline">過去問一覧 →</Link>
            <Link href="/coverage" className="text-xs font-semibold text-accent hover:underline">シラバス coverage →</Link>
          </div>
        </section>

        <section className="card p-5 md:p-6">
          <h2 className="text-sm font-semibold">スコアと合否について</h2>
          <p className="jp mt-2 text-sm leading-7 text-muted">
            本サイトの「暫定準備度」は、レッスン完了率・直近正答率・分野の広がり・模擬試験の独自加重です。
            IPA は IRT（項目応答理論）で評価点を算出し、総合600点/1000点で判定します。本サイトは公式の採点モデルを持たないため、
            合格可能性や評価点を再現・断定しません。模擬試験は素点と分野別傾向のみを表示します。
          </p>
        </section>

        <section className="card p-5 md:p-6">
          <h2 className="text-sm font-semibold">データとプライバシー</h2>
          <ul className="mt-2 space-y-1.5 text-[0.78rem] leading-6 text-muted">
            <li>・学習履歴は、初回訪問時に発行する匿名の HttpOnly Cookie に紐づけてローカル SQLite に保存します。</li>
            <li>・氏名・メールアドレス・アカウント登録は不要です。外部の解析サービスや広告は使用していません。</li>
            <li>・教材と問題はバージョン管理されたコードとして保持し、LLM がその場で生成する構成ではありません。</li>
            <li>・有料 AI サービスなしで全機能が動作します。</li>
          </ul>
        </section>

        <section className="card p-5 md:p-6">
          <h2 className="text-sm font-semibold">実装と制約</h2>
          <p className="jp mt-2 text-sm leading-7 text-muted">
            Next.js / TypeScript / React / Tailwind CSS / SQLite（node:sqlite）で構成しています。図解はテーマ対応の SVG、
            インタラクティブ例は React コンポーネントです。コンテンツは IPA シラバスに基づき独自執筆し、
            検証スクリプトで参照整合性・選択肢・カバレッジを検査しています。
          </p>
          <p className="mt-2 text-[0.7rem] leading-6 text-muted">
            既知の制約: 公式問題の図表はテキスト/表に再構成しており、原本の図形と完全に同一ではありません。
            2027年度改定案の項目は現行シラバスの出題範囲として扱っていません。科目Bの採点は素点です。
          </p>
        </section>

        <p className="text-center text-[0.65rem] leading-5 text-muted">
          本サイトは IPA の公式サイトではありません。情報セキュリティマネジメント試験の名称は説明目的で使用しています。
        </p>
      </div>
    </div>
  );
}
