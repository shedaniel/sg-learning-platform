import Link from "next/link";
import { FileText } from "lucide-react";
import { getLearner } from "@/lib/session";
import { getProgressSnapshot } from "@/lib/progress";
import { getMockHistory } from "@/lib/db/store";
import { LinkButton, PageHeader, ProgressBar } from "@/components/ui/primitives";
import { MockStartButton } from "@/components/mock/MockStartButton";
import { formatDate, percent } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MockPage() {
  const { id } = await getLearner();
  const snapshot = getProgressSnapshot(id);
  const history = getMockHistory(id);
  const latest = history[0];

  return (
    <div>
      <PageHeader
        title="模擬試験"
        description="本番と同じ科目A 48問 + 科目B 12問、60問・120分。フラグ、未解答表示、自動保存、時間切れの自動提出まで、本番に近い操作で練習します。"
        actions={
          <LinkButton href="/past-papers" className="h-10 px-4">
            <FileText className="size-4" />
            公式過去問を見る
          </LinkButton>
        }
      />

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_21rem]">
        <section aria-labelledby="mock-start-heading">
          <h2 id="mock-start-heading" className="text-lg font-semibold">
            構成と注意点
          </h2>
          <dl className="mt-4 grid max-w-xl grid-cols-3 divide-x divide-border rounded-xl border border-border">
            {[
              { label: "制限時間", value: "120", unit: "分" },
              { label: "科目A", value: "48", unit: "問" },
              { label: "科目B", value: "12", unit: "問" },
            ].map((item) => (
              <div key={item.label} className="px-4 py-3">
                <dt className="text-[0.8125rem] text-muted-foreground">{item.label}</dt>
                <dd className="mono mt-0.5 text-2xl font-semibold">
                  {item.value}
                  <span className="ml-1 text-[0.8125rem] font-normal text-muted-foreground">{item.unit}</span>
                </dd>
              </div>
            ))}
          </dl>

          <ul className="mt-6 max-w-xl list-disc space-y-1.5 pl-5 text-[0.9375rem] leading-7 marker:text-muted-foreground/60">
            <li>本番と同じ四肢択一。科目Bは事例・組合せ問題を含みます。</li>
            <li>問題ナビゲーション、フラグ、未解答の色分けを使えます。</li>
            <li>15秒ごとに自動保存。リロードしても続きから再開できます。</li>
            <li>残り10分でタイマーが警告色になり、0秒で自動提出されます。</li>
          </ul>

          <div className="mt-7">
            <MockStartButton disabled={snapshot.questionCount < 60} />
            <p className="mt-2 text-[0.8125rem] text-muted-foreground">
              開始するとタイマーが動きます。途中保存・再開ができます。
            </p>
          </div>

          <p className="mt-8 max-w-xl text-pretty text-[0.8125rem] leading-6 text-muted-foreground">
            IPA は IRT（項目応答理論）で評価点を算出します。本サイトの素点・正答率は公式スコアではなく、合格判定を再現するものではありません。出題は本サイトの独自問題と IPA 公開問題を混在させた学習用の抽出で、実際の CBT の出題順・難易度とは異なります。
          </p>
        </section>

        <aside className="space-y-10">
          <section aria-labelledby="latest-heading">
            <h2 id="latest-heading" className="text-lg font-semibold">
              {latest ? "前回の結果" : "まだ受けていません"}
            </h2>
            {latest ? (
              <>
                <p className="mt-2 flex items-baseline justify-between">
                  <span className="mono text-3xl font-semibold">{percent(latest.correct, latest.total)}%</span>
                  <span className="text-[0.8125rem] text-muted-foreground">{formatDate(latest.startedAt)}</span>
                </p>
                <ProgressBar value={percent(latest.correct, latest.total)} className="mt-2" label="前回の正答率" />
                <p className="mt-2 text-[0.8125rem] text-muted-foreground">
                  {latest.correct}/{latest.total}問 · {Math.round(latest.durationSec / 60)}分
                </p>
                <LinkButton href={`/mock/results/${latest.id}`} className="mt-3 h-10 w-full">
                  結果と解説を見る
                </LinkButton>
              </>
            ) : (
              <p className="mt-2 text-[0.9375rem] leading-7 text-muted-foreground">
                まずは現状把握に。時間配分と科目Bの読解負荷を知るだけでも価値があります。
              </p>
            )}
          </section>

          <section aria-labelledby="pace-heading">
            <h2 id="pace-heading" className="text-lg font-semibold">
              時間配分の目安
            </h2>
            <ul className="mt-2 divide-y divide-border text-[0.9375rem]">
              <li className="flex justify-between py-2.5">
                <span>科目A 48問</span>
                <span className="text-muted-foreground">約50分</span>
              </li>
              <li className="flex justify-between py-2.5">
                <span>科目B 12問</span>
                <span className="text-muted-foreground">約60分</span>
              </li>
              <li className="flex justify-between py-2.5">
                <span>見直し</span>
                <span className="text-muted-foreground">残り10分</span>
              </li>
            </ul>
            <p className="mt-3 text-[0.8125rem] leading-6 text-muted-foreground">
              科目Bは問題文が長く、組合せ選択肢もあります。Aで時間を作り、Bに60分残すのが現実的です。
            </p>
          </section>
        </aside>
      </div>

      {history.length > 0 ? (
        <section className="mt-14" aria-labelledby="history-heading">
          <h2 id="history-heading" className="text-lg font-semibold">
            履歴
          </h2>
          <ul className="mt-2 divide-y divide-border">
            {history.map((attempt) => (
              <li key={attempt.id}>
                <Link
                  href={`/mock/results/${attempt.id}`}
                  className="-mx-2 flex flex-wrap items-center gap-x-5 gap-y-1 rounded-lg px-2 py-3 text-[0.9375rem] transition-colors hover:bg-muted"
                >
                  <span className="text-muted-foreground">{formatDate(attempt.startedAt)}</span>
                  <span className="mono font-semibold">{percent(attempt.correct, attempt.total)}%</span>
                  <span className="text-muted-foreground">
                    {attempt.correct}/{attempt.total}問 · {Math.round(attempt.durationSec / 60)}分
                  </span>
                  <span className="ml-auto font-medium text-info-foreground">結果</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
