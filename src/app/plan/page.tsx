import Link from "next/link";
import { CalendarDays, CheckCircle2, Clock, Info, Target } from "lucide-react";
import type { StudyPlan, StudyPlanInput } from "@/lib/content/types";
import { getLearner } from "@/lib/session";
import { getProgressSnapshot } from "@/lib/progress";
import { getStudyPlan } from "@/lib/db/store";
import { PageHeader, ProgressBar, Stat } from "@/components/ui/primitives";
import { PlanForm } from "@/components/plan/PlanForm";
import { planSummary } from "@/lib/study-plan";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const KIND_LABEL: Record<string, string> = {
  lesson: "レッスン",
  quiz: "クイズ",
  review: "復習",
  mock: "模擬試験",
  rest: "休息",
};

const KIND_TONE: Record<string, string> = {
  lesson: "bg-accent",
  quiz: "bg-c3",
  review: "bg-warning",
  mock: "bg-c4",
  rest: "bg-border",
};

export default async function PlanPage() {
  const { id } = await getLearner();
  const snapshot = getProgressSnapshot(id);
  const stored = getStudyPlan(id);
  const storedPlan = (stored?.plan as StudyPlan | null) ?? null;
  const defaultInput: StudyPlanInput = (stored?.input as StudyPlanInput | undefined) ?? {
    examDate: new Date(Date.now() + 60 * 86_400_000).toISOString().slice(0, 10),
    minutesPerDay: 60,
    daysPerWeek: 5,
    familiarity: "basic",
    japaneseConfidence: "medium",
  };
  const summary = storedPlan ? planSummary(storedPlan) : null;
  const days = storedPlan?.days?.slice(0, 42) ?? [];

  return (
    <div className="animate-in">
      <PageHeader
        eyebrow="Study plan"
        title="試験日から、逆算する。"
        description="1日の時間と週の日数を入力すると、未完了レッスン・弱点・模擬試験を並べた現実的な計画を作ります。進捗に合わせて何度でも再生成できます。"
        actions={
          <Link href="/statistics" className="btn">
            <Target className="size-4" />
            現在地を確認
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <div className="space-y-4">
          <PlanForm initial={defaultInput} />
          <div className="card p-4">
            <div className="flex items-center gap-2">
              <Info className="size-4 text-accent" />
              <p className="text-xs font-semibold">設計の前提</p>
            </div>
            <ul className="mt-2 space-y-1.5 text-[0.68rem] leading-5 text-muted">
              <li>・レッスン1本 = 約30分（日本語が不安な場合は40分）</li>
              <li>・5学習日ごとに復習、12学習日ごとに模擬試験</li>
              <li>・最終2日は新しい教材を増やさず、誤答と用語に集中</li>
              <li>・弱点トピックを先に配置</li>
            </ul>
          </div>
        </div>

        <div>
          {!storedPlan ? (
            <div className="card p-8 text-center">
              <CalendarDays className="mx-auto size-6 text-muted" />
              <h2 className="mt-3 font-semibold">まだプランがありません</h2>
              <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-muted">
                左の条件を設定して「プランを生成」を押してください。現在の進捗（完了{" "}
                {snapshot.completedLessons} レッスン、誤答 {snapshot.reviewQuestions.length} 問）を反映します。
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat label="試験日" value={formatDate(storedPlan.input.examDate)} sub={`${storedPlan.days.length}日間`} />
                <Stat label="学習日" value={summary?.studyDays ?? 0} sub={`1日${storedPlan.input.minutesPerDay}分`} />
                <Stat label="総時間" value={`${summary?.totalHours ?? 0}h`} sub="読解+演習+復習" />
                <Stat label="模擬試験" value={summary?.mocks ?? 0} sub="120分×回数" />
              </div>

              <div className="card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="eyebrow">Next 6 weeks</p>
                    <h2 className="mt-1 text-sm font-semibold">学習カレンダー</h2>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[0.6rem] text-muted">
                    {Object.entries(KIND_LABEL).map(([kind, label]) => (
                      <span key={kind} className="flex items-center gap-1">
                        <span className={`size-2 rounded-sm ${KIND_TONE[kind]}`} />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-3 max-h-[560px] space-y-2 overflow-y-auto pr-1 scrollbar-thin">
                  {days.map((day) => (
                    <div
                      key={day.date}
                      className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 ${
                        day.kind === "rest" ? "border-transparent bg-surface-2/40" : "border-border bg-surface"
                      }`}
                    >
                      <div className="w-14 shrink-0">
                        <p className="mono text-[0.65rem] text-muted">{day.date.slice(5)}</p>
                        <p className="text-[0.55rem] text-muted">
                          {new Date(`${day.date}T00:00:00`).toLocaleDateString("ja-JP", { weekday: "short" })}
                        </p>
                      </div>
                      <span className={`mt-1.5 size-2 shrink-0 rounded-full ${KIND_TONE[day.kind]}`} />
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs leading-5 ${day.kind === "rest" ? "text-muted" : "font-medium"}`}>
                          {day.title}
                        </p>
                        {day.minutes > 0 ? (
                          <p className="mono mt-0.5 text-[0.6rem] text-muted">
                            {day.minutes}分 · {KIND_LABEL[day.kind]}
                          </p>
                        ) : null}
                      </div>
                      {day.href && day.kind !== "rest" ? (
                        <Link href={day.href} className="shrink-0 text-[0.65rem] text-accent hover:underline">
                          開く
                        </Link>
                      ) : null}
                    </div>
                  ))}
                </div>
                {storedPlan.days.length > 42 ? (
                  <p className="mt-2 text-[0.65rem] text-muted">…全{storedPlan.days.length}日（表示は先頭42日）</p>
                ) : null}
              </div>

              <div className="card p-5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-success" />
                  <h2 className="text-xs font-semibold">このプランの注意点</h2>
                </div>
                <ul className="mt-2 space-y-1.5">
                  {storedPlan.notes.map((note, index) => (
                    <li key={index} className="text-[0.7rem] leading-5 text-muted">
                      ・{note}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex items-center gap-2 text-[0.65rem] text-muted">
                  <Clock className="size-3" />
                  生成: {formatDate(storedPlan.generatedAt)} / 現在の完了率 {snapshot.lessonPercent}%
                </div>
                <ProgressBar value={snapshot.lessonPercent} className="mt-2" height={5} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
