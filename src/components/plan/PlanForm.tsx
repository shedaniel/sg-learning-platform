"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Wand2 } from "lucide-react";
import type { StudyPlanInput } from "@/lib/content/types";

export function PlanForm({ initial }: { initial: StudyPlanInput }) {
  const router = useRouter();
  const [input, setInput] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof StudyPlanInput>(key: K, value: StudyPlanInput[K]) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? "プランを生成できませんでした");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "プランを生成できませんでした");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2">
        <Wand2 className="size-4 text-accent" />
        <h2 className="text-sm font-semibold">プラン条件</h2>
      </div>
      <div className="mt-4 space-y-3">
        <label className="block">
          <span className="text-[0.7rem] font-semibold text-muted">試験日</span>
          <input
            type="date"
            value={input.examDate}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(event) => update("examDate", event.target.value)}
            className="field mt-1"
          />
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="block">
            <span className="text-[0.7rem] font-semibold text-muted">1日の学習時間</span>
            <select
              value={input.minutesPerDay}
              onChange={(event) => update("minutesPerDay", Number(event.target.value))}
              className="field mt-1"
            >
              {[30, 45, 60, 90, 120].map((minutes) => (
                <option key={minutes} value={minutes}>{minutes}分</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-[0.7rem] font-semibold text-muted">週の学習日数</span>
            <select
              value={input.daysPerWeek}
              onChange={(event) => update("daysPerWeek", Number(event.target.value))}
              className="field mt-1"
            >
              {[3, 4, 5, 6, 7].map((days) => (
                <option key={days} value={days}>週{days}日</option>
              ))}
            </select>
          </label>
        </div>
        <label className="block">
          <span className="text-[0.7rem] font-semibold text-muted">IT・セキュリティの慣れ</span>
          <select
            value={input.familiarity}
            onChange={(event) => update("familiarity", event.target.value as StudyPlanInput["familiarity"])}
            className="field mt-1"
          >
            <option value="beginner">初めて（用語から）</option>
            <option value="basic">基礎はある（開発経験）</option>
            <option value="confident">実務で使っている</option>
          </select>
        </label>
        <label className="block">
          <span className="text-[0.7rem] font-semibold text-muted">日本語の技術文書の自信</span>
          <select
            value={input.japaneseConfidence}
            onChange={(event) => update("japaneseConfidence", event.target.value as StudyPlanInput["japaneseConfidence"])}
            className="field mt-1"
          >
            <option value="low">低い（N2・用語は苦手）</option>
            <option value="medium">中程度（N2・読める）</option>
            <option value="high">高い（業務で使う）</option>
          </select>
        </label>
        <button type="button" className="btn btn-primary w-full" onClick={() => void generate()} disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
          {loading ? "生成中…" : "プランを生成・更新"}
        </button>
        {error ? <p className="text-xs text-error">{error}</p> : null}
        <p className="text-[0.65rem] leading-5 text-muted">
          完了済みレッスンと誤答の多い分野を反映して再生成します。計画は学習の目安で、合格を保証するものではありません。
        </p>
      </div>
    </div>
  );
}
