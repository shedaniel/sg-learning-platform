import Link from "next/link";
import { AlertTriangle, CheckCircle2, Clock, FileText, Flag, RotateCcw, Timer } from "lucide-react";
import { getLearner } from "@/lib/session";
import { getProgressSnapshot } from "@/lib/progress";
import { getMockHistory } from "@/lib/db/store";
import { PageHeader, Badge, ProgressBar } from "@/components/ui/primitives";
import { MockStartButton } from "@/components/mock/MockStartButton";
import { formatDate, percent } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MockPage() {
  const { id } = await getLearner();
  const snapshot = getProgressSnapshot(id);
  const history = getMockHistory(id);
  const latest = history[0];

  return (
    <div className="">
      <PageHeader
        eyebrow="Mock examination"
        title="本番の120分を、一度体験する。"
        description="科目A 48問 + 科目B 12問、60問・120分。フラグ、未解答表示、自動保存、時間切れ自動提出まで本番に近い操作で練習します。"
        actions={
          <Link href="/past-papers" className="btn">
            <FileText className="size-4" />
            公式過去問を見る
          </Link>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
        <section className="card overflow-hidden">
          <div className="border-b border-border bg-muted/60 px-5 py-3">
            <div className="flex items-center gap-2">
              <Timer className="size-4 text-info-foreground" />
              <h2 className="text-xs font-semibold">模擬試験の構成</h2>
              <Badge className="ml-auto">非公式</Badge>
            </div>
          </div>
          <div className="p-5 md:p-6">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "制限時間", value: "120", unit: "分" },
                { label: "科目A", value: "48", unit: "問" },
                { label: "科目B", value: "12", unit: "問" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-muted p-3">
                  <p className="text-[0.65rem] text-muted-foreground">{item.label}</p>
                  <p className="mono mt-1 text-2xl font-semibold">
                    {item.value}
                    <span className="ml-1 text-xs font-normal text-muted-foreground">{item.unit}</span>
                  </p>
                </div>
              ))}
            </div>

            <ul className="mt-5 space-y-2 text-xs leading-6 text-muted-foreground">
              <li className="flex gap-2"><CheckCircle2 className="mt-1 size-3.5 shrink-0 text-success-foreground" />本番と同じ四肢択一。科目Bは事例・組合せ問題を含みます。</li>
              <li className="flex gap-2"><CheckCircle2 className="mt-1 size-3.5 shrink-0 text-success-foreground" />問題ナビゲーション、フラグ、未解答の色分け。</li>
              <li className="flex gap-2"><CheckCircle2 className="mt-1 size-3.5 shrink-0 text-success-foreground" />15秒ごとの自動保存。リロードしても続きから再開。</li>
              <li className="flex gap-2"><Flag className="mt-1 size-3.5 shrink-0 text-warning-foreground" />残り10分でタイマーが警告色に。0秒で自動提出。</li>
            </ul>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-start">
              <MockStartButton disabled={snapshot.questionCount < 60} />
              <div className="rounded-lg border border-warning/30 bg-warning/5 px-3 py-2 text-[0.65rem] leading-5 text-muted-foreground sm:max-w-xs">
                IPA は IRT（項目応答理論）で評価点を算出します。本サイトの素点・正答率は公式スコアではなく、合格判定を再現するものではありません。
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="card p-5">
            <p className="eyebrow">Your baseline</p>
            <p className="mt-2 text-sm font-semibold">
              {latest ? "前回の模擬試験" : "まだ模擬試験を受けていません"}
            </p>
            {latest ? (
              <>
                <div className="mt-3 flex items-end justify-between">
                  <p className="mono text-3xl font-semibold">{percent(latest.correct, latest.total)}%</p>
                  <p className="text-[0.65rem] text-muted-foreground">{formatDate(latest.startedAt)}</p>
                </div>
                <ProgressBar value={percent(latest.correct, latest.total)} className="mt-2" />
                <p className="mt-2 text-[0.65rem] text-muted-foreground">
                  {latest.correct}/{latest.total}問 · {Math.round(latest.durationSec / 60)}分
                </p>
                <Link href={`/mock/results/${latest.id}`} className="btn mt-3 w-full text-xs">
                  <RotateCcw className="size-3.5" />
                  結果と解説を見る
                </Link>
              </>
            ) : (
              <p className="mt-2 text-[0.7rem] leading-6 text-muted-foreground">
                まずは現状把握。時間配分と科目Bの読解負荷を知るだけでも価値があります。
              </p>
            )}
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-info-foreground" />
              <p className="text-xs font-semibold">時間配分の目安</p>
            </div>
            <ul className="mt-2 space-y-1 text-[0.7rem] leading-5 text-muted-foreground">
              <li>科目A: 48問を約50分（1問60秒）</li>
              <li>科目B: 12問を約60分（1問5分）</li>
              <li>見直し: 残り10分</li>
            </ul>
            <p className="mt-2 text-[0.65rem] leading-5 text-muted-foreground">
              科目Bは問題文が長く、組合せ選択肢もあります。Aで時間を作り、Bに60分残すのが現実的です。
            </p>
          </div>
        </aside>
      </div>

      {history.length > 0 ? (
        <section className="card mt-6 overflow-hidden">
          <div className="border-b border-border bg-muted/60 px-4 py-2.5">
            <h2 className="text-xs font-semibold">模擬試験の履歴</h2>
          </div>
          <ul className="divide-y divide-border">
            {history.map((attempt) => (
              <li key={attempt.id} className="flex flex-wrap items-center gap-3 px-4 py-3 text-xs">
                <span className="mono text-muted-foreground">{formatDate(attempt.startedAt)}</span>
                <span className="font-semibold">{percent(attempt.correct, attempt.total)}%</span>
                <span className="text-muted-foreground">{attempt.correct}/{attempt.total}</span>
                <span className="text-muted-foreground">{Math.round(attempt.durationSec / 60)}分</span>
                <Link href={`/mock/results/${attempt.id}`} className="ml-auto text-info-foreground hover:underline">
                  結果
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-6 rounded-xl border border-border bg-muted p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning-foreground" />
          <p className="text-[0.7rem] leading-5 text-muted-foreground">
            本模擬試験は、本サイトの独自問題と IPA 公開問題を混在させた学習用の抽出です。実際の CBT の出題順・難易度・IRT 評価を再現するものではありません。
          </p>
        </div>
      </section>
    </div>
  );
}
